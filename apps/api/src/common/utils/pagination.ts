import { PaginatedResult } from '@common/types/pagination.ts';

export const paginatedResult = <T>(
  data: T[],
  total: number,
  pagination?: { page?: number; limit?: number },
): PaginatedResult<T> => {
  if (pagination?.page !== undefined && pagination?.limit !== undefined) {
    return {
      items: data,
      pagination: {
        total,
        page: pagination.page,
        size: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  return {
    items: data,
  };
};
