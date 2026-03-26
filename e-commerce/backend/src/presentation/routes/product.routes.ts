import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaProductRepository } from '../../infrastructure/persistence/PrismaProductRepository.js';
import { GetProductsUseCase } from '../../application/use-cases/GetProductsUseCase.js';
import { GetProductByIdUseCase } from '../../application/use-cases/GetProductByIdUseCase.js';
import { ProductController } from '../controllers/ProductController.js';

export function createProductRoutes(prisma: PrismaClient): Router {
  const router = Router();

  // Dependency injection setup
  const productRepository = new PrismaProductRepository(prisma);
  const getProductsUseCase = new GetProductsUseCase(productRepository);
  const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
  const productController = new ProductController(getProductsUseCase, getProductByIdUseCase);

  // Define routes
  router.get('/', productController.getProducts);
  router.get('/:id', productController.getProductById);

  return router;
}