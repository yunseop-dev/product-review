import api from "@/shared/api/base";
import { User } from "@/entities/user/model";
import { signIn, signOut } from "next-auth/react";

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
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export const authApi = {
  // 로그인 - NextAuth를 사용
  login: async (credentials: LoginCredentials) => {
    const result = await signIn("credentials", {
      username: credentials.username,
      password: credentials.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    // 현재 사용자 정보 가져오기
    const userResponse = await api.get<User>("/auth/me");
    return userResponse.data;
  },

  // 로그아웃 - NextAuth를 사용
  logout: async () => {
    await signOut({ redirect: false });
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
