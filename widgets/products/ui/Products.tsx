"use client";

import { productApi, productKeys } from "@/entities/product/api";
import { Product } from "@/entities/product/model";
import ProductCard from "@/widgets/product-card/ui/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";

// Update the interface
interface ProductsProps {
  category?: string;
  searchQuery?: string;
}

// 제품 목록 컴포넌트
export default function Products({ category, searchQuery }: ProductsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";
  const page = searchParams.get("page") || "1";
  const currentPage = Number(page);
  const pageSize = 12;
  const skip = (currentPage - 1) * pageSize;

  // Use appropriate query key and function based on page and search status
  const { data: productsData, isLoading } = useQuery({
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
      } else if (!isSearchPage && category) {
        // 카테고리 필터링이 있는 경우 (홈 페이지)
        const response = await productApi.getProducts({
          skip,
          limit: pageSize,
        });
        return response;
      } else if (!isSearchPage && searchQuery) {
        // 홈 페이지에서 검색어가 있는 경우
        return productApi.searchProducts(searchQuery, {
          skip,
          limit: pageSize,
        });
      } else {
        // 기본 제품 목록
        return productApi.getProducts({
          skip,
          limit: pageSize,
        });
      }
    },
    // 서버에서 이미 데이터를 가져왔다면 다시 요청하지 않음
    staleTime: 60 * 1000, // 1분
  });

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
