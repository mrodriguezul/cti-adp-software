import { IOrderRepository } from '../../domain/repositories/IOrderRepository';

export interface CreateOrderPayload {
  clientId: number;
  clientAddress: string;
  paymentToken: string;
  items: { productId: number; quantity: number }[];
}

export class CreateOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(payload: CreateOrderPayload): Promise<{ id: number; invoiceNumber: string; amount: number }> {
    // Mock payment validation
    if (!payload.paymentToken) {
      throw new Error('Payment authorization missing');
    }

    // Delegate to repository for atomic order creation
    return await this.orderRepository.createOrder(
      payload.clientId,
      payload.clientAddress,
      payload.items
    );
  }
}
