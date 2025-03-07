"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    // 기존 URL 파라미터 유지하면서 검색어 추가
    const params = new URLSearchParams(window.location.search);

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }

    // 페이지 리셋 (검색 시 첫 페이지로)
    params.delete("page");

    // 검색 결과로 이동
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-3xl mx-auto">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="제품 검색..."
        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
      >
        검색
      </button>
    </form>
  );
}
