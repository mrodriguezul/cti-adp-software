import jwt from 'jsonwebtoken';

export const JwtService = {
  /**
   * Generates a JWT token with the provided payload
   * @param payload - The payload containing id and email
   * @returns The signed JWT token as a string
   */
  generateToken(payload: { id: number; email: string }): string {
    const secret = process.env.JWT_SECRET || 'default-secret-key-for-dev';
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  },
};
