import { z } from 'zod';
import { IClientRepository } from '../../domain/repositories/IClientRepository.js';
import { PasswordService } from '../../infrastructure/security/PasswordService.js';

// Custom error for duplicate email
export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`A client with email ${email} already exists`);
    this.name = 'DuplicateEmailError';
  }
}

// Custom error for invalid email
export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`Invalid email format: ${email}`);
    this.name = 'InvalidEmailError';
  }
}

// Input validation schema
export const RegisterClientInputSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  address: z.string().optional()
});

export type RegisterClientInput = z.infer<typeof RegisterClientInputSchema>;

export class RegisterClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(input: RegisterClientInput): Promise<{ id: number }> {
    // Step A: Validate email format using RFC 5322 regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      throw new InvalidEmailError(input.email);
    }

    // Step B: Check if client with this email already exists
    const existingClient = await this.clientRepository.findByEmail(input.email);
    if (existingClient) {
      throw new DuplicateEmailError(input.email);
    }

    // Step C: Hash the password
    const hashedPassword = await PasswordService.hashPassword(input.password);

    // Step D: Create the client
    const newClient = await this.clientRepository.create({
      firstname: input.firstname,
      lastname: input.lastname,
      email: input.email,
      password: hashedPassword,
      phone: input.phone || null,
      address: input.address || null
    });

    // Step E: Return the newly created client's id
    return {
      id: newClient.id
    };
  }
}
