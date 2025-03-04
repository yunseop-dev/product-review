import { productApi } from "@/entities/product/api";
import Image from "next/image";

export default async function ProductReviews({
  productId,
}: {
  productId: number;
}) {
  // DummyJSON API는 제품별 리뷰를 제공하지 않으므로 임의로 post 댓글을 가져옴
  // 실제 구현에서는 제품 리뷰 API를 사용해야 함
  let comments = [];

  try {
    comments = await productApi.getProductComments(productId);
  } catch (error) {
    comments = [];
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
      {comments.map((comment) => (
        <div
          key={comment.id}
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
              <h4 className="font-medium">{comment.user.username}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString()}{" "}
                {/* 실제로는 댓글 날짜를 사용 */}
              </p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300">{comment.body}</p>
        </div>
      ))}

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
