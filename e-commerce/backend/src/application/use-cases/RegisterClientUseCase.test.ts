import {
  RegisterClientUseCase,
  DuplicateEmailError,
  InvalidEmailError
} from './RegisterClientUseCase.js';
import { IClientRepository, Client } from '../../domain/repositories/IClientRepository.js';
import { PasswordService } from '../../infrastructure/security/PasswordService.js';

jest.mock('../../infrastructure/security/PasswordService.js');

describe('RegisterClientUseCase', () => {
  let useCase: RegisterClientUseCase;
  let mockRepository: jest.Mocked<IClientRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepository = {
      findByEmail: jest.fn(),
      create: jest.fn()
    };

    (PasswordService.hashPassword as jest.Mock).mockResolvedValue('hashed_password_123');
    useCase = new RegisterClientUseCase(mockRepository);
  });

  describe('Test 1: Successfully register a user and return an ID with valid data', () => {
    it('should create a new client and return the ID', async () => {
      const input = {
        email: 'john.doe@example.com',
        password: 'SecurePass123',
        name: 'John Doe',
        phone: '1234567890'
      };

      const mockClient: Client = {
        id: 42,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        password: 'hashed_password_123',
        status: 'A',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepository.findByEmail.mockResolvedValueOnce(null);
      mockRepository.create.mockResolvedValueOnce(mockClient);

      const result = await useCase.execute(input);

      expect(result).toEqual({ id: 42 });
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
      expect(mockRepository.create).toHaveBeenCalledWith({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashed_password_123',
        phone: '1234567890'
      });
      expect(PasswordService.hashPassword).toHaveBeenCalledWith('SecurePass123');
    });

    it('should handle single word names by splitting correctly', async () => {
      const input = {
        email: 'alice@example.com',
        password: 'SecurePass123',
        name: 'Alice'
      };

      const mockClient: Client = {
        id: 100,
        firstname: 'Alice',
        lastname: 'Alice',
        email: 'alice@example.com',
        phone: null,
        password: 'hashed_password_123',
        status: 'A',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepository.findByEmail.mockResolvedValueOnce(null);
      mockRepository.create.mockResolvedValueOnce(mockClient);

      const result = await useCase.execute(input);

      expect(result).toEqual({ id: 100 });
      expect(mockRepository.create).toHaveBeenCalledWith({
        firstname: 'Alice',
        lastname: 'Alice',
        email: 'alice@example.com',
        password: 'hashed_password_123',
        phone: null
      });
    });

    it('should handle multi-word names correctly', async () => {
      const input = {
        email: 'maria@example.com',
        password: 'SecurePass123',
        name: 'Maria Garcia Lopez',
        phone: '5555555'
      };

      const mockClient: Client = {
        id: 50,
        firstname: 'Maria',
        lastname: 'Garcia Lopez',
        email: 'maria@example.com',
        phone: '5555555',
        password: 'hashed_password_123',
        status: 'A',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepository.findByEmail.mockResolvedValueOnce(null);
      mockRepository.create.mockResolvedValueOnce(mockClient);

      await useCase.execute(input);

      expect(mockRepository.create).toHaveBeenCalledWith({
        firstname: 'Maria',
        lastname: 'Garcia Lopez',
        email: 'maria@example.com',
        password: 'hashed_password_123',
        phone: '5555555'
      });
    });
  });

  describe('Test 2: Throw error if email format is invalid', () => {
    it('should throw InvalidEmailError for email without @', async () => {
      const input = {
        email: 'invalidemail.com',
        password: 'SecurePass123',
        name: 'John Doe'
      };

      await expect(useCase.execute(input)).rejects.toThrow(InvalidEmailError);
      expect(mockRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InvalidEmailError for email without domain', async () => {
      const input = {
        email: 'user@',
        password: 'SecurePass123',
        name: 'John Doe'
      };

      await expect(useCase.execute(input)).rejects.toThrow(InvalidEmailError);
    });

    it('should throw InvalidEmailError for email without TLD', async () => {
      const input = {
        email: 'user@domain',
        password: 'SecurePass123',
        name: 'John Doe'
      };

      await expect(useCase.execute(input)).rejects.toThrow(InvalidEmailError);
    });

    it('should throw InvalidEmailError for email with spaces', async () => {
      const input = {
        email: 'user @domain.com',
        password: 'SecurePass123',
        name: 'John Doe'
      };

      await expect(useCase.execute(input)).rejects.toThrow(InvalidEmailError);
    });
  });

  describe('Test 3: Throw conflict error if repository.findByEmail returns existing user', () => {
    it('should throw DuplicateEmailError when client already exists', async () => {
      const input = {
        email: 'existing@example.com',
        password: 'SecurePass123',
        name: 'John Doe'
      };

      const existingClient: Client = {
        id: 1,
        firstname: 'Existing',
        lastname: 'User',
        email: 'existing@example.com',
        phone: null,
        password: 'some_hash',
        status: 'A',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepository.findByEmail.mockResolvedValueOnce(existingClient);

      await expect(useCase.execute(input)).rejects.toThrow(DuplicateEmailError);
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(PasswordService.hashPassword).not.toHaveBeenCalled();
    });

    it('should throw DuplicateEmailError with correct email in message', async () => {
      const email = 'duplicate@example.com';
      const input = {
        email,
        password: 'SecurePass123',
        name: 'John Doe'
      };

      mockRepository.findByEmail.mockResolvedValueOnce({
        id: 1,
        firstname: 'Test',
        lastname: 'User',
        email,
        phone: null,
        password: 'hash',
        status: 'A',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await expect(useCase.execute(input)).rejects.toThrow(
        `A client with email ${email} already exists`
      );
    });
  });
});
