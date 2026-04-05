import { PrismaClient } from '@prisma/client';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async createOrder(
    clientId: number,
    clientAddress: string,
    items: { productId: number; quantity: number }[]
  ): Promise<{ id: number; invoiceNumber: string; amount: number }> {
    return await this.prisma.$transaction(async (tx) => {
      // Step A: Fetch and snapshot client data
      const client = await tx.client.findUnique({
        where: { id: clientId }
      });

      if (!client) {
        throw new Error('Client not found');
      }

      const clientName = `${client.firstname} ${client.lastname}`;

      // Step B, C, D, E: Verify stock and calculate totals
      let totalAmount = 0;
      const invoiceItemsData: { stockId: number; stockName: string; price: number; quantity: number; subtotal: number }[] = [];

      for (const item of items) {
        const stock = await tx.stock.findUnique({
          where: { id: item.productId }
        });

        if (!stock) {
          throw new Error(`Product not found (ID: ${item.productId})`);
        }

        // Step C: Validate stock availability
        if (stock.onhand < item.quantity) {
          throw new Error(`Insufficient stock for ${stock.name}`);
        }

        // Step D: Deduct stock
        await tx.stock.update({
          where: { id: item.productId },
          data: { onhand: { decrement: item.quantity } }
        });

        // Step E: Calculate subtotal
        const subtotal = stock.price.toNumber() * item.quantity;
        totalAmount += subtotal;

        invoiceItemsData.push({
          stockId: item.productId,
          stockName: stock.name,
          price: stock.price.toNumber(),
          quantity: item.quantity,
          subtotal
        });
      }

      // Step F: Generate invoice number
      const invoiceNumber = `INV-${Date.now()}-${clientId}`;

      // Step G: Create invoice with nested items
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          clientId,
          clientName,
          clientAddress,
          amount: totalAmount,
          status: 'U',
          items: {
            create: invoiceItemsData.map((item) => ({
              stockId: item.stockId,
              stockName: item.stockName,
              price: item.price,
              quantity: item.quantity,
              subtotal: item.subtotal
            }))
          }
        }
      });

      return {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount.toNumber()
      };
    });
  }
}
