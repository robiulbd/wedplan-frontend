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

// Narrowed copies so closures below don't see `string | undefined`.
const mongoConnectionString: string = mongoUri;

// Next.js hot-reloads modules in development, which would otherwise open a new
// Mongo connection on every change. Cache the client on globalThis so serverless
// invocations reuse it too.
const globalForMongo = globalThis as unknown as {
  wedplanMongoClient?: MongoClient;
};

function createMongoClient(): MongoClient {
  const client = new MongoClient(mongoConnectionString, {
    serverSelectionTimeoutMS: 10_000,
  });
  globalForMongo.wedplanMongoClient = client;
  return client;
}

function getMongoClient(): MongoClient {
  return globalForMongo.wedplanMongoClient ?? createMongoClient();
}

function discardMongoClient(): void {
  const client = globalForMongo.wedplanMongoClient;
  globalForMongo.wedplanMongoClient = undefined;
  // A failed topology may already be closed; never let cleanup break a request.
  if (client) void client.close().catch(() => undefined);
}

function isDeadClientError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "MongoTopologyClosedError" ||
    /topology is closed|must be connected/i.test(error.message)
  );
}

type MongoAdapterFactory = ReturnType<typeof mongodbAdapter>;
type MongoAdapter = ReturnType<MongoAdapterFactory>;
type AdapterOptions = Parameters<MongoAdapterFactory>[0];

const baseAdapterFactory = mongodbAdapter(getMongoClient().db(), {
  client: getMongoClient(),
  // Standalone MongoDB servers don't support multi-document transactions.
  transaction: false,
});

// A transient Atlas network failure can permanently close the cached driver
// topology ("MongoTopologyClosedError"). Retry the failed adapter call once
// with a brand-new client so sign-up/sign-in recover without a redeploy.
const resilientAdapterFactory = (options: AdapterOptions): MongoAdapter => {
  const adapter = baseAdapterFactory(options);

  return new Proxy(adapter, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, target);
      if (typeof prop !== "string" || typeof value !== "function") {
        return value;
      }

      const method = value as (...args: unknown[]) => unknown;
      return async (...args: unknown[]) => {
        try {
          return await method.apply(target, args);
        } catch (error) {
          if (!isDeadClientError(error)) throw error;

          discardMongoClient();
          const freshClient = getMongoClient();
          const freshAdapter = mongodbAdapter(freshClient.db(), {
            client: freshClient,
            transaction: false,
          })(options);
          const freshMethod = Reflect.get(freshAdapter, prop, freshAdapter);
          if (typeof freshMethod !== "function") throw error;

          return await (freshMethod as (...args: unknown[]) => unknown).apply(
            freshAdapter,
            args,
          );
        }
      };
    },
  }) as MongoAdapter;
};

export const auth = betterAuth({
  // better-auth writes to the same `user` collection the Express backend reads,
  // so roles set by POST /api/auth/jwt are visible to both sides.
  database: resilientAdapterFactory,
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
