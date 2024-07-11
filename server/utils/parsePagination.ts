import type { Pagination } from "~/server/model/trpc";

export default function (pagination: Pagination | undefined): { take: number | undefined; skip: number | undefined } {
  return pagination
    ? {
        take: pagination.itemsPerPage ? pagination.itemsPerPage : undefined,
        skip: pagination.page && pagination.itemsPerPage ? (pagination.page - 1) * pagination.itemsPerPage : undefined,
      }
    : { take: undefined, skip: undefined };
}
