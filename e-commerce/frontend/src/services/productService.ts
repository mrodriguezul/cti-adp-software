import { Product } from "@/types";

/**
 * Backend API Response structure from GET /api/products endpoint
 */
interface BackendProductsResponse {
  success: boolean;
  data: {
    products: Array<{
      id: number;
      sku: string;
      name: string;
      description: string;
      price: number;
      onhand: number;
      imageUrl: string | null;
    }>;
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      hasMore: boolean;
      totalPages: number;
    };
  };
}

/**
 * Frontend-normalized API Response structure
 */
export interface ProductsApiResponse {
  data: Product[];
  total: number;
  hasMore: boolean;
  page: number;
  totalPages: number;
}

/**
 * Fetch paginated products from the backend API
 * @param page - Page number (1-indexed)
 * @param limit - Number of products per page (default: 12)
 * @returns Promise with products array, total count, and hasMore flag
 */
export async function fetchProducts(
  page: number = 1,
  limit: number = 12
): Promise<ProductsApiResponse> {
  // @ts-ignore - import.meta.env is provided by Vite
  const apiUrl = (import.meta as any).env.VITE_API_URL || "http://localhost:3000/api";
  const response = await fetch(
    `${apiUrl}/products?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const json: BackendProductsResponse = await response.json();

  // Map backend response to frontend Product type
  const products: Product[] = json.data.products.map((backendProduct) => ({
    id: backendProduct.id,
    sku: backendProduct.sku,
    name: backendProduct.name,
    description: backendProduct.description,
    price: backendProduct.price,
    onhand: backendProduct.onhand,
    image_url: backendProduct.imageUrl || "",
  }));

  return {
    data: products,
    total: json.data.pagination.totalCount,
    hasMore: json.data.pagination.hasMore,
    page: json.data.pagination.page,
    totalPages: json.data.pagination.totalPages,
  };
}

/**
 * Fetch a single product by ID
 * @param id - Product ID
 * @returns Promise with product data or null if not found
 */
export async function fetchProductById(id: number): Promise<Product | null> {
  // @ts-ignore - import.meta.env is provided by Vite
  const apiUrl = (import.meta as any).env.VITE_API_URL || "http://localhost:3000/api";
  const response = await fetch(`${apiUrl}/products/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const json = await response.json();

  // Map backend response to frontend Product type
  if (json.success && json.data) {
    return {
      id: json.data.id,
      sku: json.data.sku,
      name: json.data.name,
      description: json.data.description,
      price: json.data.price,
      onhand: json.data.onhand,
      image_url: json.data.imageUrl,
    };
  }

  return null;
}
