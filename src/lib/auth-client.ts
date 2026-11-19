"use client";

import { createAuthClient } from "better-auth/react";

// No baseURL on purpose: the client calls /api/auth/* on the same origin that
// served the page, so it keeps working on any port (3000, 3001, a preview URL).
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
