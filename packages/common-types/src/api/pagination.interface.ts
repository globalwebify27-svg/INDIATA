/**
 * Standard pagination metadata returned in list endpoints.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Standard pagination and sorting query parameters.
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Standard paginated list result container.
 */
export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
