export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: {
    statusCode: number;
    errorCode: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
