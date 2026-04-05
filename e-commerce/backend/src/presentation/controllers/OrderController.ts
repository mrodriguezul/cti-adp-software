import { Request, Response } from 'express';
import { CreateOrderUseCase } from '../../application/use-cases/CreateOrderUseCase';

export class OrderController {
  constructor(private createOrderUseCase: CreateOrderUseCase) {}

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = req.user?.id;
      if (!clientId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { clientAddress, paymentToken, items } = req.body;

      if (!clientAddress || !paymentToken || !items || !Array.isArray(items)) {
        res.status(400).json({ success: false, error: 'Missing required fields: clientAddress, paymentToken, items' });
        return;
      }

      const result = await this.createOrderUseCase.execute({
        clientId,
        clientAddress,
        paymentToken,
        items
      });

      res.status(201).json({
        success: true,
        data: {
          invoiceId: result.id,
          invoiceNumber: result.invoiceNumber,
          amount: result.amount
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';

      if (message.includes('Insufficient stock')) {
        res.status(400).json({ success: false, error: message });
      } else {
        res.status(500).json({ success: false, error: message });
      }
    }
  };
}
