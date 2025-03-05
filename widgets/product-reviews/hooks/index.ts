import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewKeys, reviewsApi } from "../api/reviews";
import { useState } from "react";

// 제품 리뷰 가져오기 훅
export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: reviewKeys.list({ productId }),
    queryFn: () => reviewsApi.getReviews(productId),
  });
}

// 새 리뷰 추가하기 훅
export function useAddReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsApi.addReview,
    onSuccess: (data, variables) => {
      // 리뷰 추가 후 리뷰 목록 갱신
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list({ productId: variables.productId }),
      });
    },
  });
}

// 리뷰 폼 상태 관리 훅
export function useReviewForm(productId: string) {
  const [reviewText, setReviewText] = useState("");
  const addReviewMutation = useAddReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewText.trim()) return;

    try {
      await addReviewMutation.mutateAsync({
        productId,
        review: { body: reviewText },
      });

      // 성공 후 폼 초기화
      setReviewText("");
    } catch (error) {
      console.error("Add review error:", error);
    }
  };

  return {
    reviewText,
    setReviewText,
    handleSubmit,
    isSubmitting: addReviewMutation.isPending,
  };
}
