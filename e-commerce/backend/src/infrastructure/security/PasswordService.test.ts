import { describe, expect, it } from '@jest/globals';
import { PasswordService } from './PasswordService';

describe('PasswordService', () => {
  describe('hashPassword', () => {
    it('should return a valid string that is different from the plain text password', async () => {
      // Arrange
      const plainPassword = 'MySecurePassword123!';

      // Act
      const hashedPassword = await PasswordService.hashPassword(plainPassword);

      // Assert
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.length).toBeGreaterThan(plainPassword.length);
    });
  });

  describe('comparePassword', () => {
    it('should return true when given the correct plain text password and its corresponding hash', async () => {
      // Arrange
      const plainPassword = 'MySecurePassword123!';
      const hashedPassword = await PasswordService.hashPassword(plainPassword);

      // Act
      const result = await PasswordService.comparePassword(plainPassword, hashedPassword);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when given an incorrect plain text password against a valid hash', async () => {
      // Arrange
      const plainPassword = 'MySecurePassword123!';
      const wrongPassword = 'WrongPassword456';
      const hashedPassword = await PasswordService.hashPassword(plainPassword);

      // Act
      const result = await PasswordService.comparePassword(wrongPassword, hashedPassword);

      // Assert
      expect(result).toBe(false);
    });
  });
});

