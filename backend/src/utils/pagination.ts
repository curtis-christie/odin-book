import type { PaginationQuery } from "../schemas/paginationSchemas.js";

export type PaginationMeta = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function getPaginationOffset(query: PaginationQuery): number {
  return (query.page - 1) * query.limit;
}

export function createPaginationMeta(
  query: PaginationQuery,
  totalCount: number,
): PaginationMeta {
  const totalPages = Math.ceil(totalCount / query.limit);

  return {
    page: query.page,
    limit: query.limit,
    totalCount,
    totalPages,
    hasNextPage: query.page < totalPages,
    hasPreviousPage: query.page > 1,
  };
}
