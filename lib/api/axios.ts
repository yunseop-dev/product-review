import axios, { AxiosError, AxiosResponse } from "axios";

// API 기본 URL
const BASE_URL = "https://dummyjson.com";

// 액세스 토큰을 로컬 스토리지에서 가져오는 함수
const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// 리프레시 토큰을 로컬 스토리지에서 가져오는 함수
const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

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
    const token = getAccessToken();
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
    const originalRequest = error.config;

    // 토큰 만료 오류(401)이고 원래 요청 정보가 있으며 아직 재시도하지 않은 경우
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.headers["x-retry"]
    ) {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // 리프레시 토큰이 없으면 로그인 페이지로 리다이렉트
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        // 리프레시 토큰으로 새 액세스 토큰 요청
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // 새 토큰 저장
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // 원래 요청 재시도
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["x-retry"] = "true";
        return api(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료되면 로그인 페이지로 리다이렉트
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
