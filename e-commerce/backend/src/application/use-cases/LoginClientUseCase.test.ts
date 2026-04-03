import { LoginClientUseCase } from './LoginClientUseCase.js';
import { IClientRepository } from '../../domain/repositories/IClientRepository.js';
import { Client } from '../../domain/entities/Client.js';
import { PasswordService } from '../../infrastructure/security/PasswordService.js';
import { JwtService } from '../../infrastructure/security/JwtService.js';

jest.mock('../../infrastructure/security/PasswordService.js');
jest.mock('../../infrastructure/security/JwtService.js');

describe('LoginClientUseCase', () => {
  let useCase: LoginClientUseCase;
  let mockRepository: jest.Mocked<IClientRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepository = {
      findByEmail: jest.fn(),
      create: jest.fn()
    };

    useCase = new LoginClientUseCase(mockRepository);
  });

  describe('Test 1: Should return a token and client data on successful login', () => {
    it('should return token and user data when given valid email and correct password', async () => {
      const mockUser = new Client(
        42,
        'Miguel',
        'Smith',
        'test@test.com',
        'hashed_password_123',
        'A',
        '+61400000000',
        '123 Main St'
      );

      mockRepository.findByEmail.mockResolvedValueOnce(mockUser);
      (PasswordService.comparePassword as jest.Mock).mockResolvedValueOnce(true);
      (JwtService.generateToken as jest.Mock).mockReturnValueOnce('jwt_token_abc123');

      const result = await useCase.execute({
        email: 'test@test.com',
        password: 'password123'
      });

      expect(result.token).toBe('jwt_token_abc123');
      expect(result.client).toEqual(mockUser.toJSON());
      expect(result.client).not.toHaveProperty('password');
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(PasswordService.comparePassword).toHaveBeenCalledWith(
        'password123',
        'hashed_password_123'
      );
      expect(JwtService.generateToken).toHaveBeenCalledWith({
        id: 42,
        email: 'test@test.com'
      });
    });

    it('should include full client data in response without password', async () => {
      const mockUser = new Client(
        99,
        'Alice',
        'Johnson',
        'alice@example.com',
        'hashed_pass',
        'A',
        '+61412345678',
        '456 Oak Ave'
      );

      mockRepository.findByEmail.mockResolvedValueOnce(mockUser);
      (PasswordService.comparePassword as jest.Mock).mockResolvedValueOnce(true);
      (JwtService.generateToken as jest.Mock).mockReturnValueOnce('token_xyz');

      const result = await useCase.execute({
        email: 'alice@example.com',
        password: 'securepass'
      });

      expect(result.client).toEqual({
        id: 99,
        firstname: 'Alice',
        lastname: 'Johnson',
        email: 'alice@example.com',
        phone: '+61412345678',
        address: '456 Oak Ave',
        status: 'A'
      });
      expect(result.client).not.toHaveProperty('password');
    });

    it('should handle user without phone and address', async () => {
      const mockUser = new Client(
        50,
        'Bob',
        'Williams',
        'bob@example.com',
        'hashed_password',
        'A',
        null,
        null
      );

      mockRepository.findByEmail.mockResolvedValueOnce(mockUser);
      (PasswordService.comparePassword as jest.Mock).mockResolvedValueOnce(true);
      (JwtService.generateToken as jest.Mock).mockReturnValueOnce('token');

      const result = await useCase.execute({
        email: 'bob@example.com',
        password: 'pass123'
      });

      expect(result.client.phone).toBeNull();
      expect(result.client.address).toBeNull();
    });
  });

  describe('Test 2: Should throw generic error if user not found', () => {
    it('should throw "Invalid email or password" error when repository.findByEmail returns null', async () => {
      mockRepository.findByEmail.mockResolvedValueOnce(null);

      await expect(
        useCase.execute({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
      ).rejects.toThrow('Invalid email or password');

      expect(mockRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(PasswordService.comparePassword).not.toHaveBeenCalled();
      expect(JwtService.generateToken).not.toHaveBeenCalled();
    });

    it('should not attempt password comparison when user is null', async () => {
      mockRepository.findByEmail.mockResolvedValueOnce(null);

      try {
        await useCase.execute({
          email: 'wrong@example.com',
          password: 'anypassword'
        });
      } catch (error) {
        // Expected to throw
      }

      expect(PasswordService.comparePassword).not.toHaveBeenCalled();
    });

    it('should not generate token when user is not found', async () => {
      mockRepository.findByEmail.mockResolvedValueOnce(null);

      try {
        await useCase.execute({
          email: 'unknown@example.com',
          password: 'pass'
        });
      } catch (error) {
        // Expected to throw
      }

      expect(JwtService.generateToken).not.toHaveBeenCalled();
    });
  });

  describe('Test 3: Should throw generic error if password is incorrect', () => {
    it('should throw "Invalid email or password" error when password comparison fails', async () => {
      const mockUser = new Client(
        42,
        'John',
        'Doe',
        'john@example.com',
        'hashed_password_xyz',
        'A',
        null,
        null
      );

      mockRepository.findByEmail.mockResolvedValueOnce(mockUser);
      (PasswordService.comparePassword as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        useCase.execute({
          email: 'john@example.com',
          password: 'wrongpassword'
        })
      ).rejects.toThrow('Invalid email or password');

      expect(PasswordService.comparePassword).toHaveBeenCalledWith(
        'wrongpassword',
        'hashed_password_xyz'
      );
      expect(JwtService.generateToken).not.toHaveBeenCalled();
    });

    it('should not generate token when password is incorrect', async () => {
      const mockUser = new Client(
        1,
        'Jane',
        'Smith',
        'jane@example.com',
        'hashed_pass',
        'A',
        null,
        null
      );

      mockRepository.findByEmail.mockResolvedValueOnce(mockUser);
      (PasswordService.comparePassword as jest.Mock).mockResolvedValueOnce(false);

      try {
        await useCase.execute({
          email: 'jane@example.com',
          password: 'incorrect'
        });
      } catch (error) {
        // Expected to throw
      }

      expect(JwtService.generateToken).not.toHaveBeenCalled();
    });

    it('should throw error with same message for both not found and wrong password', async () => {
      const mockUser = new Client(
        5,
        'Test',
        'User',
        'test@example.com',
        'hashed',
        'A',
        null,
        null
      );

      // Test wrong password
      mockRepository.findByEmail.mockResolvedValueOnce(mockUser);
      (PasswordService.comparePassword as jest.Mock).mockResolvedValueOnce(false);

      let errorMessage = '';
      try {
        await useCase.execute({
          email: 'test@example.com',
          password: 'wrong'
        });
      } catch (error) {
        errorMessage = (error as Error).message;
      }

      expect(errorMessage).toBe('Invalid email or password');
    });
  });
});
