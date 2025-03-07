"use client";

import { productKeys } from "@/entities/product/api";
import api from "@/shared/api/base";
import { Pagination } from "@/shared/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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

  // Update query to include category and search parameters
  const { data: productsData } = useQuery({
    queryKey: productKeys.list({
      page: currentPage,
      limit: pageSize,
      category,
      search: searchQuery,
    }),
    queryFn: async () => {
      // URL params 구성
      const queryParams: Record<string, string | number> = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
      };

      // 카테고리 필터링이 있는 경우
      let url = "/products";
      if (category) {
        url = `/products/category/${category}`;
      }

      // 검색어가 있는 경우 검색 파라미터 추가
      if (searchQuery) {
        queryParams["q"] = searchQuery;
      }

      const response = await api.get(url, { params: queryParams });
      return response.data;
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

    if (category) {
      params.set("category", category);
    }

    if (searchQuery) {
      params.set("search", searchQuery);
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageNavigation}
    />
  );
}
