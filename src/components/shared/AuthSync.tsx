"use client";

import { useEffect } from "react";
import { ensureBackendJwt } from "@/lib/apiClient";
import { useSession } from "@/lib/auth-client";

/**
 * Keeps the Express backend JWT in sync with the better-auth session.
 *
 * Email/password sign-in and sign-up already store the JWT themselves. Google
 * OAuth (and any session restored after a reload/another tab) only has the
 * better-auth session, so without this the API calls would 401.
 */
export default function AuthSync() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;
    void ensureBackendJwt(email);
  }, [email]);

  return null;
}