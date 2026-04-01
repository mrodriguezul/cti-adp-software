import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetProductByIdUseCase, GetProductByIdInputSchema, ProductNotFoundError } from './GetProductByIdUseCase';
import {
  IProductRepository
} from '../../domain/repositories/IProductRepository.js';
import { Product } from '../../domain/entities/Product.js';

// Mock repository
class MockProductRepository implements IProductRepository {
  async findActiveProducts(): Promise<any> {
    throw new Error('Method not implemented - should be mocked in tests');
  }

  async findById(id: number): Promise<Product | null> {
    throw new Error('Method not implemented - should be mocked in tests');
  }
}

describe('GetProductByIdUseCase', () => {
  let useCase: GetProductByIdUseCase;
  let mockRepository: IProductRepository;

  beforeEach(() => {
    mockRepository = new MockProductRepository();
    useCase = new GetProductByIdUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should return a product when a valid id is provided and repository finds it', async () => {
      // Arrange
      const input = { id: 1 };
      const mockProduct: Product = new Product(1, 'PROD-001', 'Test Product', 'Test description', 99.99, 50, 'https://example.com/image.jpg', 'A');

      const findByIdSpy = jest
        .spyOn(mockRepository, 'findById')
        .mockResolvedValue(mockProduct);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
      expect(findByIdSpy).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
      expect(result.id).toBe(1);
      expect(result.sku).toBe('PROD-001');
      expect(result.name).toBe('Test Product');
      expect(result.price).toBe(99.99);
    });

    it('should throw ProductNotFoundError when repository returns null', async () => {
      // Arrange
      const input = { id: 999 };

      const findByIdSpy = jest
        .spyOn(mockRepository, 'findById')
        .mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(ProductNotFoundError);
      await expect(useCase.execute(input)).rejects.toThrow('Product with id 999 not found');
      expect(findByIdSpy).toHaveBeenCalledWith(999);
    });

    it('should propagate repository errors to the caller', async () => {
      // Arrange
      const input = { id: 1 };
      const repositoryError = new Error('Database connection failed');

      jest
        .spyOn(mockRepository, 'findById')
        .mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow('Database connection failed');
    });

    it('should throw validation error when id is less than 1', async () => {
      // Arrange
      const input = { id: 0 };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
    });

    it('should throw validation error when id is negative', async () => {
      // Arrange
      const input = { id: -5 };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
    });

    it('should throw validation error when id is not an integer', async () => {
      // Arrange
      const input = { id: 1.5 };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow();
    });

    it('should correctly handle product with null description', async () => {
      // Arrange
      const input = { id: 5 };
      const mockProduct: Product = new Product(5, 'PROD-005', 'Product Without Description', null, 49.99, 10, null, 'A');

      const findByIdSpy = jest
        .spyOn(mockRepository, 'findById')
        .mockResolvedValue(mockProduct);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(findByIdSpy).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockProduct);
      expect(result.description).toBeNull();
      expect(result.imageUrl).toBeNull();
    });

    it('should handle large product ids correctly', async () => {
      // Arrange
      const input = { id: 999999 };
      const mockProduct: Product = new Product(999999, 'PROD-999999', 'Product with Large ID', 'Test', 199.99, 100, 'https://example.com/image.jpg', 'A');

      const findByIdSpy = jest
        .spyOn(mockRepository, 'findById')
        .mockResolvedValue(mockProduct);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(findByIdSpy).toHaveBeenCalledWith(999999);
      expect(result.id).toBe(999999);
    });

    it('should validate input using GetProductByIdInputSchema', async () => {
      // Arrange & Act
      const validInput = { id: 42 };
      const parsed = GetProductByIdInputSchema.parse(validInput);

      // Assert
      expect(parsed).toEqual({ id: 42 });
    });

    it('should reject invalid schemas', async () => {
      // Arrange & Act & Assert
      expect(() => GetProductByIdInputSchema.parse({ id: 'invalid' })).toThrow();
      expect(() => GetProductByIdInputSchema.parse({ id: null })).toThrow();
      expect(() => GetProductByIdInputSchema.parse({})).toThrow();
    });
  });

  describe('ProductNotFoundError', () => {
    it('should have correct error name and message', () => {
      // Arrange & Act
      const error = new ProductNotFoundError(42);

      // Assert
      expect(error.name).toBe('ProductNotFoundError');
      expect(error.message).toBe('Product with id 42 not found');
      expect(error instanceof Error).toBe(true);
    });

    it('should be catchable as ProductNotFoundError instance', () => {
      // Arrange & Act & Assert
      expect(() => {
        throw new ProductNotFoundError(10);
      }).toThrow(ProductNotFoundError);
    });
  });
});
