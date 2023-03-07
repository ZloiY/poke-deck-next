import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

type PaginationReturn = {
  currentPageParams: { limit: number, offset: number },
  nextPageParams: { limit: number, offset: number } | null,
  prevPageParams: { limit: number, offset: number } | null,
  hasPrevPage: boolean,
  hasNextPage: boolean,
  currentPage: number,
  goToNextPage: () => void,
  goToPrevPage: () => void,
}

const calcOffset = (page: number, limit: number) => page * limit;

export const usePagination = (page: number, limit: number, totalLength: number, rootRoute: string): PaginationReturn => {
  const route = useRouter();
  const initialPage = page;
  const totalPages = Math.ceil(totalLength / limit);
  if (initialPage > totalPages || initialPage < 0) {
    throw new Error("Wrong page");
  }
  const hasNextPage =  initialPage < totalPages;
  const hasPrevPage = initialPage > 0;
  
  const goToNextPage = useCallback(() => {
    const { search } =  route.query;
    if (hasNextPage) {
      route.push({
        pathname: `${rootRoute}/[page]`,
        query: {
          search,
          page: page + 1,
        }
      })
    }
  }, [hasNextPage, page, route])

  const goToPrevPage = useCallback(() => {
    const { search } =  route.query;
    if (hasPrevPage) {
      route.push({
        pathname: `${rootRoute}/[page]`,
        query: {
          search,
          page: page - 1,
        }
      })
    }
  }, [hasPrevPage, page, route]);

  return useMemo(() => ({
    currentPageParams: { limit, offset: calcOffset(page, limit)},
    nextPageParams: hasNextPage ? { limit, offset: calcOffset(page + 1, limit) } : null,
    prevPageParams: hasPrevPage ? { limit, offset: calcOffset(page - 1, limit) } : null,
    hasNextPage,
    hasPrevPage,
    currentPage: page,
    goToNextPage,
    goToPrevPage
  }), [hasNextPage, hasPrevPage, goToNextPage, goToPrevPage, limit, page])
}