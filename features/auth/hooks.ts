import { authApi, authKeys, LoginCredentials } from "./api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// 현재 인증 상태 확인
export function useAuth() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: authKeys.current(),
    queryFn: authApi.getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
  };
}

// 로그인 처리
export function useAuthLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      // 사용자 정보 캐시 업데이트
      queryClient.setQueryData(authKeys.current(), data);

      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      // 홈 페이지로 리디렉션
      router.push("/");
    },
  });
}

// 로그아웃 처리
export function useAuthLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // 사용자 정보 캐시 제거
      queryClient.setQueryData(authKeys.current(), null);

      // 캐시된 쿼리 초기화
      queryClient.invalidateQueries();

      // 로그인 페이지로 리디렉션
      router.push("/login");
    },
  });
}
