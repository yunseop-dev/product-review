import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} 제품 리뷰 사이트. All rights reserved.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link
            href="/about"
            className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
          >
            소개
          </Link>
          <Link
            href="/contact"
            className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
          >
            연락처
          </Link>
        </div>
      </div>
    </footer>
  );
}
