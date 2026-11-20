# Additional Instructions Required to Test the Application

## Live URLs

- **Frontend:** https://wedplan-frontend-nu.vercel.app
- **Backend API:** https://wedplan-backend-hazel.vercel.app/api

## Admin access

- **Email:** `robiul@jpr.com`
- **Password:** the password supplied with the submission.
- If the password needs resetting, run this from the frontend folder:

```bash
node scripts/update-admin.cjs --password "newPassword"
```

## Google sign-in

Before testing Google sign-in, make sure the OAuth client in Google Cloud Console has:

1. **Authorized redirect URI:**
   `https://wedplan-frontend-nu.vercel.app/api/auth/callback/google`
2. The tester's Google account added under **OAuth consent screen → Test users** (while the app is in Testing mode).

## Testing the role workflows

1. Sign up as a **customer** or **vendor** at `/sign-up`.
2. A vendor can create and publish a service; it stays `pending` until approved.
3. Sign in as the admin and open **Dashboard → Service Moderation**.
   - **Approve** only changes the status to `approved`.
   - **Reject** permanently deletes the service **and all of its bookings** after a confirmation prompt. This cannot be undone.

## Stripe

For checkout/webhook testing, configure the Stripe webhook endpoint as:

```
https://wedplan-backend-hazel.vercel.app/api/stripe/webhook
```

and set `STRIPE_WEBHOOK_SECRET` in the backend Vercel environment variables.

## Running locally

1. Start the backend on port 5000:

```bash
cd wedplan-backend
npm install
npm run dev
```

2. Start the frontend on port 3000:

```bash
cd wedplan-frontend
npm install
npm run dev
```

3. Local environment variables must include:

```
CLIENT_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
BETTER_AUTH_URL=http://localhost:3000
```
