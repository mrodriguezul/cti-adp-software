export interface ProductData {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  onhand: number;
  imageUrl: string | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ProductListResult {
  products: ProductData[];
  totalCount: number;
  hasMore: boolean;
}

export interface IProductRepository {
  findActiveProducts(params: PaginationParams): Promise<ProductListResult>;
  findById(id: number): Promise<ProductData | null>;
}