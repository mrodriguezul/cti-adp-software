import { IClientRepository } from '../../domain/repositories/IClientRepository.js';
import { PasswordService } from '../../infrastructure/security/PasswordService.js';
import { JwtService } from '../../infrastructure/security/JwtService.js';

export interface LoginClientInput {
  email: string;
  password: string;
}

export interface LoginClientOutput {
  token: string;
  client: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string | null;
    address: string | null;
    status: string;
  };
}

export class LoginClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(input: LoginClientInput): Promise<LoginClientOutput> {
    // Step A: Find user by email
    const user = await this.clientRepository.findByEmail(input.email);

    // Step B: If user is null, throw generic error
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Step C: Compare passwords
    const isPasswordValid = await PasswordService.comparePassword(
      input.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Step D: Generate JWT token
    const token = JwtService.generateToken({
      id: user.id,
      email: user.email,
    });

    // Step E: Return token and user data (without password)
    return {
      token,
      client: user.toJSON(),
    };
  }
}
