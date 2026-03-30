import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthController } from './AuthController.js';
import {
  RegisterClientUseCase,
  DuplicateEmailError,
  InvalidEmailError
} from '../../application/use-cases/RegisterClientUseCase.js';

describe('AuthController', () => {
  let controller: AuthController;
  let mockUseCase: jest.Mocked<RegisterClientUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCase = {
      execute: jest.fn()
    } as any;

    controller = new AuthController(mockUseCase);

    mockResponse = {
      status: jest.fn().mockReturnThis() as jest.Mock,
      json: jest.fn().mockReturnThis() as jest.Mock
    };

    mockRequest = {
      body: {}
    };

    mockNext = jest.fn();
  });

  describe('Test 1: Return 201 and client ID on successful registration', () => {
    it('should return 201 Created with clientId on successful registration', async () => {
      mockRequest.body = {
        firstname: 'Miguel',
        lastname: 'Smith',
        email: 'test@test.com',
        password: 'password123',
        phone: '+61400000000',
        address: '123 Main St'
      };

      (mockUseCase.execute as jest.Mock).mockResolvedValueOnce({ id: 42 });

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          clientId: 42
        }
      });
      expect(mockUseCase.execute).toHaveBeenCalledWith({
        firstname: 'Miguel',
        lastname: 'Smith',
        email: 'test@test.com',
        password: 'password123',
        phone: '+61400000000',
        address: '123 Main St'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle registration without phone number', async () => {
      mockRequest.body = {
        firstname: 'Alice',
        lastname: 'Johnson',
        email: 'alice@example.com',
        password: 'SecurePass123',
        address: '456 Oak Ave'
      };

      (mockUseCase.execute as jest.Mock).mockResolvedValueOnce({ id: 99 });

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          clientId: 99
        }
      });
    });

    it('should pass through all request body fields to use case', async () => {
      mockRequest.body = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        password: 'TestPass999',
        phone: '+61412345678',
        address: '789 Pine Rd'
      };

      (mockUseCase.execute as jest.Mock).mockResolvedValueOnce({ id: 100 });

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        password: 'TestPass999',
        phone: '+61412345678',
        address: '789 Pine Rd'
      });
    });
  });

  describe('Test 2: Return 409 if use case throws duplicate email conflict error', () => {
    it('should return 409 Conflict when DuplicateEmailError is thrown', async () => {
      mockRequest.body = {
        firstname: 'Miguel',
        lastname: 'Smith',
        email: 'existing@example.com',
        password: 'SecurePass123',
        address: '123 Main St'
      };

      const error = new DuplicateEmailError('existing@example.com');
      (mockUseCase.execute as jest.Mock).mockRejectedValueOnce(error);

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'A client with email existing@example.com already exists',
        code: 'DUPLICATE_EMAIL'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should include the correct error message from exception', async () => {
      const email = 'duplicate@example.com';
      mockRequest.body = {
        firstname: 'Jane',
        lastname: 'Doe',
        email,
        password: 'SecurePass123',
        address: '456 Oak Ave'
      };

      const error = new DuplicateEmailError(email);
      (mockUseCase.execute as jest.Mock).mockRejectedValueOnce(error);

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: `A client with email ${email} already exists`,
        code: 'DUPLICATE_EMAIL'
      });
    });
  });

  describe('Test 3: Return 400 on validation failures (missing fields, bad email)', () => {
    it('should return 400 when InvalidEmailError is thrown', async () => {
      mockRequest.body = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'invalidemail',
        password: 'SecurePass123',
        address: '789 Pine Rd'
      };

      const error = new InvalidEmailError('invalidemail');
      (mockUseCase.execute as jest.Mock).mockRejectedValueOnce(error);

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid email format: invalidemail',
        code: 'INVALID_EMAIL'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 when ZodError is thrown (e.g., missing first name)', async () => {
      mockRequest.body = {
        lastname: 'Doe',
        email: 'user@example.com',
        password: 'SecurePass123'
      };

      const zodError = new z.ZodError([
        {
          code: 'too_small',
          minimum: 1,
          type: 'string',
          inclusive: true,
          exact: false,
          message: 'First name is required',
          path: ['firstname']
        }
      ]);

      (mockUseCase.execute as jest.Mock).mockRejectedValueOnce(zodError);

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR'
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 when password is too short', async () => {
      mockRequest.body = {
        firstname: 'Miguel',
        lastname: 'Smith',
        email: 'user@example.com',
        password: 'Short',
        address: '123 Main St'
      };

      const zodError = new z.ZodError([
        {
          code: 'too_small',
          minimum: 8,
          type: 'string',
          inclusive: true,
          exact: false,
          message: 'Password must be at least 8 characters',
          path: ['password']
        }
      ]);

      (mockUseCase.execute as jest.Mock).mockRejectedValueOnce(zodError);

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: expect.any(Array)
        })
      );
    });

    it('should return 400 with details array from ZodError', async () => {
      mockRequest.body = {
        firstname: 'John',
        email: 'invalid-email',
        password: 'pass'
      };

      const zodError = new z.ZodError([
        {
          code: 'invalid_string',
          validation: 'email',
          message: 'Invalid email',
          path: ['email']
        },
        {
          code: 'too_small',
          minimum: 8,
          type: 'string',
          inclusive: true,
          exact: false,
          message: 'Password must be at least 8 characters',
          path: ['password']
        }
      ] as any);

      (mockUseCase.execute as jest.Mock).mockRejectedValueOnce(zodError);

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      const callArgs = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(callArgs.error).toBe('Validation failed');
      expect(callArgs.code).toBe('VALIDATION_ERROR');
      expect(callArgs.details).toHaveLength(2);
    });
  });

  describe('Additional: Other errors should be passed to middleware', () => {
    it('should call next() for unexpected errors', async () => {
      mockRequest.body = {
        email: 'user@example.com',
        password: 'SecurePass123',
        name: 'John Doe'
      };

      const unexpectedError = new Error('Database connection failed');
      (mockUseCase.execute as jest.Mock).mockRejectedValueOnce(unexpectedError);

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(unexpectedError);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });
});
