import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/services/productService";
import { Product } from "@/types";

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  isError: boolean;
}

/**
 * Custom hook for fetching a single product by ID using React Query
 * @param id - Product ID to fetch
 * @returns Query result with product data, loading state, and error handling
 */
export function useProduct(id: number): UseProductResult {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 1, // Retry failed requests up to 1 time
  });

  return {
    product: data || null,
    loading: isLoading,
    error: error as Error | null,
    isError,
  };
}
