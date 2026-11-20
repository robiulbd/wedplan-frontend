/**
 * Update the WedPlan admin's display name, password, and/or email in MongoDB.
 *
 * Usage (run from the frontend folder):
 *   node scripts/update-admin.cjs --name "New Name" --password "newPassword123" --email "new@email.com"
 *
 * Only pass the flags you want to change, e.g.:
 *   node scripts/update-admin.cjs --email "new@email.com"
 *
 * Optional: set ADMIN_EMAIL to target a different admin account.
 *   $env:ADMIN_EMAIL="qa.admin@example.com"; node scripts/update-admin.cjs "New Name" "newPassword"
 */

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const { hashPassword } = require("@better-auth/utils/password");

const envPath = path.join(__dirname, "..", ".env");
const envText = fs.readFileSync(envPath, "utf8");
const uriMatch = envText.match(/^MONGODB_URI=(.*)$/m);
if (!uriMatch) {
  console.error("MONGODB_URI is missing from .env");
  process.exit(1);
}
const mongoUri = uriMatch[1].trim().replace(/^["']|["']$/g, "");

const email = (process.env.ADMIN_EMAIL || "qa.admin@example.com").toLowerCase();
const args = process.argv.slice(2);
const flags = {};
for (let i = 0; i < args.length; i += 1) {
  const flag = args[i];
  if (flag === "--name" || flag === "--password" || flag === "--email") {
    flags[flag.slice(2)] = args[i + 1] ?? null;
    i += 1;
  }
}

// Positional arguments are still accepted for backwards compatibility.
const [rawName, rawPassword, rawNewEmail] =
  flags.name || flags.password || flags.email ? [] : args;
const name = (flags.name ?? rawName) ? String(flags.name ?? rawName).trim() : null;
const password = flags.password ?? rawPassword ?? null;
const newEmail = (flags.email ?? rawNewEmail)
  ? String(flags.email ?? rawNewEmail).trim().toLowerCase()
  : null;

if (!name && !password && !newEmail) {
  console.error('Provide at least one flag. Example:\n  node scripts/update-admin.cjs --email "new@email.com"');
  process.exit(1);
}
if (name && name.length < 2) {
  console.error("The name must be at least 2 characters.");
  process.exit(1);
}
if (password && password.length < 6) {
  console.error("The password must be at least 6 characters.");
  process.exit(1);
}
if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
  console.error("The new email address is not valid.");
  process.exit(1);
}

(async () => {
  const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  const db = client.db();
  const users = db.collection("user");
  const accounts = db.collection("account");

  const admin = await users.findOne({ email, role: "admin" });
  if (!admin) {
    throw new Error(`No admin user found with email ${email}`);
  }

  if (newEmail && newEmail !== email) {
    const existing = await users.findOne({ email: newEmail });
    if (existing && String(existing._id) !== String(admin._id)) {
      throw new Error(`Another user already has the email ${newEmail}`);
    }
  }

  const userId = String(admin._id);
  const update = {};
  if (name) update.name = name;
  if (newEmail) update.email = newEmail;
  if (Object.keys(update).length) {
    update.updatedAt = new Date();
    await users.updateOne({ _id: admin._id }, { $set: update });
  }

  if (password) {
    const hashedPassword = await hashPassword(password);
    const now = new Date();
    // Better Auth stores account.userId as an ObjectId reference to user._id,
    // while account.accountId stays a string. Matching the real schema matters
    // because sign-in looks the credential account up through the adapter.
    await accounts.updateOne(
      { providerId: "credential", accountId: userId },
      {
        $set: {
          providerId: "credential",
          accountId: userId,
          userId: admin._id,
          password: hashedPassword,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
  }

  console.log("Admin updated:");
  console.log("  email:", newEmail || email);
  console.log("  name:", name || admin.name);
  console.log("  password:", password ? "updated" : "unchanged");
  console.log("Sign in at /sign-in with the current email and password.");

  await client.close();
})().catch(async (error) => {
  console.error("FAILED:", error.message);
  process.exit(2);
});
