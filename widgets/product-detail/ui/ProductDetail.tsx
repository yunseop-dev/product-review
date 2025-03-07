"use client";

import { productApi, productKeys } from "@/entities/product/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

interface ProductDetailProps {
  productId: number;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const { data: product, isLoading } = useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productApi.getProduct(productId),
  });
  const [activeImage, setActiveImage] = useState(0);
  const discountPrice =
    (product?.price ?? 0) * (1 - (product?.discountPercentage ?? 0) / 100);

  if (isLoading || !product) {
    return <div>제품 정보를 불러오는 중...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* 제품 이미지 섹션 */}
      <div className="space-y-6">
        <div className="relative h-[400px] overflow-hidden rounded-lg">
          <Image
            src={product.images[activeImage % product.images.length]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            objectFit="contain"
            priority
            className="rounded-lg transition-opacity duration-300"
          />

          {/* 캐러셀 화살표 */}
          <button
            onClick={() =>
              setActiveImage((prev) =>
                prev === 0 ? product.images.length - 1 : prev - 1
              )
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
            aria-label="이전 이미지"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              setActiveImage((prev) =>
                prev === product.images.length - 1 ? 0 : prev + 1
              )
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
            aria-label="다음 이미지"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {product.images.slice(0, 5).map((image, index) => (
            <div
              key={index}
              className={`relative h-16 overflow-hidden rounded-md cursor-pointer ${
                activeImage === index ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setActiveImage(index)}
            >
              <Image
                src={image}
                alt={`${product.title} image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 20vw, 10vw"
                objectFit="contain"
                className="hover:opacity-80 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 제품 정보 섹션 */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-medium">
              {product.brand}
            </span>
            <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-xs font-medium">
              {product.category}
            </span>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300">
          {product.description}
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-medium">
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">
              ${discountPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-0.5 rounded-full text-xs font-medium">
                  {product.discountPercentage.toFixed(0)}% 할인
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            재고: {product.stock} 남음
          </p>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full py-3 px-4 bg-foreground text-background font-medium rounded-md hover:bg-opacity-90">
            장바구니에 추가
          </button>
        </div>
      </div>
    </div>
  );
}
