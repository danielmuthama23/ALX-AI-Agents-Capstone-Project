import { useState, useMemo } from 'react';

interface UsePaginationProps {
  totalItems: number;
  initialPage?: number;
  initialLimit?: number;
  maxLimit?: number;
}

interface UsePaginationReturn {
  page: number;
  limit: number;
  totalPages: number;
  offset: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  canNextPage: boolean;
  canPrevPage: boolean;
}

export const usePagination = ({
  totalItems,
  initialPage = 1,
  initialLimit = 10,
  maxLimit = 100
}: UsePaginationProps): UsePaginationReturn => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / limit);
  }, [totalItems, limit]);

  const offset = useMemo(() => {
    return (page - 1) * limit;
  }, [page, limit]);

  const canNextPage = page < totalPages;
  const canPrevPage = page > 1;

  const nextPage = () => {
    if (canNextPage) {
      setPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (canPrevPage) {
      setPage(prev => prev - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    setPage(validPage);
  };

  const handleSetLimit = (newLimit: number) => {
    const validLimit = Math.max(1, Math.min(newLimit, maxLimit));
    setLimit(validLimit);
    setPage(1); // Reset to first page when changing limit
  };

  return {
    page,
    limit,
    totalPages,
    offset,
    setPage,
    setLimit: handleSetLimit,
    nextPage,
    prevPage,
    goToPage,
    canNextPage,
    canPrevPage
  };
};