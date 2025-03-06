import api from "@/shared/api/base";
import { Product, ProductsResponse } from "./model";
import { Comment } from "@/entities/comment/model";

// 제품을 위한 쿼리 키
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: { page?: number; limit?: number; skip?: number }) => 
    [...productKeys.lists(), { ...filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

export const productApi = {
  // 제품 목록 가져오기
  getProducts: async (params?: { skip?: number; limit?: number }) => {
    const { skip = 0, limit = 12 } = params || {};
    const response = await api.get<ProductsResponse>("/products", {
      params: { skip, limit },
    });
    return response.data;
  },

  // 단일 제품 가져오기
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // 제품 댓글 가져오기
  getProductComments: async (productId: number) => {
    // DummyJSON에서는 제품 댓글 API가 없어서 posts 댓글로 대체
    const response = await api.get<{ comments: Comment[] }>(
      `/comments/post/${productId}`
    );
    return response.data.comments;
  },

  // 제품 검색
  searchProducts: async (query: string) => {
    const response = await api.get<ProductsResponse>(
      `/products/search?q=${query}`
    );
    return response.data;
  },
  
  // 추천 제품 가져오기
  getFeaturedProducts: async () => {
    const response = await api.get<ProductsResponse>("/products", {
      params: { limit: 8 },
    });
    return response.data;
  },
};
