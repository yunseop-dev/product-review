"use client";

import { useProductReviews } from "../hooks";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { data, isLoading, error } = useProductReviews(productId.toString());

  return (
    <div className="space-y-6 my-8">
      <h2 className="text-xl font-semibold">제품 리뷰</h2>

      {/* 리뷰 작성 폼 */}
      <ReviewForm productId={productId.toString()} />

      {/* 리뷰 목록 */}
      <ReviewList
        data={data}
        isLoading={isLoading}
        error={error as Error | null}
      />
    </div>
  );
}
