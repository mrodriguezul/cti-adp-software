import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const PasswordService = {
  /**
   * Hashes a password using bcrypt with 12 salt rounds
   * @param password - The plain text password to hash
   * @returns A promise that resolves to the hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  /**
   * Compares a plain text password against a bcrypt hash
   * @param password - The plain text password to verify
   * @param hash - The bcrypt hash to compare against
   * @returns A promise that resolves to true if the password matches, false otherwise
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
};
