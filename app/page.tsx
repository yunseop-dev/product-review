import { productKeys } from "@/entities/product/api";
import api from "@/shared/api/base";
import SiteFooter from "@/widgets/layout/ui/SiteFooter";
import SiteHeader from "@/widgets/layout/ui/SiteHeader";
import ProductPagination from "@/widgets/pagination/ui/ProductPagination";
import Products from "@/widgets/products/ui/Products";
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

  // 초기 데이터 프리페치
  await queryClient.prefetchQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const response = await api.get("/products?limit=8"); // 추천 제품 8개만 가져옴
      return response.data;
    },
  });

  return {
    title: "제품 리뷰 사이트",
    description: "최고의 제품과 리뷰를 찾아보세요",
  };
}

// PageProps 타입을 명시적으로 정의
interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 12; // 페이지 당 제품 수

  const queryClient = new QueryClient();

  // 제품 목록 프리페치
  await queryClient.prefetchQuery({
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
  });

  // 추천 제품 프리페치
  await queryClient.prefetchQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const response = await api.get("/products", {
        params: {
          limit: 8, // 추천 제품 8개만 가져옴
        },
      });
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
          <section className="mb-8">
            <Suspense fallback={<div>제품 로딩 중...</div>}>
              <Products />
            </Suspense>

            {/* 페이지네이션 UI */}
            <div className="mt-12 flex justify-center">
              <ProductPagination currentPage={currentPage} />
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </HydrationBoundary>
  );
}
