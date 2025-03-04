import api from "@/shared/api/base";
import { Product, ProductsResponse } from "./model";
import { Comment } from "@/entities/comment/model";

export const productApi = {
  getProducts: async (limit = 10, skip = 0) => {
    const response = await api.get<ProductsResponse>(
      `/products?limit=${limit}&skip=${skip}`
    );
    return response.data;
  },

  getProduct: async (id: number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  getProductComments: async (productId: number) => {
    // DummyJSON에서는 제품 댓글 API가 없어서 posts 댓글로 대체
    const response = await api.get<{ comments: Comment[] }>(
      `/comments/post/${productId}`
    );
    return response.data.comments;
  },

  searchProducts: async (query: string) => {
    const response = await api.get<ProductsResponse>(
      `/products/search?q=${query}`
    );
    return response.data;
  },
};
