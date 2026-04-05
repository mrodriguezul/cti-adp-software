import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaOrderRepository } from '../../infrastructure/persistence/PrismaOrderRepository.js';
import { CreateOrderUseCase } from '../../application/use-cases/CreateOrderUseCase.js';
import { OrderController } from '../controllers/OrderController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export function createOrderRoutes(prisma: PrismaClient): Router {
  const router = Router();

  // Dependency injection setup
  const orderRepository = new PrismaOrderRepository(prisma);
  const createOrderUseCase = new CreateOrderUseCase(orderRepository);
  const orderController = new OrderController(createOrderUseCase);

  // Define routes
  router.post('/', requireAuth, orderController.createOrder);

  return router;
}
