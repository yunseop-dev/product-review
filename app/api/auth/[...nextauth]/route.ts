import { AuthResponse } from "@/features/auth/api";
import api from "@/shared/api/base";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Auth.js 핸들러 설정
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "사용자 이름", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // DummyJSON API를 사용하여 로그인
          const response = await api.post<AuthResponse>("/auth/login", {
            username: credentials.username,
            password: credentials.password,
          });

          const user = response.data;

          // 로그인 성공 시 사용자 정보 반환
          return {
            id: user.id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            image: user.image,
            // Auth.js 세션에 추가 정보 저장
            token: user.accessToken,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // JWT 콜백: 토큰에 추가 정보 저장
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.token;
      }
      return token;
    },
    // 세션 콜백: 클라이언트에 노출할 세션 정보 설정
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login", // 커스텀 로그인 페이지
  },
  session: {
    strategy: "jwt", // JWT 기반 세션 전략 사용
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key", // 실제 배포 시 환경변수 사용 권장
};

// Auth.js v5 핸들러 생성
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
