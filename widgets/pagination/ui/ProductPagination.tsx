"use client";

import { productApi, productKeys } from "@/entities/product/api";
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
  const pageSize = 12; // 페이지 당 제품 수
  const router = useRouter();
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";
  const skip = (currentPage - 1) * pageSize;

  // Use different query based on whether we're on the search page
  const { data: productsData } = useQuery({
    queryKey:
      isSearchPage && searchQuery
        ? productKeys.search(searchQuery, currentPage, pageSize)
        : productKeys.list({
            page: currentPage,
            limit: pageSize,
            category: isSearchPage ? undefined : category,
            search: searchQuery,
          }),
    queryFn: async () => {
      if (isSearchPage && searchQuery) {
        // 검색 페이지에서는 검색 API 사용
        return productApi.searchProducts(searchQuery, {
          skip,
          limit: pageSize,
        });
      } else {
        // URL params 구성
        const queryParams: Record<string, string | number> = {
          skip,
          limit: pageSize,
        };

        // 검색어가 있는 경우 검색 파라미터 추가
        if (searchQuery) {
          queryParams["q"] = searchQuery;
        }

        const response = await productApi.getProducts({
          skip,
          limit: pageSize,
        });
        return response;
      }
    },
    staleTime: 60 * 1000, // 1분
  });

  // 페이지 정보가 없는 경우에 대한 처리
  if (!productsData) return null;

  // DummyJSON API는 총 페이지 수를 직접 제공하지 않으므로 계산
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
