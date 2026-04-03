import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaClientRepository } from '../../infrastructure/persistence/PrismaClientRepository.js';
import { RegisterClientUseCase } from '../../application/use-cases/RegisterClientUseCase.js';
import { LoginClientUseCase } from '../../application/use-cases/LoginClientUseCase.js';
import { AuthController } from '../controllers/AuthController.js';

export function createAuthRoutes(prisma: PrismaClient): Router {
  const router = Router();

  // Dependency injection setup
  const clientRepository = new PrismaClientRepository(prisma);
  const registerClientUseCase = new RegisterClientUseCase(clientRepository);
  const loginClientUseCase = new LoginClientUseCase(clientRepository);
  const authController = new AuthController(registerClientUseCase, loginClientUseCase);

  // Define routes
  router.post('/register', authController.register);
  router.post('/login', authController.login);

  return router;
}

