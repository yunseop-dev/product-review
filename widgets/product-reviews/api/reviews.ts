import api from "@/shared/api/base";
import { ReviewFormData, ReviewsResponse } from "../model/types";

// 리뷰를 위한 쿼리 키
export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (filters: { productId: string }) =>
    [...reviewKeys.lists(), filters] as const,
  details: () => [...reviewKeys.all, "detail"] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
};

// API 함수
export const reviewsApi = {
  // 리뷰 목록 가져오기
  getReviews: async (productId: string): Promise<ReviewsResponse> => {
    const response = await api.get(`/comments/post/${productId}`);
    return response.data;
  },

  // 리뷰 추가하기
  addReview: async ({
    productId,
    review,
    userId,
  }: {
    productId: string;
    review: ReviewFormData;
    userId: string;
  }) => {
    const response = await api.post(`/comments/add`, {
      postId: parseInt(productId),
      userId,
      ...review,
    });
    return response.data;
  },
};
