import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios";

// 리뷰를 위한 쿼리 키
const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (filters: { productId: string }) =>
    [...reviewKeys.lists(), filters] as const,
  details: () => [...reviewKeys.all, "detail"] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
};

// 제품 리뷰 가져오기
function useProductReviews(productId: string) {
  return useQuery({
    queryKey: reviewKeys.list({ productId }),
    queryFn: async () => {
      const response = await api.get(`/products/${productId}/comments`);
      return response.data;
    },
  });
}

// 새 리뷰 추가하기
function useAddReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      review,
    }: {
      productId: string;
      review: any;
    }) => {
      const response = await api.post(
        `/products/${productId}/comments`,
        review
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // 리뷰 추가 후 리뷰 목록 갱신
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list({ productId: variables.productId }),
      });
    },
  });
}

export default async function ProductReviews({
  productId,
}: {
  productId: number;
}) {
  // DummyJSON API는 제품별 리뷰를 제공하지 않으므로 임의로 post 댓글을 가져옴
  // 실제 구현에서는 제품 리뷰 API를 사용해야 함
  let comments = [];

  try {
    comments = await api.get(`/products/${productId}/comments`);
  } catch (error) {
    comments = [];
  }

  const {
    data: reviews,
    isLoading,
    error,
  } = useProductReviews(productId.toString());
  const addReviewMutation = useAddReview();

  // 리뷰 제출 핸들러
  const handleSubmitReview = async (reviewData: any) => {
    try {
      await addReviewMutation.mutateAsync({
        productId: productId.toString(),
        review: reviewData,
      });
      // 성공 메시지 표시 등
    } catch (error) {
      // 에러 처리
      console.error("Add review error:", error);
    }
  };

  if (isLoading) {
    return <div>리뷰 로딩 중...</div>;
  }

  if (error) {
    return <div>리뷰를 불러오는 중 오류가 발생했습니다.</div>;
  }

  if (comments.length === 0) {
    return (
      <div className="py-8 text-center border border-gray-200 dark:border-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews && reviews.length > 0 ? (
        reviews.map((review: any) => (
          <div
            key={review.id}
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <svg
                  className="absolute w-10 h-10 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">{review.user.username}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}{" "}
                  {/* 실제로는 댓글 날짜를 사용 */}
                </p>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300">{review.body}</p>
          </div>
        ))
      ) : (
        <div className="py-8 text-center border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!
          </p>
        </div>
      )}

      <div className="mt-8 p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
        <h3 className="text-lg font-medium mb-4">리뷰 작성하기</h3>
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent mb-4"
          rows={4}
          placeholder="제품에 대한 리뷰를 작성해주세요..."
        />
        <button className="py-2 px-4 bg-foreground text-background rounded-md hover:bg-opacity-90">
          리뷰 등록
        </button>
      </div>
    </div>
  );
}
