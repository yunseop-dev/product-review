"use client";

import { getProductsQueryOptions } from "@/entities/product/api/queries";
import { Product } from "@/entities/product/model";
import ProductCard from "@/widgets/product-card/ui/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";

// 인터페이스 업데이트
interface ProductsProps {
  category?: string;
  searchQuery?: string;
}

// 제품 목록 컴포넌트
export default function Products({ category, searchQuery }: ProductsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";
  const page = Number(searchParams.get("page") || "1");
  const pageSize = 12;

  // 공통 쿼리 옵션 사용
  const { data: productsData, isLoading } = useQuery(
    getProductsQueryOptions({
      page,
      limit: pageSize,
      category,
      searchQuery,
      isSearchPage,
    })
  );

  if (isLoading) return <div>로딩 중...</div>;

  const products = productsData?.products || [];
  const totalItems = productsData?.total || 0;

  // 제목 생성 로직
  const getTitle = () => {
    if (isSearchPage && searchQuery) {
      return `검색 결과: ${products.length}개 항목`;
    } else if (!isSearchPage && category) {
      return `${category} 카테고리 (${totalItems}개 제품)`;
    } else {
      return `제품 목록 (${totalItems}개)`;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{getTitle()}</h2>
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
