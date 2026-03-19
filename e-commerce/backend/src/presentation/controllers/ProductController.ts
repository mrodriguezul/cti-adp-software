import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { GetProductsUseCase } from '../../application/use-cases/GetProductsUseCase.js';

export class ProductController {
  constructor(private readonly getProductsUseCase: GetProductsUseCase) {}

  public getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract and parse query parameters
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;

      // Validate inputs
      if (isNaN(page) || page < 1) {
        res.status(400).json({
          error: 'Invalid page parameter. Must be a positive integer.',
          code: 'INVALID_PAGE'
        });
        return;
      }

      if (isNaN(limit) || limit < 1 || limit > 100) {
        res.status(400).json({
          error: 'Invalid limit parameter. Must be between 1 and 100.',
          code: 'INVALID_LIMIT'
        });
        return;
      }

      // Execute use case
      const result = await this.getProductsUseCase.execute({ page, limit });

      // Return successful response
      res.status(200).json({
        success: true,
        data: {
          products: result.products,
          pagination: {
            page,
            limit,
            totalCount: result.totalCount,
            hasMore: result.hasMore,
            totalPages: Math.ceil(result.totalCount / limit)
          }
        }
      });
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
          code: 'VALIDATION_ERROR'
        });
        return;
      }

      // Pass other errors to error handling middleware
      next(error);
    }
  };
}