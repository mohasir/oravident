export type PaginationMeta = {
  total: number;
  page: number;
  size: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  items: T[];
  pagination?: PaginationMeta;
};
