import api from "@/shared/api/base";
import { User } from "@/entities/user/model";
import { cookieUtils } from "@/shared/utils/cookies";

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

    // 토큰을 쿠키에 저장
    cookieUtils.accessToken.set(response.data.token, null);

    // DummyJSON는 실제로 리프레시 토큰을 제공하지 않지만, 시뮬레이션을 위해 만든다
    cookieUtils.refreshToken.set(`refresh_${response.data.token}`, null);

    return response.data;
  },

  logout: () => {
    cookieUtils.clearAuthCookies(null);
  },

  getCurrentUser: async () => {
    // 쿠키에서 토큰 확인을 위한 로직은 API 인터셉터에서 수행되므로 여기서는 생략
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
