import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const authSecret = process.env.BETTER_AUTH_SECRET;

if (!mongoUri) {
  throw new Error(
    "MONGODB_URI is not set. Add it to .env before starting the app.",
  );
}

if (!authSecret) {
  throw new Error(
    "BETTER_AUTH_SECRET is not set. Add it to .env before starting the app.",
  );
}

// Next.js hot-reloads modules in development, which would otherwise open a new
// Mongo connection on every change. Cache the client on globalThis.
const globalForMongo = globalThis as unknown as {
  wedplanMongoClient?: MongoClient;
};

const mongoClient =
  globalForMongo.wedplanMongoClient ?? new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.wedplanMongoClient = mongoClient;
}

export const auth = betterAuth({
  // better-auth writes to the same `user` collection the Express backend reads,
  // so roles set by POST /api/auth/jwt are visible to both sides.
  database: mongodbAdapter(mongoClient.db(), {
    client: mongoClient,
    // Standalone MongoDB servers don't support multi-document transactions.
    transaction: false,
  }),
  secret: authSecret,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },
  // Google OAuth provider. better-auth requires social providers to be nested
  // under `socialProviders` (a top-level `google` key is silently ignored and
  // results in "Provider not found" on POST /api/auth/sign-in/social).
  // Credentials live in the FRONTEND .env because this file runs in Next.js.
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  user: {
    additionalFields: {
      // Owned by the Express backend (POST /api/auth/jwt sets it), never by the
      // client — `input: false` stops a user from signing up as "admin".
      role: {
        type: "string",
        required: false,
        input: false,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        input: false,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  // Must be the last plugin so Set-Cookie headers survive server actions.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
