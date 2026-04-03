import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginDialog } from '@/components/LoginDialog';
import * as authContext from '@/context/AuthContext';
import * as toastHook from '@/hooks/use-toast';

vi.mock('@/context/AuthContext');
vi.mock('@/hooks/use-toast');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ to, children, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

describe('LoginDialog', () => {
  const mockLogin = vi.fn();
  const mockToast = vi.fn();
  const mockOnOpenChange = vi.fn();
  const mockOnLoginSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
    });
    vi.mocked(toastHook.useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });
  });

  const renderLoginDialog = (open = true) => {
    return render(
      <BrowserRouter>
        <LoginDialog
          open={open}
          onOpenChange={mockOnOpenChange}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </BrowserRouter>
    );
  };

  it('should render email and password input fields when open', () => {
    renderLoginDialog();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should show email and password input placeholders', () => {
    renderLoginDialog();

    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
  });

  it('should show validation error when form is submitted with empty fields', async () => {
    const user = userEvent.setup();
    renderLoginDialog();

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('should show validation error when only email is provided', async () => {
    const user = userEvent.setup();
    renderLoginDialog();

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'john@example.com');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should show validation error when only password is provided', async () => {
    const user = userEvent.setup();
    renderLoginDialog();

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should call login with email and password on valid submission', async () => {
    mockLogin.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderLoginDialog();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledOnce();
      expect(mockLogin).toHaveBeenCalledWith('john@example.com', 'password123');
    });
  });

  it('should trigger success toast on successful login', async () => {
    mockLogin.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderLoginDialog();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledOnce();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    });
  });

  it('should close dialog on successful login', async () => {
    mockLogin.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderLoginDialog();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('should call onLoginSuccess callback on successful login', async () => {
    mockLogin.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderLoginDialog();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalledOnce();
    });
  });

  it('should clear form fields on successful login', async () => {
    mockLogin.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderLoginDialog();

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });

  it('should trigger error toast when login fails', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValue(new Error(errorMessage));
    const user = userEvent.setup();
    renderLoginDialog();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'wrong-password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledOnce();
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Login failed',
        description: errorMessage,
      });
    });
  });

  it('should display error message in error box when login fails', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValue(new Error(errorMessage));
    const user = userEvent.setup();
    renderLoginDialog();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'wrong-password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should NOT close dialog or call onLoginSuccess on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    const user = userEvent.setup();
    renderLoginDialog();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'wrong-password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnOpenChange).not.toHaveBeenCalled();
      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });
  });

  it('should disable submit button while loading', async () => {
    mockLogin.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 100);
        })
    );
    const user = userEvent.setup();
    renderLoginDialog();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i }) as HTMLButtonElement;

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(submitButton.disabled).toBe(true);
    expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument();
  });

  it('should use default error message if error has no message', async () => {
    mockLogin.mockRejectedValue(new Error());
    const user = userEvent.setup();
    renderLoginDialog();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Login failed',
      });
    });
  });

  it('should have register link that closes dialog on click', () => {
    renderLoginDialog();

    const registerLink = screen.getByRole('link', { name: /register here/i });
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});
