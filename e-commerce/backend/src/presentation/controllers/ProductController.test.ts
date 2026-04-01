import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { ProductController } from './ProductController';
import { GetProductsUseCase } from '../../application/use-cases/GetProductsUseCase';
import { GetProductByIdUseCase, ProductNotFoundError } from '../../application/use-cases/GetProductByIdUseCase';
import { ProductListResult } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';
import { z } from 'zod';

// Mock Request, Response, and NextFunction
type MockResponse = {
  status: jest.Mock;
  json: jest.Mock;
};

type MockRequest = {
  query: Record<string, string | undefined>;
  params: Record<string, string>;
};

const createMockRequest = (
  query: Record<string, string | undefined> = {},
  params: Record<string, string> = {}
): MockRequest => ({
  query,
  params
});

const createMockResponse = (): MockResponse => {
  const res: MockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };
  return res;
};

const createMockNextFunction = (): jest.Mock => jest.fn();

describe('ProductController', () => {
  let controller: ProductController;
  let mockGetProductsUseCase: jest.Mocked<GetProductsUseCase>;
  let mockGetProductByIdUseCase: jest.Mocked<GetProductByIdUseCase>;
  let mockRequest: MockRequest;
  let mockResponse: MockResponse;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Create mock use cases with jest.fn() for execute method
    mockGetProductsUseCase = {
      execute: jest.fn()
    } as any;

    mockGetProductByIdUseCase = {
      execute: jest.fn()
    } as any;

    controller = new ProductController(mockGetProductsUseCase, mockGetProductByIdUseCase);
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
    mockNext = createMockNextFunction();
  });

  describe('getProducts', () => {
    it('should parse query parameters, call the use case, and return 200 OK with JSON payload', async () => {
      // Arrange
      mockRequest.query = { page: '2', limit: '10' };

      const mockProducts: Product[] = [
        new Product(1, 'PROD-001', 'Test Product 1', 'Test description 1', 99.99, 50, 'https://example.com/image1.jpg', 'A'),
        new Product(2, 'PROD-002', 'Test Product 2', 'Test description 2', 149.99, 25, 'https://example.com/image2.jpg', 'A')
      ];

      const mockUseCaseResult: ProductListResult = {
        products: mockProducts,
        totalCount: 25,
        hasMore: true
      };

      mockGetProductsUseCase.execute.mockResolvedValue(mockUseCaseResult);

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductsUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockGetProductsUseCase.execute).toHaveBeenCalledWith({
        page: 2,
        limit: 10
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          products: mockProducts,
          pagination: {
            page: 2,
            limit: 10,
            totalCount: 25,
            hasMore: true,
            totalPages: 3
          }
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should catch internal errors from the use case and pass to next middleware', async () => {
      // Arrange
      mockRequest.query = { page: '1', limit: '12' };
      const internalError = new Error('Database connection failed');

      mockGetProductsUseCase.execute.mockRejectedValue(internalError);

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductsUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(internalError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should use default pagination values when no query parameters are provided', async () => {
      // Arrange
      mockRequest.query = {}; // No query parameters

      const mockUseCaseResult: ProductListResult = {
        products: [],
        totalCount: 0,
        hasMore: false
      };

      mockGetProductsUseCase.execute.mockResolvedValue(mockUseCaseResult);

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductsUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        limit: 12
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          products: [],
          pagination: {
            page: 1,
            limit: 12,
            totalCount: 0,
            hasMore: false,
            totalPages: 0
          }
        }
      });
    });

    it('should return 400 Bad Request when page parameter is invalid (negative number)', async () => {
      // Arrange
      mockRequest.query = { page: '-1', limit: '12' };

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductsUseCase.execute).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid page parameter. Must be a positive integer.',
        code: 'INVALID_PAGE'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 Bad Request when page parameter is invalid (zero)', async () => {
      // Arrange
      mockRequest.query = { page: '0', limit: '12' };

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductsUseCase.execute).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid page parameter. Must be a positive integer.',
        code: 'INVALID_PAGE'
      });
    });

    it('should return 400 Bad Request when page parameter is not a number', async () => {
      // Arrange
      mockRequest.query = { page: 'abc', limit: '12' };

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductsUseCase.execute).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid page parameter. Must be a positive integer.',
        code: 'INVALID_PAGE'
      });
    });

    it('should return 400 Bad Request when limit parameter is invalid (negative number)', async () => {
      // Arrange
      mockRequest.query = { page: '1', limit: '-5' };

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductsUseCase.execute).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid limit parameter. Must be between 1 and 100.',
        code: 'INVALID_LIMIT'
      });
    });

    it('should return 400 Bad Request when limit parameter is invalid (zero)', async () => {
      // Arrange
      mockRequest.query = { page: '1', limit: '0' };

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductsUseCase.execute).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid limit parameter. Must be between 1 and 100.',
        code: 'INVALID_LIMIT'
      });
    });

    it('should return 400 Bad Request when limit parameter exceeds maximum (101)', async () => {
      // Arrange
      mockRequest.query = { page: '1', limit: '101' };

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductsUseCase.execute).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid limit parameter. Must be between 1 and 100.',
        code: 'INVALID_LIMIT'
      });
    });

    it('should return 400 Bad Request when limit parameter is not a number', async () => {
      // Arrange
      mockRequest.query = { page: '1', limit: 'xyz' };

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductsUseCase.execute).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid limit parameter. Must be between 1 and 100.',
        code: 'INVALID_LIMIT'
      });
    });

    it('should handle ZodError from use case and return 400 Bad Request with validation details', async () => {
      // Arrange
      mockRequest.query = { page: '1', limit: '12' };

      const zodError = new z.ZodError([
        {
          code: 'too_small',
          minimum: 1,
          type: 'number',
          inclusive: true,
          exact: false,
          message: 'Number must be greater than or equal to 1',
          path: ['page']
        }
      ]);

      mockGetProductsUseCase.execute.mockRejectedValue(zodError);

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductsUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: zodError.errors,
        code: 'VALIDATION_ERROR'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should calculate totalPages correctly when totalCount is evenly divisible by limit', async () => {
      // Arrange
      mockRequest.query = { page: '1', limit: '10' };

      const mockUseCaseResult: ProductListResult = {
        products: [],
        totalCount: 100, // Evenly divisible by 10
        hasMore: true
      };

      mockGetProductsUseCase.execute.mockResolvedValue(mockUseCaseResult);

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          pagination: expect.objectContaining({
            totalPages: 10
          })
        })
      });
    });

    it('should calculate totalPages correctly when totalCount is not evenly divisible by limit', async () => {
      // Arrange
      mockRequest.query = { page: '1', limit: '12' };

      const mockUseCaseResult: ProductListResult = {
        products: [],
        totalCount: 25, // Not evenly divisible by 12
        hasMore: true
      };

      mockGetProductsUseCase.execute.mockResolvedValue(mockUseCaseResult);

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          pagination: expect.objectContaining({
            totalPages: 3 // Math.ceil(25/12) = 3
          })
        })
      });
    });

    it('should handle empty product list correctly', async () => {
      // Arrange
      mockRequest.query = { page: '1', limit: '12' };

      const mockUseCaseResult: ProductListResult = {
        products: [],
        totalCount: 0,
        hasMore: false
      };

      mockGetProductsUseCase.execute.mockResolvedValue(mockUseCaseResult);

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          products: [],
          pagination: {
            page: 1,
            limit: 12,
            totalCount: 0,
            hasMore: false,
            totalPages: 0
          }
        }
      });
    });

    it('should handle maximum allowed page and limit values', async () => {
      // Arrange
      mockRequest.query = { page: '999999', limit: '100' };

      const mockUseCaseResult: ProductListResult = {
        products: [],
        totalCount: 0,
        hasMore: false
      };

      mockGetProductsUseCase.execute.mockResolvedValue(mockUseCaseResult);

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductsUseCase.execute).toHaveBeenCalledWith({
        page: 999999,
        limit: 100
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should preserve hasMore flag from use case result', async () => {
      // Arrange
      mockRequest.query = { page: '2', limit: '10' };

      const mockUseCaseResult: ProductListResult = {
        products: [],
        totalCount: 25,
        hasMore: true
      };

      mockGetProductsUseCase.execute.mockResolvedValue(mockUseCaseResult);

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          pagination: expect.objectContaining({
            hasMore: true
          })
        })
      });
    });

    it('should handle decimal values in page parameter by parsing as integer', async () => {
      // Arrange
      mockRequest.query = { page: '2.9', limit: '12' };

      const mockUseCaseResult: ProductListResult = {
        products: [],
        totalCount: 0,
        hasMore: false
      };

      mockGetProductsUseCase.execute.mockResolvedValue(mockUseCaseResult);

      // Act
      await controller.getProducts(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductsUseCase.execute).toHaveBeenCalledWith({
        page: 2, // Should be parsed as integer (2.9 -> 2)
        limit: 12
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getProductById', () => {
    it('should return 200 OK with product data when a valid id is provided and use case succeeds', async () => {
      // Arrange
      const mockProduct: Product = new Product(1, 'PROD-001', 'Test Product', 'Test description', 99.99, 50, 'https://example.com/image.jpg', 'A');

      mockRequest.params = { id: '1' };
      mockGetProductByIdUseCase.execute.mockResolvedValue(mockProduct);

      // Act
      await controller.getProductById(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductByIdUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockGetProductByIdUseCase.execute).toHaveBeenCalledWith({ id: 1 });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          product: mockProduct
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 404 Not Found when use case throws ProductNotFoundError', async () => {
      // Arrange
      mockRequest.params = { id: '999' };
      const notFoundError = new ProductNotFoundError(999);

      mockGetProductByIdUseCase.execute.mockRejectedValue(notFoundError);

      // Act
      await controller.getProductById(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductByIdUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockGetProductByIdUseCase.execute).toHaveBeenCalledWith({ id: 999 });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Product with id 999 not found',
        code: 'PRODUCT_NOT_FOUND'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 Bad Request when id is not a valid number', async () => {
      // Arrange
      mockRequest.params = { id: 'abc' };

      // Act
      await controller.getProductById(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductByIdUseCase.execute).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid product ID. Must be a positive integer.',
        code: 'INVALID_ID'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 Bad Request when id is zero', async () => {
      // Arrange
      mockRequest.params = { id: '0' };

      // Act
      await controller.getProductById(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductByIdUseCase.execute).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid product ID. Must be a positive integer.',
        code: 'INVALID_ID'
      });
    });

    it('should return 400 Bad Request when id is negative', async () => {
      // Arrange
      mockRequest.params = { id: '-5' };

      // Act
      await controller.getProductById(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductByIdUseCase.execute).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should pass unexpected errors to error handling middleware', async () => {
      // Arrange
      mockRequest.params = { id: '1' };
      const internalError = new Error('Database connection failed');

      mockGetProductByIdUseCase.execute.mockRejectedValue(internalError);

      // Act
      await controller.getProductById(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductByIdUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(internalError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should handle ZodError from use case and return 400 Bad Request with validation details', async () => {
      // Arrange
      mockRequest.params = { id: '1' };

      const zodError = new z.ZodError([
        {
          code: 'too_small',
          minimum: 1,
          type: 'number',
          inclusive: true,
          exact: false,
          message: 'Number must be greater than or equal to 1',
          path: ['id']
        }
      ]);

      mockGetProductByIdUseCase.execute.mockRejectedValue(zodError);

      // Act
      await controller.getProductById(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductByIdUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: zodError.errors,
        code: 'VALIDATION_ERROR'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should correctly parse string id to number', async () => {
      // Arrange
      const mockProduct: Product = new Product(42, 'PROD-042', 'Product 42', 'Test', 49.99, 10, null, 'A');

      mockRequest.params = { id: '42' };
      mockGetProductByIdUseCase.execute.mockResolvedValue(mockProduct);

      // Act
      await controller.getProductById(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductByIdUseCase.execute).toHaveBeenCalledWith({ id: 42 });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle decimal values in id parameter by parsing as integer', async () => {
      // Arrange
      mockRequest.params = { id: '5.9' };

      // Act
      await controller.getProductById(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      // parseInt('5.9', 10) returns 5, which should be valid
      expect(mockGetProductByIdUseCase.execute).toHaveBeenCalledWith({ id: 5 });
    });

    it('should return 200 OK with product data including null fields', async () => {
      // Arrange
      const mockProduct: Product = new Product(5, 'PROD-005', 'Product Without Image', null, 29.99, 0, null, 'A');

      mockRequest.params = { id: '5' };
      mockGetProductByIdUseCase.execute.mockResolvedValue(mockProduct);

      // Act
      await controller.getProductById(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          product: mockProduct
        }
      });
    });

    it('should handle large product ids correctly', async () => {
      // Arrange
      const mockProduct: Product = new Product(999999, 'PROD-999999', 'Product Large ID', 'Test', 199.99, 100, 'https://example.com/image.jpg', 'A');

      mockRequest.params = { id: '999999' };
      mockGetProductByIdUseCase.execute.mockResolvedValue(mockProduct);

      // Act
      await controller.getProductById(
        mockRequest as Request,
        mockResponse as any as Response,
        mockNext as NextFunction
      );

      // Assert
      expect(mockGetProductByIdUseCase.execute).toHaveBeenCalledWith({ id: 999999 });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});
