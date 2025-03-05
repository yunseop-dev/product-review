"use client";

import Link from "next/link";
import { useAuth, useAuthLogout } from "../hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../model";

export default function AuthLinks() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const logout = useAuthLogout();

  useEffect(() => {
    // This ensures we only show authentication UI after client-side hydration
    setIsClientLoaded(true);
  }, []);

  const handleLogout = () => {
    logout.mutate();
  };

  // Don't render anything until client-side rendering is complete and auth is checked
  if (!isClientLoaded || userLoading) {
    return (
      <div className="flex h-10 items-center gap-4">
        {/* Show skeleton or loading placeholder */}
        <div className="h-5 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {currentUser ? (
        <>
          <span className="text-sm">
            환영합니다, {currentUser.firstName || "사용자"}님
          </span>
          <button
            onClick={handleLogout}
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm h-10 px-4"
            disabled={logout.isPending}
          >
            {logout.isPending ? "로그아웃 중..." : "로그아웃"}
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm h-10 px-4"
          >
            로그인
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm h-10 px-4"
          >
            회원가입
          </Link>
        </>
      )}
    </div>
  );
}
