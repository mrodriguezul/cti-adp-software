import { CreateOrderUseCase, CreateOrderPayload } from './CreateOrderUseCase';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let mockOrderRepository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    mockOrderRepository = {
      createOrder: jest.fn()
    };
    useCase = new CreateOrderUseCase(mockOrderRepository);
  });

  it('should throw an Error if paymentToken is missing', async () => {
    const payload: CreateOrderPayload = {
      clientId: 1,
      clientAddress: '123 Main St',
      paymentToken: '',
      items: [{ productId: 1, quantity: 2 }]
    };

    await expect(useCase.execute(payload)).rejects.toThrow('Payment authorization missing');
    expect(mockOrderRepository.createOrder).not.toHaveBeenCalled();
  });

  it('should throw an Error if paymentToken is undefined', async () => {
    const payload = {
      clientId: 1,
      clientAddress: '123 Main St',
      items: [{ productId: 1, quantity: 2 }]
    } as CreateOrderPayload;

    await expect(useCase.execute(payload)).rejects.toThrow('Payment authorization missing');
    expect(mockOrderRepository.createOrder).not.toHaveBeenCalled();
  });

  it('should call repository.createOrder with the correct payload and return the invoice on success', async () => {
    const payload: CreateOrderPayload = {
      clientId: 1,
      clientAddress: '123 Main St',
      paymentToken: 'valid-token',
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 }
      ]
    };

    const expectedResult = {
      id: 100,
      invoiceNumber: 'INV-1234567890-1',
      amount: 150.99
    };

    mockOrderRepository.createOrder.mockResolvedValue(expectedResult);

    const result = await useCase.execute(payload);

    expect(mockOrderRepository.createOrder).toHaveBeenCalledWith(
      payload.clientId,
      payload.clientAddress,
      payload.items
    );
    expect(result).toEqual(expectedResult);
  });

  it('should propagate errors from the repository', async () => {
    const payload: CreateOrderPayload = {
      clientId: 1,
      clientAddress: '123 Main St',
      paymentToken: 'valid-token',
      items: [{ productId: 1, quantity: 100 }]
    };

    const repositoryError = new Error('Insufficient stock for Product A');
    mockOrderRepository.createOrder.mockRejectedValue(repositoryError);

    await expect(useCase.execute(payload)).rejects.toThrow('Insufficient stock for Product A');
  });
});
