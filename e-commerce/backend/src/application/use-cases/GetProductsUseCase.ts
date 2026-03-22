import { z } from 'zod';
import {
  IProductRepository,
  ProductListResult,
  PaginationParams
} from '../../domain/repositories/IProductRepository.js';

// Input validation schema
export const GetProductsInputSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(12)
});

export type GetProductsInput = z.infer<typeof GetProductsInputSchema>;

export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: GetProductsInput): Promise<ProductListResult> {
    // Validate and sanitize input
    const validatedInput = GetProductsInputSchema.parse(input);

    const paginationParams: PaginationParams = {
      page: validatedInput.page,
      limit: validatedInput.limit
    };

    // Execute repository call
    const result = await this.productRepository.findActiveProducts(paginationParams);

    return result;
  }
}