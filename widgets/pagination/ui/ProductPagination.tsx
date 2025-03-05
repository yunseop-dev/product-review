"use client";

import { Pagination } from "@/shared/ui/pagination";
import { productKeys } from "@/app/productKeys";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios";

export default function ProductPagination({
  currentPage,
}: {
  currentPage: number;
}) {
  const pageSize = 12; // 페이지 당 제품 수

  const { data: productsData } = useQuery({
    queryKey: productKeys.list({ page: currentPage, limit: pageSize }),
    queryFn: async () => {
      const response = await api.get(`/products`, {
        params: {
          skip: (currentPage - 1) * pageSize,
          limit: pageSize,
        },
      });
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

  return <Pagination currentPage={currentPage} totalPages={totalPages} />;
}
