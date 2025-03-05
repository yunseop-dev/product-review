import { create } from "zustand";
import { User } from "@/entities/user/model";
import { authApi } from "./api";
import { cookieUtils } from "@/shared/utils/cookies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setLoading: (loading: boolean) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setLoading: (loading) => set({ isLoading: loading }),

  login: async (username, password) => {
    set({ isLoading: true });
    try {
      const user = await authApi.login({ username, password });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isAuthenticated: false, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authApi.logout();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      if (!cookieUtils.accessToken.get()) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }

      const user = await authApi.getCurrentUser();
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    } catch (error) {
      set({ isAuthenticated: false, isLoading: false });
    }
  },
}));

// 인증 상태를 위한 쿼리 키
export const authKeys = {
  all: ["auth"] as const,
  current: () => [...authKeys.all, "current"] as const,
  user: (id: string) => [...authKeys.all, "user", id] as const,
};

// 현재 사용자 정보 가져오기
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.current(),
    queryFn: async () => {
      // API 호출 구현
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json();
    },
    // 사용자가 로그인하지 않은 경우에도 에러를 발생시키지 않도록 설정
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// 로그인 기능
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // 로그인 성공 후 사용자 정보 캐시 업데이트
      queryClient.setQueryData(authKeys.current(), data);
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

// 로그아웃 기능
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      return response.json();
    },
    onSuccess: () => {
      // 로그아웃 후 사용자 정보 캐시 제거
      queryClient.setQueryData(authKeys.current(), null);
      // 모든 쿼리 초기화
      queryClient.invalidateQueries();
    },
  });
}
