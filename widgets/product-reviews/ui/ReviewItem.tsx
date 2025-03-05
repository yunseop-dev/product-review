import { Review } from "../model/types";

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="font-medium">{review.user?.username || "익명"}</div>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{review.body}</p>
    </div>
  );
}
