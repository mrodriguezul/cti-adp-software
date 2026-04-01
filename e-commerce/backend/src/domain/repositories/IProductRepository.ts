import { Product } from '../entities/Product.js';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ProductListResult {
  products: Product[];
  totalCount: number;
  hasMore: boolean;
}

export interface IProductRepository {
  findActiveProducts(params: PaginationParams): Promise<ProductListResult>;
  findById(id: number): Promise<Product | null>;
}