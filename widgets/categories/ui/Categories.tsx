"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";
import api from "@/shared/api/base";

interface CategoriesProps {
  selectedCategory: string;
}

export default function Categories({ selectedCategory }: CategoriesProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(selectedCategory);

  // 카테고리 데이터 가져오기
  const { data: categories = [] } = useQuery<
    { slug: string; name: string; url: string }[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/products/categories");
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10분 동안 유효
  });
  // 카테고리 선택 핸들러
  const handleCategorySelect = (category: string) => {
    if (category === selected) {
      // 이미 선택된 카테고리를 다시 클릭하면 필터 제거
      setSelected("");
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete("category");

      // 페이지 파라미터 유지
      if (searchParams.toString()) {
        router.push(`/?${searchParams.toString()}`);
      } else {
        router.push("/");
      }
    } else {
      setSelected(category);

      // 기존 검색 파라미터 유지
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("category", category);
      router.push(`/?${searchParams.toString()}`);
    }
  };

  // selectedCategory prop이 변경되면 state 업데이트
  useEffect(() => {
    setSelected(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">카테고리</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategorySelect("")}
          className={clsx(
            "px-4 py-2 rounded-full border transition-colors",
            !selected
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          )}
        >
          전체
        </button>

        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => handleCategorySelect(category.slug)}
            className={clsx(
              "px-4 py-2 rounded-full border transition-colors",
              selected === category.slug
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
