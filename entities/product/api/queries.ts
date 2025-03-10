import { productApi, productKeys } from "../api";

export type ProductQueryParams = {
  page?: number;
  limit?: number;
  category?: string;
  searchQuery?: string;
  isSearchPage?: boolean;
};

/**
 * 제품 목록 또는 검색 결과를 위한 쿼리 옵션
 */
export const getProductsQueryOptions = ({
  page = 1,
  limit = 12,
  category,
  searchQuery,
  isSearchPage = false,
}: ProductQueryParams) => {
  const skip = (page - 1) * limit;

  return {
    queryKey:
      isSearchPage && searchQuery
        ? productKeys.search(searchQuery, page, limit)
        : productKeys.list({
            page,
            limit,
            category: isSearchPage ? undefined : category,
            search: searchQuery,
          }),
    queryFn: async () => {
      if (searchQuery) {
        // 검색어가 있는 경우 검색 API 사용
        return productApi.searchProducts(searchQuery, { skip, limit });
      } else if (category) {
        // 카테고리 필터링이 있는 경우
        return productApi.getProducts({ skip, limit, category });
      } else {
        // 기본 제품 목록
        return productApi.getProducts({ skip, limit });
      }
    },
    staleTime: 60 * 1000, // 1분
  };
};
