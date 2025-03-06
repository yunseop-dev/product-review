import api from "@/shared/api/base";
import { User } from "@/entities/user/model";
import { cookieUtils } from "@/shared/utils/cookies";

// 인증 상태를 위한 쿼리 키
export const authKeys = {
  all: ["auth"] as const,
  current: () => [...authKeys.all, "current"] as const,
  user: (id: string) => [...authKeys.all, "user", id] as const,
};

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
  // 로그인
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);

    // 토큰을 쿠키에 저장
    cookieUtils.accessToken.set(response.data.token, null);

    // DummyJSON는 실제로 리프레시 토큰을 제공하지 않지만, 시뮬레이션을 위해 만든다
    cookieUtils.refreshToken.set(`refresh_${response.data.token}`, null);

    return response.data;
  },

  // 로그아웃
  logout: () => {
    cookieUtils.clearAuthCookies(null);
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: async () => {
    try {
      const response = await api.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      console.error("getCurrentUser error:", error);
      return null;
    }
  },
};
