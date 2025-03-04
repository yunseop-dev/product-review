import { Suspense } from "react";
import Link from "next/link";
import { productApi } from "@/entities/product/api";
import ProductCard from "@/widgets/product-card/ui/ProductCard";
import AuthLinks from "@/features/auth/ui/AuthLinks";

export const revalidate = 3600; // 1시간마다 재검증

export default async function Home() {
  const data = await productApi.getProducts(12);

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold">제품 리뷰 사이트</h1>
        <AuthLinks />
      </header>

      <main>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">인기 제품</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Suspense fallback={<div>제품 로딩 중...</div>}>
              {data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Suspense>
          </div>
        </section>
      </main>

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
    </div>
  );
}
