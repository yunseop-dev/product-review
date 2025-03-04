"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth";
import { useRouter } from "next/navigation";

export default function AuthLinks() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

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
