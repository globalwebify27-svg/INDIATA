import { ApiResponse } from "@rajtantra/common-types";

export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

declare const process: {
  env: Record<string, string | undefined>;
};

export const API_BASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
  "http://localhost:4000/api/v1";

/**
 * Universal typed API client for browser and server runtime.
 * Automatically handles credentials (cookies) and JSON encoding.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<ApiResponse<T>> {
  const { body, params, headers, ...rest } = options;

  let url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined) {
        searchParams.append(key, String(val));
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      url += (url.includes("?") ? "&" : "?") + qs;
    }
  }

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  let serializedBody: BodyInit | undefined;
  if (body !== undefined) {
    if (body instanceof FormData) {
      serializedBody = body;
    } else {
      reqHeaders["Content-Type"] = "application/json";
      serializedBody = JSON.stringify(body);
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers: reqHeaders,
    body: serializedBody,
    credentials: "include", // Send and receive HttpOnly session cookies
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!isJson) {
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    return {
      success: true,
      message: response.statusText,
      timestamp: new Date().toISOString(),
      statusCode: response.status,
    } as unknown as ApiResponse<T>;
  }

  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !data.success) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export default apiFetch;
