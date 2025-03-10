"use client";

import { getProductsQueryOptions } from "@/entities/product/api/queries";
import { Pagination } from "@/shared/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

interface ProductPaginationProps {
  currentPage: number;
  category?: string;
  searchQuery?: string;
}

export default function ProductPagination({
  currentPage,
  category,
  searchQuery,
}: ProductPaginationProps) {
  const pageSize = 12;
  const router = useRouter();
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";

  // 공통 쿼리 옵션 사용
  const { data: productsData } = useQuery(
    getProductsQueryOptions({
      page: currentPage,
      limit: pageSize,
      category,
      searchQuery,
      isSearchPage,
    })
  );

  // 페이지 정보가 없는 경우에 대한 처리
  if (!productsData) return null;

  // 총 페이지 수 계산
  const totalItems = productsData.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const handlePageNavigation = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());

    if (isSearchPage) {
      // 검색 페이지인 경우
      if (searchQuery) {
        params.set("q", searchQuery);
      }
      router.push(`/search?${params.toString()}`);
    } else {
      // 홈 페이지인 경우
      if (category) {
        params.set("category", category);
      }
      if (searchQuery) {
        params.set("search", searchQuery);
      }
      router.push(`/?${params.toString()}`);
    }
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageNavigation}
    />
  );
}
