import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { requireAuth } from './authMiddleware';

jest.mock('jsonwebtoken');

describe('authMiddleware - requireAuth', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      headers: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  it('should call next() and attach req.user if a valid Bearer token is provided', () => {
    const payload = { id: 123, email: 'test@example.com' };
    req.headers = { authorization: 'Bearer valid-token' };

    (jwt.verify as jest.Mock).mockReturnValue(payload);
    process.env.JWT_SECRET = 'test-secret';

    requireAuth(req as Request, res as Response, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 Unauthorized if no authorization header is provided', () => {
    req.headers = {};

    requireAuth(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Unauthorized: Missing or invalid token'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 Unauthorized if Bearer prefix is missing', () => {
    req.headers = { authorization: 'invalid-token' };

    requireAuth(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Unauthorized: Missing or invalid token'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 Unauthorized if the token is invalid or expired', () => {
    req.headers = { authorization: 'Bearer expired-token' };
    const tokenError = new Error('Token expired');

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw tokenError;
    });
    process.env.JWT_SECRET = 'test-secret';

    requireAuth(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Unauthorized: Invalid token'
    });
    expect(next).not.toHaveBeenCalled();
  });
});
