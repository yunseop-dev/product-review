import { QueryClient } from "@tanstack/react-query";
import { cartApi, cartKeys } from "./index";

// 장바구니 조회 쿼리 옵션
export const getCartQueryOptions = (userId?: number) => ({
  queryKey: userId ? cartKeys.user(userId) : cartKeys.all,
  queryFn: async () => {
    if (!userId) {
      throw new Error("사용자 ID가 필요합니다");
    }
    return cartApi.getCart(userId);
  },
  enabled: !!userId,
});

// 장바구니에 상품 추가 뮤테이션 옵션
export const addToCartMutationOptions = (
  userId?: number,
  queryClient?: QueryClient
) => ({
  mutationFn: async ({
    productId,
    quantity = 1,
  }: {
    productId: number;
    quantity?: number;
  }) => {
    if (!userId) {
      throw new Error("사용자 ID가 필요합니다");
    }
    return cartApi.addToCart(userId, productId, quantity);
  },
  onSuccess: () => {
    if (queryClient && userId) {
      queryClient.invalidateQueries({ queryKey: cartKeys.user(userId) });
    }
  },
});

// 장바구니 상품 업데이트 뮤테이션 옵션 (낙관적 업데이트 포함)
export const updateCartMutationOptions = (
  userId?: number,
  queryClient?: QueryClient
) => ({
  mutationFn: async ({
    productId,
    quantity,
  }: {
    productId: number;
    quantity: number;
  }) => {
    if (!userId) {
      throw new Error("사용자 ID가 필요합니다");
    }
    return cartApi.updateCart(userId, productId, quantity);
  },
  onMutate: async ({ productId, quantity }) => {
    if (!userId || !queryClient) return { previousCart: null };

    // 이전 쿼리 취소
    await queryClient.cancelQueries({ queryKey: cartKeys.user(userId) });

    // 이전 데이터 저장
    const previousCart = queryClient.getQueryData(cartKeys.user(userId));

    // 낙관적 업데이트 로직
    queryClient.setQueryData(cartKeys.user(userId), (old: any) => {
      if (!old) return old;

      const updatedProducts = old.products
        .map((product: any) => {
          if (product.id === productId) {
            // 수량이 0이면 상품 제거
            if (quantity === 0) return null;

            // 상품 수량 및 관련 계산 업데이트
            const newTotal = product.price * quantity;
            const newDiscountedTotal =
              newTotal * (1 - product.discountPercentage / 100);

            return {
              ...product,
              quantity,
              total: newTotal,
              discountedTotal: newDiscountedTotal,
            };
          }
          return product;
        })
        .filter(Boolean);

      // 장바구니 총액 계산
      const newTotal = updatedProducts.reduce(
        (sum: number, product: any) => sum + product.total,
        0
      );
      const newDiscountedTotal = updatedProducts.reduce(
        (sum: number, product: any) => sum + product.discountedTotal,
        0
      );

      return {
        ...old,
        products: updatedProducts,
        total: newTotal,
        discountedTotal: newDiscountedTotal,
        totalProducts: updatedProducts.length,
        totalQuantity: updatedProducts.reduce(
          (sum: number, product: any) => sum + product.quantity,
          0
        ),
      };
    });

    return { previousCart };
  },
  onError: (err, variables, context) => {
    // 에러 발생 시 이전 데이터로 롤백
    if (context?.previousCart && queryClient && userId) {
      queryClient.setQueryData(cartKeys.user(userId), context.previousCart);
    }
  },
  onSettled: () => {
    // 작업 완료 후 데이터 다시 불러오기
    if (queryClient && userId) {
      queryClient.invalidateQueries({ queryKey: cartKeys.user(userId) });
    }
  },
});

// 장바구니 비우기 뮤테이션 옵션
export const clearCartMutationOptions = (
  userId?: number,
  queryClient?: QueryClient
) => ({
  mutationFn: async () => {
    if (!userId) {
      throw new Error("사용자 ID가 필요합니다");
    }
    return cartApi.clearCart(userId);
  },
  onMutate: async () => {
    if (!userId || !queryClient) return { previousCart: null };

    // 이전 쿼리 취소
    await queryClient.cancelQueries({ queryKey: cartKeys.user(userId) });

    // 이전 데이터 저장
    const previousCart = queryClient.getQueryData(cartKeys.user(userId));

    // 빈 장바구니로 낙관적 업데이트
    queryClient.setQueryData(cartKeys.user(userId), (old: any) => {
      if (!old) return old;

      return {
        ...old,
        products: [],
        total: 0,
        discountedTotal: 0,
        totalProducts: 0,
        totalQuantity: 0,
      };
    });

    return { previousCart };
  },
  onError: (err, variables, context) => {
    // 에러 발생 시 이전 데이터로 롤백
    if (context?.previousCart && queryClient && userId) {
      queryClient.setQueryData(cartKeys.user(userId), context.previousCart);
    }
  },
  onSettled: () => {
    // 작업 완료 후 데이터 다시 불러오기
    if (queryClient && userId) {
      queryClient.invalidateQueries({ queryKey: cartKeys.user(userId) });
    }
  },
});
