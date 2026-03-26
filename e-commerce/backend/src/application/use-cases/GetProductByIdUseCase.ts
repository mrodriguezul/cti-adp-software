import { z } from 'zod';
import {
  IProductRepository,
  ProductData
} from '../../domain/repositories/IProductRepository.js';

// Input validation schema
export const GetProductByIdInputSchema = z.object({
  id: z.number().int().min(1)
});

export type GetProductByIdInput = z.infer<typeof GetProductByIdInputSchema>;

export class ProductNotFoundError extends Error {
  constructor(id: number) {
    super(`Product with id ${id} not found`);
    this.name = 'ProductNotFoundError';
  }
}

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: GetProductByIdInput): Promise<ProductData> {
    // Validate and sanitize input
    const validatedInput = GetProductByIdInputSchema.parse(input);

    // Fetch product by id
    const product = await this.productRepository.findById(validatedInput.id);

    if (!product) {
      throw new ProductNotFoundError(validatedInput.id);
    }

    return product;
  }
}
