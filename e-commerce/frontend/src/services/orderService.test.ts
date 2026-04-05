import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createOrder, CreateOrderPayload, OrderResponse } from './orderService';

describe('orderService', () => {
  const mockToken = 'test-jwt-token-12345';

  beforeEach(() => {
    // Mock localStorage
    localStorage.setItem('lpa_auth', JSON.stringify({ token: mockToken }));
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should successfully POST to /api/orders with correct headers and body', async () => {
      const mockPayload: CreateOrderPayload = {
        clientAddress: '123 Main St, New York, NY, 10001, USA',
        paymentToken: 'mock_cc_123456',
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      };

      const mockResponse: OrderResponse = {
        success: true,
        data: {
          invoiceId: 999,
          invoiceNumber: 'INV-20260405-001',
          amount: 150.0,
        },
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await createOrder(mockPayload);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/api/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
          },
          body: JSON.stringify(mockPayload),
        }
      );
    });

    it('should throw an error if response is not ok', async () => {
      const mockPayload: CreateOrderPayload = {
        clientAddress: '123 Main St, New York, NY, 10001, USA',
        paymentToken: 'mock_cc_123456',
        items: [{ productId: 1, quantity: 2 }],
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Insufficient stock' }),
      });

      await expect(createOrder(mockPayload)).rejects.toThrow('Insufficient stock');
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should throw an error if localStorage has no auth data', async () => {
      localStorage.clear();

      const mockPayload: CreateOrderPayload = {
        clientAddress: '123 Main St',
        paymentToken: 'mock_token',
        items: [{ productId: 1, quantity: 1 }],
      };

      await expect(createOrder(mockPayload)).rejects.toThrow(
        'Authentication required. Please log in.'
      );
    });

    it('should throw error with default message if response JSON is invalid', async () => {
      const mockPayload: CreateOrderPayload = {
        clientAddress: '123 Main St',
        paymentToken: 'mock_token',
        items: [{ productId: 1, quantity: 1 }],
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(createOrder(mockPayload)).rejects.toThrow(
        'Failed to create order'
      );
    });
  });
});
