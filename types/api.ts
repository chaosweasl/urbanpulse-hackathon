// ─── API Response Types ─────────────────────────────────

/** Standard API response wrapper — all endpoints use this */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Paginated response for list endpoints */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
