export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return "https://indiata.onrender.com/api/v1";
  }
  if (process.env.NODE_ENV === "production") {
    return "https://indiata.onrender.com/api/v1";
  }
  return "http://localhost:4000/api/v1";
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
  timestamp: string;
  requestId: string;
}

export class ApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Standard HTTP fetch wrapper with authorization header injection and error handling.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  // Read auth token from localStorage if in browser environment
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("rajtantra_access_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      let errorMessage =
        body.message ||
        body.error?.message ||
        (typeof body.error === "string" ? body.error : "") ||
        `Request failed with status ${response.status}`;

      const details = body?.error?.details || body?.details;
      if (Array.isArray(details) && details.length > 0) {
        const detailStr = details
          .map((d: any) => `${d.field ? `${d.field}: ` : ""}${d.message}`)
          .join(", ");
        if (detailStr) {
          errorMessage = detailStr;
        }
      }

      throw new ApiError(errorMessage, response.status, body);
    }

    return body as ApiResponse<T>;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Network error occurred";
    throw new ApiError(message, 500);
  }
}
