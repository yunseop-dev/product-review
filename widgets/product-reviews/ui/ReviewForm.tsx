"use client";

import { useAuth } from "@/features/auth/hooks";
import { useReviewForm } from "../hooks";
import { useSession } from "next-auth/react";

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const { data: session, status } = useSession();
  const { reviewText, setReviewText, handleSubmit, isSubmitting } =
    useReviewForm(productId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="review" className="block text-sm font-medium mb-1">
          리뷰 작성
        </label>
        <textarea
          id="review"
          rows={4}
          className="w-full p-3 border rounded-md"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="제품에 대한 리뷰를 작성해주세요..."
          disabled={!session?.user}
        />
        {!session?.user && (
          <p className="text-sm text-gray-500 mt-1">
            리뷰를 작성하려면 먼저 로그인해주세요.
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={!session?.user || isSubmitting || !reviewText.trim()}
        className="py-2 px-4 bg-foreground text-background rounded-md hover:bg-opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "등록 중..." : "리뷰 등록"}
      </button>
    </form>
  );
}
