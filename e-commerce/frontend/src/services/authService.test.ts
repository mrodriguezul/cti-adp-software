import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerUser, loginUser } from '@/services/authService';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('registerUser', () => {
    it('should call fetch with correct POST request parameters', async () => {
      const mockFetch = global.fetch as any;
      mockFetch.mockResolvedValueOnce({ ok: true });

      const data = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '555-1234',
        address: '123 Main St',
      };

      await registerUser(data);

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.mock.calls[0];

      expect(url).toContain('/auth/register');
      expect(options.method).toBe('POST');
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(JSON.parse(options.body)).toEqual(data);
    });

    it('should throw an Error with message from failed response', async () => {
      const mockFetch = global.fetch as any;
      const errorMessage = 'Email already exists';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: errorMessage }),
      });

      const data = {
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '',
        address: '',
      };

      await expect(registerUser(data)).rejects.toThrow(errorMessage);
    });

    it('should use default error message if response does not contain error.error', async () => {
      const mockFetch = global.fetch as any;

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      const data = {
        firstname: 'Bob',
        lastname: 'Johnson',
        email: 'bob@example.com',
        password: 'password123',
        phone: '',
        address: '',
      };

      await expect(registerUser(data)).rejects.toThrow('Registration failed');
    });
  });

  describe('loginUser', () => {
    it('should call fetch with correct POST request parameters', async () => {
      const mockFetch = global.fetch as any;
      const mockClient = { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com', phone: '555-1234', address: '123 Main St' };
      const mockToken = 'test-token-123';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { token: mockToken, client: mockClient } }),
      });

      const email = 'john@example.com';
      const password = 'password123';

      await loginUser(email, password);

      expect(mockFetch).toHaveBeenCalledOnce();
      const [url, options] = mockFetch.mock.calls[0];

      expect(url).toContain('/auth/login');
      expect(options.method).toBe('POST');
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(JSON.parse(options.body)).toEqual({ email, password });
    });

    it('should return unwrapped data object (token and client)', async () => {
      const mockFetch = global.fetch as any;
      const mockClient = { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com', phone: '555-1234', address: '123 Main St' };
      const mockToken = 'test-token-123';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { token: mockToken, client: mockClient } }),
      });

      const result = await loginUser('john@example.com', 'password123');

      expect(result).toEqual({ token: mockToken, client: mockClient });
      expect(result.token).toBe(mockToken);
      expect(result.client).toBe(mockClient);
    });

    it('should throw an Error with message from failed response', async () => {
      const mockFetch = global.fetch as any;
      const errorMessage = 'Invalid credentials';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: errorMessage }),
      });

      await expect(loginUser('john@example.com', 'wrong-password')).rejects.toThrow(errorMessage);
    });

    it('should use default error message if response does not contain error.error', async () => {
      const mockFetch = global.fetch as any;

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(loginUser('john@example.com', 'password123')).rejects.toThrow('Login failed');
    });
  });
});
