"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/model";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLinks() {
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();
  const router = useRouter();
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    // This ensures we only show authentication UI after client-side hydration
    setIsClientLoaded(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Don't render anything until client-side rendering is complete and auth is checked
  if (!isClientLoaded || isLoading) {
    return (
      <div className="flex h-10 items-center gap-4">
        {/* Show skeleton or loading placeholder */}
        <div className="h-5 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <>
          <span className="text-sm">
            환영합니다, {user?.firstName || "사용자"}님
          </span>
          <button
            onClick={handleLogout}
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm h-10 px-4"
          >
            로그아웃
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm h-10 px-4"
        >
          로그인
        </Link>
      )}
    </div>
  );
}
