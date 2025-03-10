"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function AuthLinks() {
  const { data: session, status } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
      window.location.href = "/"; // 로그아웃 후 홈으로 리디렉션
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  // Don't render anything until client-side rendering is complete and auth is checked
  if (status === "loading") {
    return (
      <div className="flex h-10 items-center gap-4">
        {/* Show skeleton or loading placeholder */}
        <div className="h-5 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {session?.user ? (
        <>
          <span className="text-sm">
            환영합니다, {session.user.name || "사용자"}님
          </span>
          <Link
            href="/cart"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm h-10 px-4"
            aria-label="장바구니"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>장바구니</span>
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm h-10 px-4"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
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
