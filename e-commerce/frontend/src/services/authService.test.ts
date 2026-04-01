import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerUser } from '@/services/authService';

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
});
