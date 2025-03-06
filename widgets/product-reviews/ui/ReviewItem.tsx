import { Review } from "../model/types";
import { useState } from "react";
import { useUserDetails } from "../hooks/useUserDetails";
import { UserDetailsModal } from "./UserDetailsModal";

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const [showUserDetails, setShowUserDetails] = useState(false);

  const {
    data: userDetails,
    isLoading,
    isError,
    error,
  } = useUserDetails(review.user?.id, showUserDetails);

  const handleUsernameClick = () => {
    setShowUserDetails(true);
  };

  const handleCloseModal = () => {
    setShowUserDetails(false);
  };

  return (
    <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="font-medium">
          {review.user ? (
            <button
              onClick={handleUsernameClick}
              className="text-left hover:underline hover:text-blue-500"
            >
              {review.user.username}
            </button>
          ) : (
            "익명"
          )}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{review.body}</p>

      {/* 사용자 정보 모달 */}
      {showUserDetails && (
        <UserDetailsModal
          userDetails={userDetails}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
