import { parseCookies, setCookie, destroyCookie } from "nookies";

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
    get: (ctx?: any) => {
      const cookies = parseCookies(ctx);
      return cookies.accessToken || null;
    },
    set: (value: string, ctx?: any) => {
      setCookie(ctx, "accessToken", value, {
        ...defaultOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
    },
    remove: (ctx?: any) => {
      destroyCookie(ctx, "accessToken", { path: "/" });
    },
  },

  // 리프레시 토큰 관련 함수
  refreshToken: {
    get: (ctx?: any) => {
      const cookies = parseCookies(ctx);
      return cookies.refreshToken || null;
    },
    set: (value: string, ctx?: any) => {
      setCookie(ctx, "refreshToken", value, {
        ...defaultOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE,
        // httpOnly: true, // 보안 강화를 위해 httpOnly 설정
      });
    },
    remove: (ctx?: any) => {
      destroyCookie(ctx, "refreshToken", { path: "/" });
    },
  },

  // 모든 인증 관련 쿠키 제거
  clearAuthCookies: (ctx?: any) => {
    destroyCookie(ctx, "accessToken", { path: "/" });
    destroyCookie(ctx, "refreshToken", { path: "/" });
  },
};
