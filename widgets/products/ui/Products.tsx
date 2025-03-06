"use client";

import { productKeys } from "@/entities/product/api";
import { Product } from "@/entities/product/model";
import api from "@/shared/api/base";
import ProductCard from "@/widgets/product-card/ui/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

// 추천 제품 컴포넌트
export default function Products() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageSize = 12;
  const { data: productsData, isLoading } = useQuery({
    queryKey: productKeys.list({ page: Number(page), limit: pageSize }),
    queryFn: async () => {
      const response = await api.get("/products", {
        params: {
          limit: 8, // 추천 제품 8개만 가져옴
        },
      });
      return response.data;
    },
    // 서버에서 이미 데이터를 가져왔다면 다시 요청하지 않음
    staleTime: 60 * 1000, // 1분
  });

  if (isLoading) return <div>로딩 중...</div>;

  const products = productsData?.products || [];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">제품 목록</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>표시할 제품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
