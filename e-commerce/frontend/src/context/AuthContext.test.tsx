import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import * as authService from '@/services/authService';

vi.mock('@/services/authService');

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
});
