import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductReviews from "@/widgets/product-reviews/ui/ProductReviews";
import AuthLinks from "@/features/auth/ui/AuthLinks";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { reviewKeys, reviewsApi } from "@/widgets/product-reviews/api/reviews";
import { productApi } from "@/entities/product/api";
import ProductDetail from "@/widgets/product-detail/ui/ProductDetail";
import { productKeys } from "@/entities/product/api";

export const revalidate = 3600; // 1시간마다 재검증

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const product = await productApi.getProduct(parseInt(id));
    return {
      title: `${product.title} - 제품 리뷰 사이트`,
      description: product.description,
    };
  } catch (error) {
    return {
      title: "제품 정보 - 제품 리뷰 사이트",
      description: "제품 상세 정보 페이지입니다.",
    };
  }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const productId = parseInt(id);

  // QueryClient 초기화
  const queryClient = new QueryClient();

  try {
    // 제품 데이터 prefetch
    await queryClient.prefetchQuery({
      queryKey: productKeys.detail(productId),
      queryFn: () => productApi.getProduct(productId),
    });

    // 리뷰 데이터 prefetch
    await queryClient.prefetchQuery({
      queryKey: reviewKeys.list({ productId: productId.toString() }),
      queryFn: () => reviewsApi.getReviews(productId.toString()),
    });
  } catch (error) {
    // 제품이 존재하지 않으면 404 페이지로 이동
    notFound();
  }

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm hover:underline"
        >
          ← 홈으로 돌아가기
        </Link>
        <AuthLinks />
      </header>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>제품 로딩 중...</div>}>
          <ProductDetail productId={productId} />
        </Suspense>

        {/* 리뷰 섹션 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">제품 리뷰</h2>
          <Suspense fallback={<div>리뷰 로딩 중...</div>}>
            <ProductReviews productId={productId} />
          </Suspense>
        </div>
      </HydrationBoundary>
    </div>
  );
}
