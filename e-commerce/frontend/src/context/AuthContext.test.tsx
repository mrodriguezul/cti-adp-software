import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import * as authService from '@/services/authService';

vi.mock('@/services/authService');
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

function TestRegisterButton() {
  const { register } = useAuth();
  return (
    <button
      onClick={() =>
        register({
          firstname: 'Test',
          lastname: 'User',
          email: 'test@example.com',
          password: 'pass123',
          phone: '',
          address: '',
        })
      }
    >
      Register
    </button>
  );
}

function TestLoginButton() {
  const { login } = useAuth();
  return (
    <button
      onClick={() => login('john@example.com', 'password123')}
    >
      Login
    </button>
  );
}

function AuthConsumer() {
  const { user, isAuthenticated } = useAuth();
  return <div>{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should call authService.registerUser when register is called', async () => {
    const mockRegisterUser = vi.fn().mockResolvedValue(undefined);
    vi.mocked(authService.registerUser).mockImplementation(mockRegisterUser);

    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestRegisterButton />
      </AuthProvider>
    );

    const button = screen.getByRole('button', { name: /register/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledOnce();
      expect(mockRegisterUser).toHaveBeenCalledWith({
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        password: 'pass123',
        phone: '',
        address: '',
      });
    });
  });

  it('should NOT persist user state after registration', async () => {
    vi.mocked(authService.registerUser).mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestRegisterButton />
        <AuthConsumer />
      </AuthProvider>
    );

    const registerButton = screen.getByRole('button', { name: /register/i });
    await user.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText('Not Authenticated')).toBeInTheDocument();
      expect(localStorage.getItem('lpa_auth')).toBeNull();
    });
  });

  describe('login', () => {
    it('should call authService.loginUser with email and password', async () => {
      const mockLoginUser = vi.fn().mockResolvedValue({
        token: 'test-token',
        client: { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com', phone: '', address: '' },
      });
      vi.mocked(authService.loginUser).mockImplementation(mockLoginUser);

      const user = userEvent.setup();
      render(
        <AuthProvider>
          <TestLoginButton />
        </AuthProvider>
      );

      const button = screen.getByRole('button', { name: /login/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledOnce();
        expect(mockLoginUser).toHaveBeenCalledWith('john@example.com', 'password123');
      });
    });

    it('should persist user state after successful login', async () => {
      const mockClient = { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com', phone: '', address: '' };
      const mockToken = 'test-token-123';

      vi.mocked(authService.loginUser).mockResolvedValue({
        token: mockToken,
        client: mockClient,
      });

      const user = userEvent.setup();
      render(
        <AuthProvider>
          <TestLoginButton />
          <AuthConsumer />
        </AuthProvider>
      );

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Authenticated')).toBeInTheDocument();
        const stored = localStorage.getItem('lpa_auth');
        expect(stored).not.toBeNull();
        const parsedAuth = JSON.parse(stored!);
        expect(parsedAuth.token).toBe(mockToken);
        expect(parsedAuth.client).toEqual(mockClient);
      });
    });
  });
});
