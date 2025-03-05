import { Product } from "../model/types";
import api from "@/lib/api/axios";

// 제품을 위한 쿼리 키
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: any) => [...productKeys.lists(), { ...filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

// 제품 API 함수
export const productApi = {
  // 제품 목록 가져오기
  getProducts: async (params?: { skip?: number; limit?: number }) => {
    const { skip = 0, limit = 12 } = params || {};
    const response = await api.get("/products", {
      params: { skip, limit },
    });
    return response.data;
  },

  // 단일 제품 가져오기
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // 추천 제품 가져오기
  getFeaturedProducts: async () => {
    const response = await api.get("/products", {
      params: { limit: 8 },
    });
    return response.data;
  },
};
