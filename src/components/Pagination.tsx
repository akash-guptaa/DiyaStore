'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [10, 25, 50, 100],
  className = '',
}: PaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);

      if (leftBound > 2) {
        pages.push('...');
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }

      if (rightBound < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-sm text-stone-600 ${className}`}>
      {/* Item summary */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span>
          Showing <span className="font-semibold text-stone-900">{startItem}</span> to{' '}
          <span className="font-semibold text-stone-900">{endItem}</span> of{' '}
          <span className="font-semibold text-stone-900">{totalItems}</span> results
        </span>

        {/* Per page selector */}
        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 ml-3 pl-3 border-l border-stone-300">
            <span className="text-xs text-stone-500">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="bg-white border border-stone-300 text-stone-800 text-xs rounded px-2 py-1 focus:ring-1 focus:ring-rose-800 focus:border-rose-800 outline-none cursor-pointer"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1 select-none">
          {/* Previous Page Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors text-xs font-medium shadow-2xs"
            aria-label="Previous Page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Numbered Page Buttons */}
          <div className="flex items-center gap-1">
            {pages.map((p, idx) => {
              if (p === '...') {
                return (
                  <span key={`dots-${idx}`} className="px-2 py-1 text-stone-400 text-xs font-mono">
                    …
                  </span>
                );
              }

              const pageNum = p as number;
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`min-w-[32px] h-8 flex items-center justify-center rounded-md text-xs font-semibold transition-colors shadow-2xs ${
                    isActive
                      ? 'bg-rose-800 text-white border border-rose-800'
                      : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 hover:border-stone-400'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Page Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors text-xs font-medium shadow-2xs"
            aria-label="Next Page"
          >
            <span className="hidden sm:inline">Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
