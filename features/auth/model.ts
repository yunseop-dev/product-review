import api from "@/shared/api/base";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
      const response = await api.get("/auth/me");
      return response.data;
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
      const response = await api.post("/auth/login", credentials);
      return response.data;
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
      const response = await api.post("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      // 로그아웃 후 사용자 정보 캐시 제거
      queryClient.setQueryData(authKeys.current(), null);
      // 모든 쿼리 초기화
      queryClient.invalidateQueries();
    },
  });
}
