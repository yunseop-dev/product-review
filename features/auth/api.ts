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
      // DummyJSON에서는 /auth/me 같은 엔드포인트가 없어서
      // 사용자 ID를 추출해 사용자 정보를 가져오는 것으로 대체
      const response = await api.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      // 로컬 테스트를 위해 임시 사용자 정보 반환
      try {
        const response = await api.get<User>("/users/1"); // 임시로 ID 1 사용
        return response.data;
      } catch {
        return null;
      }
    }
  },
};
