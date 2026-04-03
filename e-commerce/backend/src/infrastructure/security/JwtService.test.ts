import jwt from 'jsonwebtoken';
import { JwtService } from './JwtService.js';

jest.mock('jsonwebtoken');

describe('JwtService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Test 1: generateToken should call jwt.sign with correct payload, secret, and expiration', () => {
    it('should call jwt.sign with correct payload and options', () => {
      const mockToken = 'mock_jwt_token_abc123';
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const payload = { id: 42, email: 'user@example.com' };
      const result = JwtService.generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        'default-secret-key-for-dev',
        { expiresIn: '24h' }
      );
      expect(result).toBe(mockToken);
    });

    it('should use JWT_SECRET environment variable when provided', () => {
      const mockToken = 'mock_jwt_token_xyz789';
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const originalEnv = process.env.JWT_SECRET;
      process.env.JWT_SECRET = 'my-custom-secret-key';

      const payload = { id: 99, email: 'test@test.com' };
      const result = JwtService.generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        'my-custom-secret-key',
        { expiresIn: '24h' }
      );
      expect(result).toBe(mockToken);

      // Restore original env
      if (originalEnv) {
        process.env.JWT_SECRET = originalEnv;
      } else {
        delete process.env.JWT_SECRET;
      }
    });

    it('should return the token string from jwt.sign', () => {
      const expectedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      (jwt.sign as jest.Mock).mockReturnValue(expectedToken);

      const payload = { id: 1, email: 'admin@example.com' };
      const result = JwtService.generateToken(payload);

      expect(result).toBe(expectedToken);
    });

    it('should set expiration to 24h in the options', () => {
      (jwt.sign as jest.Mock).mockReturnValue('token');

      const payload = { id: 5, email: 'user@example.com' };
      JwtService.generateToken(payload);

      const callArgs = (jwt.sign as jest.Mock).mock.calls[0];
      expect(callArgs[2].expiresIn).toBe('24h');
    });
  });
});
