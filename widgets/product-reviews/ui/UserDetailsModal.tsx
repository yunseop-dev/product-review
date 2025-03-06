import { User } from "../api/users";

interface UserDetailsModalProps {
  userDetails: User | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onClose: () => void;
}

export function UserDetailsModal({
  userDetails,
  isLoading,
  isError,
  error,
  onClose,
}: UserDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">사용자 정보</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ) : isError ? (
          <p className="text-red-500">에러: {(error as Error).message}</p>
        ) : (
          userDetails && (
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                {userDetails.image && (
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <img
                      src={userDetails.image}
                      alt={userDetails.username}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://dummyjson.com/image/64";
                      }}
                      loading="lazy"
                    />
                  </div>
                )}
                <div>
                  <p className="font-bold">
                    {userDetails.firstName} {userDetails.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    @{userDetails.username}
                  </p>
                </div>
              </div>
              <p>
                <span className="font-medium">이메일:</span> {userDetails.email}
              </p>
              {/* 필요한 추가 사용자 정보 표시 */}
            </div>
          )
        )}
      </div>
    </div>
  );
}
