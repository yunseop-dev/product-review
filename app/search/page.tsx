import { productApi, productKeys } from "@/entities/product/api";
import SiteFooter from "@/widgets/layout/ui/SiteFooter";
import SiteHeader from "@/widgets/layout/ui/SiteHeader";
import ProductPagination from "@/widgets/pagination/ui/ProductPagination";
import Products from "@/widgets/products/ui/Products";
import SearchBar from "@/widgets/search/ui/SearchBar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

export const revalidate = 3600; // 1시간마다 재검증

// 메타데이터 생성
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const searchQuery = searchParams.q || "";

  return {
    title: searchQuery
      ? `"${searchQuery}" 검색 결과 - 제품 리뷰 사이트`
      : "제품 검색 - 제품 리뷰 사이트",
    description: "원하는 제품을 검색하고 리뷰를 찾아보세요",
  };
}

// PageProps 타입
interface PageProps {
  searchParams: {
    q?: string;
    page?: string;
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const searchQuery = searchParams.q || "";
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 12; // 페이지 당 제품 수
  const skip = (currentPage - 1) * pageSize;

  const queryClient = new QueryClient();

  // 검색 결과 프리페치 - 개선된 검색 API 사용
  if (searchQuery) {
    await queryClient.prefetchQuery({
      queryKey: productKeys.search(searchQuery, currentPage, pageSize),
      queryFn: async () => {
        return productApi.searchProducts(searchQuery, {
          skip,
          limit: pageSize,
        });
      },
    });
  } else {
    // 검색어가 없는 경우 일반 제품 목록 표시
    await queryClient.prefetchQuery({
      queryKey: productKeys.list({
        page: currentPage,
        limit: pageSize,
      }),
      queryFn: async () => {
        return productApi.getProducts({ skip, limit: pageSize });
      },
    });
  }

  // 클라이언트에서 수화할 dehydrated state 생성
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="min-h-screen p-8">
        <SiteHeader />

        <main>
          {/* 검색 바 */}
          <div className="mb-6">
            <SearchBar initialQuery={searchQuery} />
          </div>

          {/* 검색 결과 섹션 */}
          <section className="mb-8">
            <div className="mb-6">
              {searchQuery ? (
                <h1 className="text-2xl font-bold">
                  &ldquo;{searchQuery}&rdquo; 검색 결과
                </h1>
              ) : (
                <h1 className="text-2xl font-bold">모든 제품</h1>
              )}
            </div>

            <Suspense fallback={<div>검색 결과 로딩 중...</div>}>
              <Products searchQuery={searchQuery} />
            </Suspense>

            {/* 페이지네이션 UI */}
            <div className="mt-12 flex justify-center">
              <ProductPagination
                currentPage={currentPage}
                searchQuery={searchQuery}
              />
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </HydrationBoundary>
  );
}
