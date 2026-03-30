import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { RegisterClientUseCase, DuplicateEmailError, InvalidEmailError } from '../../application/use-cases/RegisterClientUseCase.js';

export class AuthController {
  constructor(private readonly registerClientUseCase: RegisterClientUseCase) {}

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract from request body
      const { email, password, name, phone } = req.body;

      // Call the use case
      const result = await this.registerClientUseCase.execute({
        email,
        password,
        name,
        phone
      });

      // Return 201 Created with success response
      res.status(201).json({
        success: true,
        data: {
          clientId: result.id
        }
      });
    } catch (error) {
      // Handle duplicate email conflict
      if (error instanceof DuplicateEmailError) {
        res.status(409).json({
          error: error.message,
          code: 'DUPLICATE_EMAIL'
        });
        return;
      }

      // Handle invalid email validation error
      if (error instanceof InvalidEmailError) {
        res.status(400).json({
          error: error.message,
          code: 'INVALID_EMAIL'
        });
        return;
      }

      // Handle Zod validation errors
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
