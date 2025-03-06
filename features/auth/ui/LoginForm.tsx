"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthLogin } from "../hooks";
const loginSchema = z.object({
  username: z.string().min(1, "사용자 이름을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { mutate: login, isPending, error } = useAuthLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    // NextAuth를 통한 로그인
    login({
      username: data.username,
      password: data.password,
    });

    // 로그인 성공 시 리디렉션
    router.push(callbackUrl);
    router.refresh(); // 세션 정보를 업데이트하기 위해 페이지 새로고침
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center">로그인</h1>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            사용자 이름
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            {...register("username")}
            placeholder="사용자 이름"
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            {...register("password")}
            placeholder="비밀번호"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-foreground text-background rounded-md hover:bg-opacity-90 disabled:opacity-50"
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="text-sm text-center mt-4">
        <p>테스트 계정: kminchelle / 0lelplR</p>
      </div>
    </div>
  );
}
