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

export const usePagination = (initialPage: number, limit: number, totalLength: number): PaginationReturn => {
  const totalPages = Math.ceil(totalLength / limit);
  if (initialPage > totalPages || initialPage < 0) {
    throw new Error("Wrong page");
  }
  const [currentPage, setPage] = useState(initialPage);
  const hasNextPage =  currentPage < totalPages;
  const hasPrevPage = currentPage > 0;
  
  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setPage((curPage) => curPage + 1)
    }
  }, [hasNextPage])

  const goToPrevPage = useCallback(() => {
    if (hasPrevPage) {
      setPage((curPage) => curPage - 1)
    }
  }, [hasPrevPage]);

  return useMemo(() => ({
    currentPageParams: { limit, offset: calcOffset(currentPage, limit)},
    nextPageParams: hasNextPage ? { limit, offset: calcOffset(currentPage + 1, limit) } : null,
    prevPageParams: hasPrevPage ? { limit, offset: calcOffset(currentPage - 1, limit) } : null,
    hasNextPage,
    hasPrevPage,
    currentPage,
    goToNextPage,
    goToPrevPage
  }), [hasNextPage, hasPrevPage, goToNextPage, goToPrevPage, limit, currentPage])
}