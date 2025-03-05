import axios, { AxiosError, AxiosResponse } from "axios";
import { cookieUtils } from "@/shared/utils/cookies";

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
  (config) => {
    // 쿠키에서 토큰 가져오기
    const token = cookieUtils.accessToken.get(null);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // DummyJSON은 Token Refresh 기능을 제공하지 않으므로 단순히 오류를 반환
    if (error.response?.status === 401) {
      // 인증 토큰 관련 오류 시 쿠키에서 토큰 제거
      cookieUtils.clearAuthCookies(null);

      // 클라이언트 사이드에서만 리다이렉트 처리
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
