# WedPlan — Wedding Planning Platform (Client)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Name and Description

**WedPlan** is a wedding planning platform where customers can discover wedding-related services and request bookings from different vendors.

Vendors can create their profiles, publish wedding services, and manage customer booking requests. They can also upgrade to a Premium subscription to publish unlimited services and get additional promotional benefits.

Admins manage users, review published services, and monitor platform transactions.

The goal is to build a complete role-based web application using Next.js, TypeScript, ShadCN, Express.js, MongoDB, Better Auth, and Stripe.

## Important Features

- Public home page with banner, featured wedding services (approved & active), wedding service categories, and "Why Choose WedPlan?" section.
- Browse services page with search (name), category filter, location filter and price sorting (asc / desc), loading and empty states.
- Service details page with image gallery, description, pricing, vendor info and a booking request form.
- Customer and Vendor dashboards with role-based navigation.
- Vendor service management (create, update, delete, publish/hide, approval status).
- Booking request workflow (customer submits → vendor accepts/rejects → customer cancels).
- Admin service review workflow (approve / reject / change status / delete).
- Better Auth (email + password + Google) with JWT bridge to the Express backend.

## Technology Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + ShadCN
- Framer Motion
- Better Auth (Next.js)
- Express.js + MongoDB
- Stripe (Checkout + webhooks)
- ImgBB (image hosting)

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit it.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Installation Instructions

1. Clone the client repository.
2. Copy `.env` to `.env.local` and fill in all required environment variables.

## How to Run the Project Locally

### Client

```bash
npm install
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000).

### Server

```bash
cd ../wedplan-backend
npm install
npm run dev
```

The API runs on [http://localhost:5000](http://localhost:5000).

## Live Website Link

To be connected once deployed.

## Client and Server Repository Links

- Client: [wedplan-frontend](https://github.com/your-org/wedplan-frontend)
- Server: [wedplan-backend](https://github.com/your-org/wedplan-backend)

## Environment Variables

Required application URLs and secrets:

- MongoDB Connection String
- Better Auth Secret and Configuration
- Google OAuth Credentials
- Stripe Secret Key and Webhook Secret
- ImgBB API Key
- Required Application URLs

## Deployment Guideline

- Keep all sensitive information in environment variables.
- Never push `.env` files or secret credentials to GitHub.
- Ensure no CORS issues, 404 issues or 504 issues.
- Reloading any route should not throw errors.
- Private routes should work after page refresh.
- Logged-in users should remain authenticated.

## Evaluation Notes

- Admin credentials provided for evaluation should work on the live site.
- Stripe Checkout and webhook flow should work on the live site.
