import { Request, Response } from 'express';
import { OrderController } from './OrderController';
import { CreateOrderUseCase } from '../../application/use-cases/CreateOrderUseCase';

describe('OrderController - createOrder', () => {
  let controller: OrderController;
  let mockUseCase: jest.Mocked<CreateOrderUseCase>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<CreateOrderUseCase>;

    controller = new OrderController(mockUseCase);

    req = {
      user: { id: 1 },
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  it('should return 201 Created with invoice data on successful order creation', async () => {
    req.body = {
      clientAddress: '123 Main St',
      paymentToken: 'valid-token',
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 }
      ]
    };

    const mockResult = {
      id: 100,
      invoiceNumber: 'INV-1234567890-1',
      amount: 150.99
    };

    (mockUseCase.execute as jest.Mock).mockResolvedValue(mockResult);

    await controller.createOrder(req as Request, res as Response);

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      clientId: 1,
      clientAddress: req.body.clientAddress,
      paymentToken: req.body.paymentToken,
      items: req.body.items
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        invoiceId: mockResult.id,
        invoiceNumber: mockResult.invoiceNumber,
        amount: mockResult.amount
      }
    });
  });

  it('should return 400 Bad Request if required fields are missing', async () => {
    req.body = {
      clientAddress: '123 Main St'
      // missing paymentToken and items
    };

    await controller.createOrder(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Missing required fields: clientAddress, paymentToken, items'
    });
    expect(mockUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 Bad Request if items is not an array', async () => {
    req.body = {
      clientAddress: '123 Main St',
      paymentToken: 'valid-token',
      items: 'invalid'
    };

    await controller.createOrder(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Missing required fields: clientAddress, paymentToken, items'
    });
    expect(mockUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 401 if req.user is not set', async () => {
    req.user = undefined;
    req.body = {
      clientAddress: '123 Main St',
      paymentToken: 'valid-token',
      items: [{ productId: 1, quantity: 1 }]
    };

    await controller.createOrder(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Unauthorized'
    });
    expect(mockUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 Bad Request for insufficient stock error', async () => {
    req.body = {
      clientAddress: '123 Main St',
      paymentToken: 'valid-token',
      items: [{ productId: 1, quantity: 100 }]
    };

    const stockError = new Error('Insufficient stock for Product A');
    (mockUseCase.execute as jest.Mock).mockRejectedValue(stockError);

    await controller.createOrder(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Insufficient stock for Product A'
    });
  });

  it('should return 500 Server Error if use case throws a non-stock, non-payment error', async () => {
    req.body = {
      clientAddress: '123 Main St',
      paymentToken: 'valid-token',
      items: [{ productId: 1, quantity: 1 }]
    };

    const unexpectedError = new Error('Unexpected validation error');
    (mockUseCase.execute as jest.Mock).mockRejectedValue(unexpectedError);

    await controller.createOrder(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Unexpected validation error'
    });
  });

  it('should return 500 Server Error for unexpected repository failures', async () => {
    req.body = {
      clientAddress: '123 Main St',
      paymentToken: 'valid-token',
      items: [{ productId: 1, quantity: 1 }]
    };

    const repositoryError = new Error('Database connection failed');
    (mockUseCase.execute as jest.Mock).mockRejectedValue(repositoryError);

    await controller.createOrder(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Database connection failed'
    });
  });

  it('should handle non-Error exceptions gracefully', async () => {
    req.body = {
      clientAddress: '123 Main St',
      paymentToken: 'valid-token',
      items: [{ productId: 1, quantity: 1 }]
    };

    (mockUseCase.execute as jest.Mock).mockRejectedValue('Unknown error');

    await controller.createOrder(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Internal server error'
    });
  });
});
