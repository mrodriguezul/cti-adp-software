import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetProductsUseCase, GetProductsInputSchema } from './GetProductsUseCase';
import {
  IProductRepository,
  ProductListResult,
  ProductData
} from '../../domain/repositories/IProductRepository.js';
import { z } from 'zod';

// Mock repository
class MockProductRepository implements IProductRepository {
  async findActiveProducts(params: { page: number; limit: number }): Promise<ProductListResult> {
    throw new Error('Method not implemented - should be mocked in tests');
  }
}

describe('GetProductsUseCase', () => {
  let useCase: GetProductsUseCase;
  let mockRepository: IProductRepository;

  beforeEach(() => {
    mockRepository = new MockProductRepository();
    useCase = new GetProductsUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should successfully return paginated products and map the data correctly', async () => {
      // Arrange
      const input = { page: 2, limit: 10 };
      const mockProducts: ProductData[] = [
        {
          id: 1,
          sku: 'PROD-001',
          name: 'Test Product 1',
          description: 'Test description 1',
          price: 99.99,
          onhand: 50,
          imageUrl: 'https://example.com/image1.jpg'
        },
        {
          id: 2,
          sku: 'PROD-002',
          name: 'Test Product 2',
          description: 'Test description 2',
          price: 149.99,
          onhand: 25,
          imageUrl: 'https://example.com/image2.jpg'
        }
      ];
      const expectedResult: ProductListResult = {
        products: mockProducts,
        totalCount: 25,
        hasMore: true
      };

      const findActiveProductsSpy = jest
        .spyOn(mockRepository, 'findActiveProducts')
        .mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(findActiveProductsSpy).toHaveBeenCalledTimes(1);
      expect(findActiveProductsSpy).toHaveBeenCalledWith({
        page: 2,
        limit: 10
      });
      expect(result).toEqual(expectedResult);
      expect(result.products).toHaveLength(2);
      expect(result.products[0]).toMatchObject({
        id: 1,
        sku: 'PROD-001',
        name: 'Test Product 1',
        price: 99.99,
        onhand: 50
      });
      expect(result.totalCount).toBe(25);
      expect(result.hasMore).toBe(true);
    });

    it('should use default pagination values (page 1, limit 12) if none are provided', async () => {
      // Arrange
      const input = {} as any; // No pagination parameters provided
      const expectedResult: ProductListResult = {
        products: [],
        totalCount: 0,
        hasMore: false
      };

      const findActiveProductsSpy = jest
        .spyOn(mockRepository, 'findActiveProducts')
        .mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(findActiveProductsSpy).toHaveBeenCalledTimes(1);
      expect(findActiveProductsSpy).toHaveBeenCalledWith({
        page: 1,
        limit: 12
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle an empty database gracefully (return 0 products, total 0, hasMore false)', async () => {
      // Arrange
      const input = { page: 1, limit: 12 };
      const emptyResult: ProductListResult = {
        products: [],
        totalCount: 0,
        hasMore: false
      };

      const findActiveProductsSpy = jest
        .spyOn(mockRepository, 'findActiveProducts')
        .mockResolvedValue(emptyResult);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(findActiveProductsSpy).toHaveBeenCalledTimes(1);
      expect(findActiveProductsSpy).toHaveBeenCalledWith({
        page: 1,
        limit: 12
      });
      expect(result.products).toEqual([]);
      expect(result.totalCount).toBe(0);
      expect(result.hasMore).toBe(false);
    });

    it('should apply default values when only page is provided', async () => {
      // Arrange
      const input = { page: 3 } as any; // Only page provided
      const expectedResult: ProductListResult = {
        products: [],
        totalCount: 36,
        hasMore: true
      };

      const findActiveProductsSpy = jest
        .spyOn(mockRepository, 'findActiveProducts')
        .mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(findActiveProductsSpy).toHaveBeenCalledWith({
        page: 3,
        limit: 12 // Default limit should be applied
      });
      expect(result).toEqual(expectedResult);
    });

    it('should apply default values when only limit is provided', async () => {
      // Arrange
      const input = { limit: 20 } as any; // Only limit provided
      const expectedResult: ProductListResult = {
        products: [],
        totalCount: 40,
        hasMore: true
      };

      const findActiveProductsSpy = jest
        .spyOn(mockRepository, 'findActiveProducts')
        .mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(findActiveProductsSpy).toHaveBeenCalledWith({
        page: 1, // Default page should be applied
        limit: 20
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw validation error when page is less than 1', async () => {
      // Arrange
      const input = { page: 0, limit: 12 };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(z.ZodError);
      await expect(useCase.execute(input)).rejects.toMatchObject({
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: ['page'],
            message: expect.any(String)
          })
        ])
      });
    });

    it('should throw validation error when page is not an integer', async () => {
      // Arrange
      const input = { page: 1.5, limit: 12 };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(z.ZodError);
    });

    it('should throw validation error when limit is less than 1', async () => {
      // Arrange
      const input = { page: 1, limit: 0 };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(z.ZodError);
      await expect(useCase.execute(input)).rejects.toMatchObject({
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: ['limit'],
            message: expect.any(String)
          })
        ])
      });
    });

    it('should throw validation error when limit exceeds 100', async () => {
      // Arrange
      const input = { page: 1, limit: 101 };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(z.ZodError);
      await expect(useCase.execute(input)).rejects.toMatchObject({
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: ['limit'],
            message: expect.any(String)
          })
        ])
      });
    });

    it('should propagate repository errors to the caller', async () => {
      // Arrange
      const input = { page: 1, limit: 12 };
      const repositoryError = new Error('Database connection failed');

      jest
        .spyOn(mockRepository, 'findActiveProducts')
        .mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow('Database connection failed');
    });

    it('should handle large result sets correctly', async () => {
      // Arrange
      const input = { page: 1, limit: 100 }; // Maximum allowed limit
      const mockProducts: ProductData[] = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        sku: `PROD-${String(i + 1).padStart(3, '0')}`,
        name: `Test Product ${i + 1}`,
        description: `Description for product ${i + 1}`,
        price: 99.99 + i,
        onhand: 10 + i,
        imageUrl: `https://example.com/image${i + 1}.jpg`
      }));
      const expectedResult: ProductListResult = {
        products: mockProducts,
        totalCount: 500,
        hasMore: true
      };

      const findActiveProductsSpy = jest
        .spyOn(mockRepository, 'findActiveProducts')
        .mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(findActiveProductsSpy).toHaveBeenCalledWith({
        page: 1,
        limit: 100
      });
      expect(result.products).toHaveLength(100);
      expect(result.totalCount).toBe(500);
      expect(result.hasMore).toBe(true);
    });
  });
});
