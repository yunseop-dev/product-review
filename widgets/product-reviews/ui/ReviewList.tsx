import { ReviewsResponse } from "../model/types";
import { ReviewItem } from "./ReviewItem";

interface ReviewListProps {
  data: ReviewsResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function ReviewList({ data, isLoading, error }: ReviewListProps) {
  if (isLoading) {
    return <div className="my-8 p-4">리뷰 로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="my-8 p-4 bg-red-50 text-red-700 rounded-md">
        리뷰를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  const reviews = data?.comments || [];

  if (reviews.length === 0) {
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
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
}
