const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "");

interface ErrorPayload {
  message?: string;
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