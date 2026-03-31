import {
  RegisterClientUseCase,
  DuplicateEmailError,
  InvalidEmailError
} from './RegisterClientUseCase.js';
import { IClientRepository } from '../../domain/repositories/IClientRepository.js';
import { Client } from '../../domain/entities/Client.js';
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
        firstname: 'Miguel',
        lastname: 'Smith',
        email: 'test@test.com',
        password: 'password123',
        phone: '+61400000000',
        address: '123 Main St'
      };

      const mockClient = new Client(
        42,
        'Miguel',
        'Smith',
        'test@test.com',
        'hashed_password_123',
        'A',
        '+61400000000',
        '123 Main St'
      );

      mockRepository.findByEmail.mockResolvedValueOnce(null);
      mockRepository.create.mockResolvedValueOnce(mockClient);

      const result = await useCase.execute(input);

      expect(result).toEqual({ id: 42 });
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(mockRepository.create).toHaveBeenCalledWith({
        firstname: 'Miguel',
        lastname: 'Smith',
        email: 'test@test.com',
        password: 'hashed_password_123',
        phone: '+61400000000',
        address: '123 Main St'
      });
      expect(PasswordService.hashPassword).toHaveBeenCalledWith('password123');
    });

    it('should handle registration without phone number', async () => {
      const input = {
        firstname: 'Alice',
        lastname: 'Johnson',
        email: 'alice@example.com',
        password: 'SecurePass123',
        address: '456 Oak Ave'
      };

      const mockClient = new Client(
        100,
        'Alice',
        'Johnson',
        'alice@example.com',
        'hashed_password_123',
        'A',
        null,
        '456 Oak Ave'
      );

      mockRepository.findByEmail.mockResolvedValueOnce(null);
      mockRepository.create.mockResolvedValueOnce(mockClient);

      const result = await useCase.execute(input);

      expect(result).toEqual({ id: 100 });
      expect(mockRepository.create).toHaveBeenCalledWith({
        firstname: 'Alice',
        lastname: 'Johnson',
        email: 'alice@example.com',
        password: 'hashed_password_123',
        phone: null,
        address: '456 Oak Ave'
      });
    });

    it('should handle registration without address', async () => {
      const input = {
        firstname: 'Bob',
        lastname: 'Williams',
        email: 'bob@example.com',
        password: 'SecurePass123',
        phone: '+61412345678'
      };

      const mockClient = new Client(
        50,
        'Bob',
        'Williams',
        'bob@example.com',
        'hashed_password_123',
        'A',
        '+61412345678',
        null
      );

      mockRepository.findByEmail.mockResolvedValueOnce(null);
      mockRepository.create.mockResolvedValueOnce(mockClient);

      await useCase.execute(input);

      expect(mockRepository.create).toHaveBeenCalledWith({
        firstname: 'Bob',
        lastname: 'Williams',
        email: 'bob@example.com',
        password: 'hashed_password_123',
        phone: '+61412345678',
        address: null
      });
    });
  });

  describe('Test 2: Throw error if email format is invalid', () => {
    it('should throw InvalidEmailError for email without @', async () => {
      const input = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'invalidemail.com',
        password: 'SecurePass123',
        address: '789 Pine Rd'
      };

      await expect(useCase.execute(input)).rejects.toThrow(InvalidEmailError);
      expect(mockRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InvalidEmailError for email without domain', async () => {
      const input = {
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'user@',
        password: 'SecurePass123',
        address: '321 Elm St'
      };

      await expect(useCase.execute(input)).rejects.toThrow(InvalidEmailError);
    });

    it('should throw InvalidEmailError for email without TLD', async () => {
      const input = {
        firstname: 'Mark',
        lastname: 'Brown',
        email: 'user@domain',
        password: 'SecurePass123',
        address: '654 Maple Dr'
      };

      await expect(useCase.execute(input)).rejects.toThrow(InvalidEmailError);
    });

    it('should throw InvalidEmailError for email with spaces', async () => {
      const input = {
        firstname: 'Sarah',
        lastname: 'Green',
        email: 'user @domain.com',
        password: 'SecurePass123',
        address: '987 Birch Ln'
      };

      await expect(useCase.execute(input)).rejects.toThrow(InvalidEmailError);
    });
  });

  describe('Test 3: Throw conflict error if repository.findByEmail returns existing user', () => {
    it('should throw DuplicateEmailError when client already exists', async () => {
      const input = {
        firstname: 'David',
        lastname: 'Jones',
        email: 'existing@example.com',
        password: 'SecurePass123',
        address: '147 Cedar St'
      };

      const existingClient = new Client(
        1,
        'Existing',
        'User',
        'existing@example.com',
        'some_hash',
        'A',
        null,
        '999 Old St'
      );

      mockRepository.findByEmail.mockResolvedValueOnce(existingClient);

      await expect(useCase.execute(input)).rejects.toThrow(DuplicateEmailError);
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(PasswordService.hashPassword).not.toHaveBeenCalled();
    });

    it('should throw DuplicateEmailError with correct email in message', async () => {
      const email = 'duplicate@example.com';
      const input = {
        firstname: 'Emma',
        lastname: 'White',
        email,
        password: 'SecurePass123',
        address: '555 Rock Ave'
      };

      const existingClient = new Client(
        1,
        'Test',
        'User',
        email,
        'hash',
        'A',
        null,
        '111 Test Blvd'
      );

      mockRepository.findByEmail.mockResolvedValueOnce(existingClient);

      await expect(useCase.execute(input)).rejects.toThrow(
        `A client with email ${email} already exists`
      );
    });
  });
});
