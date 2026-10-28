import { PaginationMeta } from "./pagination.interface";

/**
 * Standard uniform success response contract for all Rajtantra REST APIs.
 */
export interface ApiResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
  requestId: string;
}

/**
 * Structured error details object.
 */
export interface ApiErrorDetails {
  code: string;
  details?: unknown;
}

/**
 * Standard uniform error response contract for all Rajtantra REST APIs.
 */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error: ApiErrorDetails;
  timestamp: string;
  requestId: string;
}
