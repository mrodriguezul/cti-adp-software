import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CheckoutComplete from './CheckoutComplete';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
  };
});

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Import mocked functions
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const mockNavigate = vi.fn();
const mockUseLocation = useLocation as any;
const mockUseNavigate = useNavigate as any;
const mockUseAuth = useAuth as any;

describe('CheckoutComplete Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    // Setup useNavigate to return our mock function
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  describe('Redirect Behavior', () => {
    it('should redirect to home when no invoice data is provided (direct access)', async () => {
      // Mock location with no state
      mockUseLocation.mockReturnValue({ state: null });
      mockUseNavigate.mockReturnValue(mockNavigate);
      mockUseAuth.mockReturnValue({ isAuthenticated: false });

      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      // Wait for useEffect to execute and call navigate
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should redirect to home when invoice is undefined', async () => {
      mockUseLocation.mockReturnValue({ state: { invoice: undefined } });
      mockUseNavigate.mockReturnValue(mockNavigate);
      mockUseAuth.mockReturnValue({ isAuthenticated: false });

      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('Valid Order Rendering - Guest User', () => {
    beforeEach(() => {
      const mockInvoice = {
        invoiceId: 1,
        invoiceNumber: 'INV-20260405-001',
        amount: 199.99,
      };

      mockUseLocation.mockReturnValue({
        state: { invoice: mockInvoice },
      });
      mockUseNavigate.mockReturnValue(mockNavigate);
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      });
    });

    it('should display order confirmed heading', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByText('Order Confirmed!')).toBeInTheDocument();
    });

    it('should display the invoice number prominently', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByText('INV-20260405-001')).toBeInTheDocument();
    });

    it('should display the total amount formatted as currency', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByText('$199.99')).toBeInTheDocument();
    });

    it('should display estimated delivery time', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByText('7 business days')).toBeInTheDocument();
    });

    it('should display "Continue Shopping" button', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByRole('button', { name: /Continue Shopping/i })).toBeInTheDocument();
    });

    it('should not display "View Order History" button for guest users', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.queryByRole('link', { name: /View Order History/i })).not.toBeInTheDocument();
    });

    it('should display Order ID label', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByText('Order ID')).toBeInTheDocument();
    });

    it('should display Total Amount label', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByText('Total Amount')).toBeInTheDocument();
    });

    it('should display Estimated Delivery label', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByText('Estimated Delivery')).toBeInTheDocument();
    });
  });

  describe('Valid Order Rendering - Authenticated User', () => {
    beforeEach(() => {
      const mockInvoice = {
        invoiceId: 2,
        invoiceNumber: 'INV-20260405-002',
        amount: 349.50,
      };

      mockUseLocation.mockReturnValue({
        state: { invoice: mockInvoice },
      });
      mockUseNavigate.mockReturnValue(mockNavigate);
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: {
          client: {
            id: 1,
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
            phone: '555-1234',
            address: '123 Main St',
          },
          token: 'mock-jwt-token',
        },
      });
    });

    it('should display "View Order History" link for authenticated users', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByRole('link', { name: /View Order History/i })).toBeInTheDocument();
    });

    it('should link "View Order History" to /profile/orders', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      const link = screen.getByRole('link', { name: /View Order History/i });
      expect(link).toHaveAttribute('href', '/profile/orders');
    });

    it('should still display "Continue Shopping" button for authenticated users', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByRole('button', { name: /Continue Shopping/i })).toBeInTheDocument();
    });

    it('should display authenticated user order details', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByText('INV-20260405-002')).toBeInTheDocument();
      expect(screen.getByText('$349.50')).toBeInTheDocument();
      expect(screen.getByText('7 business days')).toBeInTheDocument();
    });
  });

  describe('Navigation Interaction', () => {
    beforeEach(() => {
      const mockInvoice = {
        invoiceId: 3,
        invoiceNumber: 'INV-20260405-003',
        amount: 75.00,
      };

      mockUseLocation.mockReturnValue({
        state: { invoice: mockInvoice },
      });
      mockUseNavigate.mockReturnValue(mockNavigate);
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: {
          client: {
            id: 1,
            firstname: 'Jane',
            lastname: 'Smith',
            email: 'jane@example.com',
            phone: '555-5678',
            address: '456 Oak Ave',
          },
          token: 'mock-jwt-token',
        },
      });
    });

    it('should navigate to /products when "Continue Shopping" button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      const continueShoppingButton = screen.getByRole('button', { name: /Continue Shopping/i });
      await user.click(continueShoppingButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/products');
      });
    });
  });

  describe('Content & Messaging', () => {
    beforeEach(() => {
      const mockInvoice = {
        invoiceId: 4,
        invoiceNumber: 'INV-20260405-004',
        amount: 250.00,
      };

      mockUseLocation.mockReturnValue({
        state: { invoice: mockInvoice },
      });
      mockUseNavigate.mockReturnValue(mockNavigate);
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      });
    });

    it('should display thank you message', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByText(/Thank you for your purchase/i)).toBeInTheDocument();
    });

    it('should display email confirmation message', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(
        screen.getByText(/confirmation email has been sent/i)
      ).toBeInTheDocument();
    });

    it('should display processing message', () => {
      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByText(/being processed/i)).toBeInTheDocument();
    });
  });

  describe('Currency Formatting', () => {
    it('should format amount with USD currency symbol', () => {
      const mockInvoice = {
        invoiceId: 5,
        invoiceNumber: 'INV-20260405-005',
        amount: 1234.56,
      };

      mockUseLocation.mockReturnValue({
        state: { invoice: mockInvoice },
      });
      mockUseNavigate.mockReturnValue(mockNavigate);
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      });

      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    });

    it('should format whole dollar amounts with .00', () => {
      const mockInvoice = {
        invoiceId: 6,
        invoiceNumber: 'INV-20260405-006',
        amount: 100,
      };

      mockUseLocation.mockReturnValue({
        state: { invoice: mockInvoice },
      });
      mockUseNavigate.mockReturnValue(mockNavigate);
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      });

      render(
        <BrowserRouter>
          <CheckoutComplete />
        </BrowserRouter>
      );

      expect(screen.getByText('$100.00')).toBeInTheDocument();
    });
  });
});
