import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/productService";

/**
 * Custom hook for fetching paginated products using React Query
 * @param page - Current page number (default: 1)
 * @param limit - Number of products per page (default: 12)
 * @returns Query result with products data, loading state, and error handling
 */
export function useProducts(page: number = 1, limit: number = 12) {
  return useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => fetchProducts(page, limit),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2, // Retry failed requests up to 2 times
  });
}
