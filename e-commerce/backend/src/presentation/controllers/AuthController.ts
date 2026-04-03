import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { RegisterClientUseCase, DuplicateEmailError, InvalidEmailError } from '../../application/use-cases/RegisterClientUseCase.js';
import { LoginClientUseCase } from '../../application/use-cases/LoginClientUseCase.js';

export class AuthController {
  constructor(
    private readonly registerClientUseCase: RegisterClientUseCase,
    private readonly loginClientUseCase: LoginClientUseCase
  ) {}

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract from request body
      const { firstname, lastname, email, password, phone, address } = req.body;

      // Call the use case
      const result = await this.registerClientUseCase.execute({
        firstname,
        lastname,
        email,
        password,
        phone,
        address
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

      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract from request body
      const { email, password } = req.body;

      // Call the use case
      const result = await this.loginClientUseCase.execute({
        email,
        password
      });

      // Return 200 OK with success response
      res.status(200).json({
        success: true,
        data: {
          token: result.token,
          client: result.client
        }
      });
    } catch (error) {
      // Handle invalid email or password
      if (error instanceof Error && error.message === 'Invalid email or password') {
        res.status(401).json({
          error: error.message,
          code: 'INVALID_CREDENTIALS'
        });
        return;
      }

      // Handle other errors
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  };
}
