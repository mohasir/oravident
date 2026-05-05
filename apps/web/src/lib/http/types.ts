export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
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
