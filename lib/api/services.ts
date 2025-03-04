import api from "./axios";

// 타입 정의
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  token?: string;
}

export interface Comment {
  id: number;
  body: string;
  postId: number;
  user: {
    id: number;
    username: string;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

// API 서비스 함수들
export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);

    // 토큰 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", response.data.token);
      // DummyJSON는 실제로 리프레시 토큰을 제공하지 않지만, 시뮬레이션을 위해 만든다
      localStorage.setItem("refreshToken", `refresh_${response.data.token}`);
    }

    return response.data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      // DummyJSON에서는 /auth/me 같은 엔드포인트가 없어서
      // 사용자 ID를 추출해 사용자 정보를 가져오는 것으로 대체
      const response = await api.get<User>("/users/1"); // 임시로 ID 1 사용
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export const productService = {
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

export const userService = {
  getUser: async (id: number) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  getUsers: async (limit = 10, skip = 0) => {
    const response = await api.get<{
      users: User[];
      total: number;
      skip: number;
      limit: number;
    }>(`/users?limit=${limit}&skip=${skip}`);
    return response.data;
  },
};
