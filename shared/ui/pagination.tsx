"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    // Always show the first page
    pages.push(1);

    // Current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (pages[pages.length - 1] !== i - 1) {
        // Add ellipsis if there's a gap
        pages.push(-1);
      }
      pages.push(i);
    }

    // Always show the last page if it exists and isn't already included
    if (totalPages > 1 && pages[pages.length - 1] !== totalPages) {
      if (pages[pages.length - 1] !== totalPages - 1) {
        // Add ellipsis if there's a gap
        pages.push(-1);
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const navigateToPage = (page: number) => {
    if (page === 1) {
      // Remove query parameter for the first page
      router.push(pathname);
    } else {
      router.push(`${pathname}?page=${page}`);
    }
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Page Button */}
      <button
        onClick={() => currentPage > 1 && navigateToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm disabled:opacity-50"
        aria-label="이전 페이지"
      >
        &larr;
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === -1) {
          // Render ellipsis
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => navigateToPage(page)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              currentPage === page
                ? "bg-foreground text-background"
                : "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Page Button */}
      <button
        onClick={() =>
          currentPage < totalPages && navigateToPage(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm disabled:opacity-50"
        aria-label="다음 페이지"
      >
        &rarr;
      </button>
    </div>
  );
}
