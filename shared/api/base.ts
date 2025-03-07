import axios, { AxiosError, AxiosResponse } from "axios";
import { getSession, signOut } from "next-auth/react";

// API 기본 URL
const BASE_URL = "https://dummyjson.com";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  async (config) => {
    // 클라이언트 사이드에서만 세션 가져오기 시도
    if (typeof window !== "undefined") {
      try {
        const session = await getSession();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (session?.accessToken) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          config.headers["Authorization"] = `Bearer ${session.accessToken}`;
        }
      } catch (err) {
        console.error("세션 정보 가져오기 실패:", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // 토큰 만료 오류(401)이고 원래 요청 정보가 있으며 아직 재시도하지 않은 경우
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.headers["x-retry"] &&
      typeof window !== "undefined" // 클라이언트 사이드에서만 처리
    ) {
      try {
        // 세션 만료로 간주하고 로그아웃 처리
        await signOut({ redirect: false });

        // 로그인 페이지로 리다이렉트
        window.location.href = `/login?callbackUrl=${encodeURIComponent(
          window.location.href
        )}`;

        return Promise.reject(error);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
