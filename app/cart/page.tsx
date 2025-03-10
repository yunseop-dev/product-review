"use client";

import {
  clearCartMutationOptions,
  getCartQueryOptions,
  updateCartMutationOptions,
} from "@/entities/cart/api/queries";
import { useAuth } from "@/features/auth/hooks";
import AuthLinks from "@/features/auth/ui/AuthLinks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const auth = useAuth();
  const queryClient = useQueryClient();
  const userId = auth.data?.id;

  // 장바구니 데이터 쿼리
  const {
    data: cartData,
    isLoading,
    error,
  } = useQuery(getCartQueryOptions(userId));

  // 장바구니 상품 업데이트 뮤테이션
  const updateCartMutation = useMutation(
    updateCartMutationOptions(userId, queryClient)
  );

  // 장바구니 비우기 뮤테이션
  const deleteCartMutation = useMutation(
    clearCartMutationOptions(userId, queryClient)
  );

  const deleteProductFromCart = (productId: number) => {
    // 상품 삭제는 수량을 0으로 설정하는 것으로 구현
    updateCartMutation.mutate({ productId, quantity: 0 });
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    updateCartMutation.mutate({ productId, quantity });
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // In a real app, you would handle the checkout process here
    setTimeout(() => {
      alert("결제가 완료되었습니다!");
      setIsCheckingOut(false);
      // 결제 후 장바구니 비우기
      deleteCartMutation.mutate();
    }, 1500);
  };

  const products = cartData?.products || [];
  const total = cartData?.total || 0;
  const discountedTotal = cartData?.discountedTotal || 0;

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}
          className="inline-flex items-center text-sm hover:underline"
        >
          ← 뒤로가기
        </Link>
        <AuthLinks />
      </header>

      <h1 className="text-3xl font-bold mb-8">장바구니</h1>

      {isLoading ? (
        <div className="text-center py-10">장바구니 정보를 불러오는 중...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          장바구니 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl mb-6">장바구니가 비어있습니다.</p>
          <Link href="/" className="text-blue-500 hover:underline">
            쇼핑 계속하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        sizes="96px"
                        objectFit="contain"
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium">{product.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500 dark:text-gray-400">
                          ${product.price.toFixed(2)} ×
                        </span>
                        <div className="flex items-center">
                          <button
                            className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-l"
                            onClick={() =>
                              updateProductQuantity(
                                product.id,
                                Math.max(1, product.quantity - 1)
                              )
                            }
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800">
                            {product.quantity}
                          </span>
                          <button
                            className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-r"
                            onClick={() =>
                              updateProductQuantity(
                                product.id,
                                product.quantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        {product.discountPercentage > 0 && (
                          <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-0.5 rounded-full text-xs font-medium">
                            {product.discountPercentage.toFixed(0)}% 할인
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="font-semibold">
                          ${product.discountedTotal.toFixed(2)}
                        </p>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteProductFromCart(product.id)}
                          disabled={updateCartMutation.isPending}
                        >
                          {updateCartMutation.isPending &&
                          product.id === updateCartMutation.variables?.productId
                            ? "처리 중..."
                            : "삭제"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">주문 요약</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>상품 수</span>
                <span>
                  {cartData?.totalProducts}개 상품 ({cartData?.totalQuantity}개)
                </span>
              </div>
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {total !== discountedTotal && (
                <div className="flex justify-between text-green-600">
                  <span>할인 금액</span>
                  <span>-${(total - discountedTotal).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2"></div>
              <div className="flex justify-between font-bold text-lg">
                <span>총 결제 금액</span>
                <span>${discountedTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={
                isCheckingOut ||
                updateCartMutation.isPending ||
                deleteCartMutation.isPending
              }
              className="w-full py-3 px-4 bg-foreground text-background font-medium rounded-md hover:bg-opacity-90 disabled:opacity-70"
            >
              {isCheckingOut ? "처리 중..." : "결제하기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
