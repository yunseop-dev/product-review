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

    // 검색어가 있으면 /search 페이지로 이동
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set("q", searchQuery.trim());

      // /search 페이지로 이동
      router.push(`/search?${params.toString()}`);
    } else {
      // 검색어가 없으면 홈으로 이동
      router.push("/");
    }
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
