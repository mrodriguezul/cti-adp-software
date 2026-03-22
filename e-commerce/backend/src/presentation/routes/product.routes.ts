import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaProductRepository } from '../../infrastructure/persistence/PrismaProductRepository.js';
import { GetProductsUseCase } from '../../application/use-cases/GetProductsUseCase.js';
import { ProductController } from '../controllers/ProductController.js';

export function createProductRoutes(prisma: PrismaClient): Router {
  const router = Router();

  // Dependency injection setup
  const productRepository = new PrismaProductRepository(prisma);
  const getProductsUseCase = new GetProductsUseCase(productRepository);
  const productController = new ProductController(getProductsUseCase);

  // Define routes
  router.get('/', productController.getProducts);

  return router;
}