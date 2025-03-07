import { productKeys } from "@/entities/product/api";
import api from "@/shared/api/base";
import SiteFooter from "@/widgets/layout/ui/SiteFooter";
import SiteHeader from "@/widgets/layout/ui/SiteHeader";
import ProductPagination from "@/widgets/pagination/ui/ProductPagination";
import Products from "@/widgets/products/ui/Products";
import Categories from "@/widgets/categories/ui/Categories";
import SearchBar from "@/widgets/search/ui/SearchBar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

export const revalidate = 3600; // 1시간마다 재검증

// 서버 컴포넌트에서 초기 데이터 로드
export async function generateMetadata() {
  const queryClient = new QueryClient();

  // 카테고리 데이터 프리페치 추가
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/products/categories");
      return response.data;
    },
  });

  return {
    title: "제품 리뷰 사이트",
    description: "최고의 제품과 리뷰를 찾아보세요",
  };
}

// PageProps 타입을 업데이트
interface PageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 12; // 페이지 당 제품 수
  const selectedCategory = params.category || "";
  const searchQuery = params.search || "";

  const queryClient = new QueryClient();

  // 카테고리 데이터 프리페치
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/products/categories");
      return response.data;
    },
  });

  // 제품 목록 프리페치 (카테고리 및 검색어 필터링 포함)
  await queryClient.prefetchQuery({
    queryKey: productKeys.list({
      page: currentPage,
      limit: pageSize,
      category: selectedCategory,
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
      if (selectedCategory) {
        url = `/products/category/${selectedCategory}`;
      }

      // 검색어가 있는 경우 검색 파라미터 추가
      if (searchQuery) {
        queryParams["q"] = searchQuery;
      }

      const response = await api.get(url, { params: queryParams });
      return response.data;
    },
  });

  // 클라이언트에서 수화할 dehydrated state 생성
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="min-h-screen p-8">
        <SiteHeader />

        <main>
          {/* 검색 바 추가 */}
          <div className="mb-6">
            <SearchBar initialQuery={searchQuery} />
          </div>

          {/* 카테고리 섹션 추가 */}
          <section className="mb-6">
            <Suspense fallback={<div>카테고리 로딩 중...</div>}>
              <Categories selectedCategory={selectedCategory} />
            </Suspense>
          </section>

          <section className="mb-8">
            <Suspense fallback={<div>제품 로딩 중...</div>}>
              <Products category={selectedCategory} searchQuery={searchQuery} />
            </Suspense>

            {/* 페이지네이션 UI */}
            <div className="mt-12 flex justify-center">
              <ProductPagination
                currentPage={currentPage}
                category={selectedCategory}
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
