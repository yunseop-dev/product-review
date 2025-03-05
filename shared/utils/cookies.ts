import { QueryClient } from "@tanstack/react-query";
import { destroyCookie, parseCookies, setCookie } from "nookies";

// Cookie 유효기간 (초 단위)
const ACCESS_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30일
const REFRESH_TOKEN_MAX_AGE = 60 * 24 * 60 * 60; // 60일

// 쿠키 기본 옵션
const defaultOptions = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const cookieUtils = {
  // 액세스 토큰 관련 함수
  accessToken: {
    get: (ctx: any) => {
      const cookies = parseCookies(ctx);
      return cookies.accessToken || null;
    },
    set: (value: string, ctx: any) => {
      setCookie(ctx, "accessToken", value, {
        ...defaultOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
    },
    remove: (ctx: any) => {
      destroyCookie(ctx, "accessToken", { path: "/" });
    },
  },

  // 리프레시 토큰 관련 함수
  refreshToken: {
    get: (ctx: any) => {
      const cookies = parseCookies(ctx);
      return cookies.refreshToken || null;
    },
    set: (value: string, ctx: any) => {
      setCookie(ctx, "refreshToken", value, {
        ...defaultOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });
    },
    remove: (ctx: any) => {
      destroyCookie(ctx, "refreshToken", { path: "/" });
    },
  },

  // 사용자 ID 관련 함수 (추가)
  userId: {
    get: (ctx: any) => {
      const cookies = parseCookies(ctx);
      return cookies.userId || null;
    },
    set: (value: string, ctx: any) => {
      setCookie(ctx, "userId", value, {
        ...defaultOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
    },
    remove: (ctx: any) => {
      destroyCookie(ctx, "userId", { path: "/" });
    },
  },

  // 모든 인증 관련 쿠키 제거
  clearAuthCookies: (ctx: any) => {
    destroyCookie(ctx, "accessToken", { path: "/" });
    destroyCookie(ctx, "refreshToken", { path: "/" });
    destroyCookie(ctx, "userId", { path: "/" });
  },
};

// 토큰을 쿠키에 저장하고 Query Client를 업데이트하는 함수
export const setAuthTokenAndUpdateCache = (
  token: string,
  queryClient: QueryClient
) => {
  setCookie(null, "auth-token", token, { path: "/", maxAge: 60 * 60 * 24 * 7 }); // 7일간 유지

  // 캐시된 사용자 정보가 있다면 헤더에 토큰 추가
  queryClient.invalidateQueries({ queryKey: ["auth"] });
};

// 토큰을 삭제하고 Query Client를 업데이트하는 함수
export const removeAuthTokenAndUpdateCache = (queryClient: QueryClient) => {
  destroyCookie(null, "auth-token");
  queryClient.setQueryData(["auth", "current"], null);
  queryClient.invalidateQueries({ queryKey: ["auth"] });
};
