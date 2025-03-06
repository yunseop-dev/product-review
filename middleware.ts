import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// 이 미들웨어는 모든 요청에 세션 정보를 추가합니다
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      // 인증 페이지(/login 등)는 인증 체크에서 제외
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/login") || path.startsWith("/api/auth")) {
          return true;
        }
        // 보호된 라우트만 체크하려면 아래 주석을 해제하세요
        // if (path.startsWith("/admin") || path.startsWith("/profile")) {
        //   return !!token;
        // }
        return true;
      },
    },
  }
);

// 미들웨어가 적용될 경로 패턴 설정
export const config = {
  matcher: [
    // 미들웨어를 적용할 경로 패턴 (필요에 따라 수정)
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
