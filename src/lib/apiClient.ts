const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "");

interface ErrorPayload {
  message?: string;
}

/**
 * Google (OAuth) sign-in creates a better-auth session but does NOT mint the
 * Express backend JWT that `apiRequest` sends as a Bearer token. This exchanges
 * the session's email for a backend JWT (and sets a default role server-side on
 * first login). Safe to call repeatedly — it no-ops when a token already exists.
 */
export async function ensureBackendJwt(email: string): Promise<void> {
  if (typeof window === "undefined" || !email) return;
  if (localStorage.getItem("wedplan_jwt")) return;

  // A role picked on the sign-up page survives the Google redirect so a
  // "vendor" sign-up doesn't silently become a customer account.
  const pendingRole = localStorage.getItem("wedplan_pending_role");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        ...(pendingRole ? { role: pendingRole } : {}),
      }),
    });

    if (!response.ok) return;

    const data = (await response.json()) as { token?: string };
    if (data?.token) {
      localStorage.setItem("wedplan_jwt", data.token);
      localStorage.removeItem("wedplan_pending_role");
    }
  } catch {
    // Non-fatal: the dashboard falls back to the better-auth session.
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("wedplan_jwt")
      : null;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  let parsedBody: unknown = null;
  try {
    parsedBody = await response.json();
  } catch {
    parsedBody = null;
  }

  if (!response.ok) {
    const errorMessage =
      typeof parsedBody === "object" &&
      parsedBody !== null &&
      "message" in parsedBody &&
      typeof (parsedBody as ErrorPayload).message === "string"
        ? (parsedBody as ErrorPayload).message
        : `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return parsedBody as T;
}