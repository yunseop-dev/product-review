import api from "@/shared/api/base";
import { User } from "@/entities/user/model";

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

export const authApi = {
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
