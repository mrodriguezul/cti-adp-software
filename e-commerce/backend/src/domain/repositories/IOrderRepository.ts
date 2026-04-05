export interface IOrderRepository {
  createOrder(
    clientId: number,
    clientAddress: string,
    items: { productId: number; quantity: number }[]
  ): Promise<{ id: number; invoiceNumber: string; amount: number }>;
}
