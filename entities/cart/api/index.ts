import api from "@/shared/api/base";

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface CartResponse {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

// 쿼리 키 관리
export const cartKeys = {
  all: ["carts"] as const,
  user: (userId: number) => [...cartKeys.all, userId] as const,
};

// 카트 API 메서드
export const cartApi = {
  // 사용자의 장바구니 조회
  getCart: async (userId: number): Promise<CartResponse> => {
    const response = await api.get<CartResponse>(`/carts/${userId}`);
    return response.data;
  },

  // 장바구니에 상품 추가
  addToCart: async (userId: number, productId: number, quantity = 1) => {
    const response = await api.post("/carts/add", {
      userId,
      products: [{ id: productId, quantity }],
    });
    return response.data;
  },

  // 장바구니 상품 업데이트
  updateCart: async (userId: number, productId: number, quantity: number) => {
    const response = await api.put(`/carts/${userId}`, {
      merge: true,
      products: [{ id: productId, quantity }],
    });
    return response.data;
  },

  // 장바구니 비우기
  clearCart: async (userId: number) => {
    const response = await api.delete(`/carts/${userId}`);
    return response.data;
  },
};
