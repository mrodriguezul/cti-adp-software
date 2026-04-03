import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Cart from './Cart';
import * as CartContextModule from '@/context/CartContext';
import * as AuthContextModule from '@/context/AuthContext';

// Mock the contexts
vi.mock('@/context/CartContext');
vi.mock('@/context/AuthContext');
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: [],
  }),
}));

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock LoginDialog to capture open state
vi.mock('@/components/LoginDialog', () => ({
  LoginDialog: ({ open, onLoginSuccess }: any) => {
    if (!open) return null;
    return (
      <div role="dialog" data-testid="login-dialog">
        <div className="space-y-4">
          <input type="email" placeholder="email@example.com" data-testid="login-email" />
          <input type="password" placeholder="password" data-testid="login-password" />
          <button
            onClick={() => {
              onLoginSuccess?.();
            }}
            data-testid="dialog-sign-in-button"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  },
}));

describe('Cart', () => {
  const mockUpdateQuantity = vi.fn();
  const mockRemoveFromCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  const renderCart = () => {
    return render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
  };

  describe('Empty State', () => {
    it('should display empty state message and Continue Shopping link when cart is empty', () => {
      // Arrange
      vi.mocked(CartContextModule.useCart).mockReturnValue({
        items: [],
        totalAmount: 0,
        totalItems: 0,
        addToCart: vi.fn(),
        removeFromCart: mockRemoveFromCart,
        updateQuantity: mockUpdateQuantity,
        clearCart: vi.fn(),
      });

      vi.mocked(AuthContextModule.useAuth).mockReturnValue({
        isAuthenticated: false,
        user: null,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
      });

      // Act
      renderCart();

      // Assert
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      expect(
        screen.getByText('Browse our products and add items to get started.')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /continue shopping/i })
      ).toBeInTheDocument();
    });
  });

  describe('Populated State', () => {
    it('should display cart items with correct product information, prices, and total', () => {
      // Arrange
      const mockCartItems = [
        {
          product: {
            id: 1,
            name: 'Laptop',
            sku: 'SKU-001',
            price: 999.99,
            image_url: 'https://example.com/laptop.jpg',
            onhand: 10,
            description: 'High performance laptop',
            status: 'A' as const,
          },
          quantity: 2,
        },
        {
          product: {
            id: 2,
            name: 'Headphones',
            sku: 'SKU-002',
            price: 149.99,
            image_url: 'https://example.com/headphones.jpg',
            onhand: 20,
            description: 'Wireless headphones',
            status: 'A' as const,
          },
          quantity: 1,
        },
      ];

      const totalAmount = 999.99 * 2 + 149.99 * 1;

      vi.mocked(CartContextModule.useCart).mockReturnValue({
        items: mockCartItems,
        totalAmount,
        totalItems: 3,
        addToCart: vi.fn(),
        removeFromCart: mockRemoveFromCart,
        updateQuantity: mockUpdateQuantity,
        clearCart: vi.fn(),
      });

      vi.mocked(AuthContextModule.useAuth).mockReturnValue({
        isAuthenticated: true,
        user: {
          token: 'test-token',
          client: { id: 1, firstname: 'John', lastname: 'Doe', email: 'test@example.com', phone: '', address: '' },
        } as any,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
      });

      // Act
      renderCart();

      // Assert - Check each product row
      const productRows = screen.getAllByText(/SKU-/).map(node => node.closest('.sm\\:grid') as HTMLElement | null);

      // Laptop
      const laptopRow = productRows[0];
      expect(within(laptopRow as HTMLElement).getByText('Laptop')).toBeInTheDocument();
      expect(within(laptopRow as HTMLElement).getByText('SKU-001')).toBeInTheDocument();
      expect(within(laptopRow as HTMLElement).getByText('$999.99')).toBeInTheDocument();

      // Headphones
      const headphonesRow = productRows[1];
      expect(within(headphonesRow as HTMLElement).getByText('Headphones')).toBeInTheDocument();
      expect(within(headphonesRow as HTMLElement).getByText('SKU-002')).toBeInTheDocument();
      expect(within(headphonesRow as HTMLElement).getAllByText('$149.99')).toHaveLength(2);

      // Assert - Total amount
      expect(screen.getByText(`$${totalAmount.toFixed(2)}`)).toBeInTheDocument();

      // Assert - Shopping Cart header
      expect(screen.getByRole('heading', { name: /shopping cart/i })).toBeInTheDocument();
    });
  });

  describe('Update Quantity', () => {
    it('should call updateQuantity with correct product ID and quantity when input value changes', async () => {
      // Arrange
      const mockCartItems = [
        {
          product: {
            id: 1,
            name: 'Laptop',
            sku: 'SKU-001',
            price: 999.99,
            image_url: 'https://example.com/laptop.jpg',
            onhand: 10,
            description: 'High performance laptop',
            status: 'A' as const,
          },
          quantity: 2,
        },
      ];

      vi.mocked(CartContextModule.useCart).mockReturnValue({
        items: mockCartItems,
        totalAmount: 1999.98,
        totalItems: 2,
        addToCart: vi.fn(),
        removeFromCart: mockRemoveFromCart,
        updateQuantity: mockUpdateQuantity,
        clearCart: vi.fn(),
      });

      vi.mocked(AuthContextModule.useAuth).mockReturnValue({
        isAuthenticated: true,
        user: {
          token: 'test-token',
          client: { id: 1, firstname: 'John', lastname: 'Doe', email: 'test@example.com', phone: '', address: '' },
        } as any,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
      });

      // Act
      renderCart();

      // Find the quantity input field by its current display value
      const quantityInput = screen.getByDisplayValue('2') as HTMLInputElement;

      // Clear the current value and type a new quantity
      fireEvent.change(quantityInput, { target: { value: '5' } });

      // Assert
      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 5);
    });
  });

  describe('Remove Item', () => {
    it('should call removeFromCart with correct product ID when delete button is clicked', async () => {
      // Arrange
      const mockCartItems = [
        {
          product: {
            id: 1,
            name: 'Laptop',
            sku: 'SKU-001',
            price: 999.99,
            image_url: 'https://example.com/laptop.jpg',
            onhand: 10,
            description: 'High performance laptop',
            status: 'A' as const,
          },
          quantity: 2,
        },
        {
          product: {
            id: 2,
            name: 'Headphones',
            sku: 'SKU-002',
            price: 149.99,
            image_url: 'https://example.com/headphones.jpg',
            onhand: 20,
            description: 'Wireless headphones',
            status: 'A' as const,
          },
          quantity: 1,
        },
      ];

      vi.mocked(CartContextModule.useCart).mockReturnValue({
        items: mockCartItems,
        totalAmount: 2149.97,
        totalItems: 3,
        addToCart: vi.fn(),
        removeFromCart: mockRemoveFromCart,
        updateQuantity: mockUpdateQuantity,
        clearCart: vi.fn(),
      });

      vi.mocked(AuthContextModule.useAuth).mockReturnValue({
        isAuthenticated: true,
        user: {
          token: 'test-token',
          client: { id: 1, firstname: 'John', lastname: 'Doe', email: 'test@example.com', phone: '', address: '' },
        } as any,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
      });

      // Act
      renderCart();

      // Find the trash icon button for the first item (Laptop)
      // Navigate from product name to row div, then find the delete button
      const laptopText = screen.getByText('Laptop');
      const rowDiv = laptopText.parentElement?.parentElement?.parentElement as HTMLElement;
      const deleteButton = within(rowDiv).getByRole('button');

      // Click the delete button
      fireEvent.click(deleteButton);

      // Assert
      expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
    });
  });

  describe('Table Headers and Layout', () => {
    it('should render table headers with correct column names in populated cart', () => {
      // Arrange
      const mockCartItems = [
        {
          product: {
            id: 1,
            name: 'Laptop',
            sku: 'SKU-001',
            price: 999.99,
            image_url: 'https://example.com/laptop.jpg',
            onhand: 10,
            description: 'High performance laptop',
            status: 'A' as const,
          },
          quantity: 1,
        },
      ];

      vi.mocked(CartContextModule.useCart).mockReturnValue({
        items: mockCartItems,
        totalAmount: 999.99,
        totalItems: 1,
        addToCart: vi.fn(),
        removeFromCart: mockRemoveFromCart,
        updateQuantity: mockUpdateQuantity,
        clearCart: vi.fn(),
      });

      vi.mocked(AuthContextModule.useAuth).mockReturnValue({
        isAuthenticated: true,
        user: {
          token: 'test-token',
          client: { id: 1, firstname: 'John', lastname: 'Doe', email: 'test@example.com', phone: '', address: '' },
        } as any,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
      });

      // Act
      renderCart();

      // Assert
      expect(screen.getByText('Product')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
      expect(screen.getByText('Qty')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
    });
  });

  describe('Checkout Button', () => {
    it('should render Proceed to Checkout button in populated cart', () => {
      // Arrange
      const mockCartItems = [
        {
          product: {
            id: 1,
            name: 'Laptop',
            sku: 'SKU-001',
            price: 999.99,
            image_url: 'https://example.com/laptop.jpg',
            onhand: 10,
            description: 'High performance laptop',
            status: 'A' as const,
          },
          quantity: 1,
        },
      ];

      vi.mocked(CartContextModule.useCart).mockReturnValue({
        items: mockCartItems,
        totalAmount: 999.99,
        totalItems: 1,
        addToCart: vi.fn(),
        removeFromCart: mockRemoveFromCart,
        updateQuantity: mockUpdateQuantity,
        clearCart: vi.fn(),
      });

      vi.mocked(AuthContextModule.useAuth).mockReturnValue({
        isAuthenticated: true,
        user: {
          token: 'test-token',
          client: { id: 1, firstname: 'John', lastname: 'Doe', email: 'test@example.com', phone: '', address: '' },
        } as any,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
      });

      // Act
      renderCart();

      // Assert
      expect(
        screen.getByRole('button', { name: /proceed to checkout/i })
      ).toBeInTheDocument();
    });
  });

  describe('Amount Calculation', () => {
    it('should display correct amount (Price × Qty) for each line item', () => {
      // Arrange
      const mockCartItems = [
        {
          product: {
            id: 1,
            name: 'Laptop',
            sku: 'SKU-001',
            price: 999.99,
            image_url: 'https://example.com/laptop.jpg',
            onhand: 10,
            description: 'High performance laptop',
            status: 'A' as const,
          },
          quantity: 3,
        },
      ];

      const expectedAmount = 999.99 * 3;

      vi.mocked(CartContextModule.useCart).mockReturnValue({
        items: mockCartItems,
        totalAmount: expectedAmount,
        totalItems: 3,
        addToCart: vi.fn(),
        removeFromCart: mockRemoveFromCart,
        updateQuantity: mockUpdateQuantity,
        clearCart: vi.fn(),
      });

      vi.mocked(AuthContextModule.useAuth).mockReturnValue({
        isAuthenticated: true,
        user: {
          token: 'test-token',
          client: { id: 1, firstname: 'John', lastname: 'Doe', email: 'test@example.com', phone: '', address: '' },
        } as any,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
      });

      // Act
      renderCart();

      // Assert - Line item amount should be $2999.97 (999.99 × 3)
      const productRow = screen.getByText('Laptop').closest('.sm\\:grid') as HTMLElement;
      expect(within(productRow).getByText(`$${expectedAmount.toFixed(2)}`)).toBeInTheDocument();
    });
  });

  describe('Checkout Login Interception - Unauthenticated User', () => {
    beforeEach(() => {
      mockNavigate.mockClear();

      const mockCartItems = [
        {
          product: {
            id: 1,
            name: 'Laptop',
            sku: 'SKU-001',
            price: 999.99,
            image_url: 'https://example.com/laptop.jpg',
            onhand: 10,
            description: 'High performance laptop',
            status: 'A' as const,
          },
          quantity: 1,
        },
      ];

      vi.mocked(CartContextModule.useCart).mockReturnValue({
        items: mockCartItems,
        totalAmount: 999.99,
        totalItems: 1,
        addToCart: vi.fn(),
        removeFromCart: mockRemoveFromCart,
        updateQuantity: mockUpdateQuantity,
        clearCart: vi.fn(),
      });

      vi.mocked(AuthContextModule.useAuth).mockReturnValue({
        isAuthenticated: false,
        user: null,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
      });
    });

    it('should NOT navigate when unauthenticated user clicks "Proceed to Checkout"', async () => {
      // Arrange
      const user = userEvent.setup();
      renderCart();

      // Act
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      await user.click(checkoutButton);

      // Assert
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should open LoginDialog when unauthenticated user clicks "Proceed to Checkout"', async () => {
      // Arrange
      const user = userEvent.setup();
      renderCart();

      // Act
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      await user.click(checkoutButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('login-dialog')).toBeInTheDocument();
      });
    });

    it('should display login form in the intercepted dialog', async () => {
      // Arrange
      const user = userEvent.setup();
      renderCart();

      // Act
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      await user.click(checkoutButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('login-dialog')).toBeInTheDocument();
        expect(screen.getByTestId('login-email')).toBeInTheDocument();
        expect(screen.getByTestId('login-password')).toBeInTheDocument();
      });
    });

    it('should keep user on cart page while LoginDialog is open', async () => {
      // Arrange
      const user = userEvent.setup();
      renderCart();

      // Verify we're on the cart page
      expect(screen.getByRole('heading', { name: /shopping cart/i })).toBeInTheDocument();

      // Act
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      await user.click(checkoutButton);

      // Assert - Should still see cart content and dialog
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /shopping cart/i })).toBeInTheDocument();
        expect(screen.getByText('Laptop')).toBeInTheDocument();
        expect(screen.getByTestId('login-dialog')).toBeInTheDocument();
      });
    });

    it('should navigate to checkout after successful login via dialog', async () => {
      // Arrange
      const user = userEvent.setup();
      renderCart();

      // Act
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      await user.click(checkoutButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-dialog')).toBeInTheDocument();
      });

      const signInButton = screen.getByTestId('dialog-sign-in-button');
      await user.click(signInButton);

      // Assert - After successful login, should navigate to checkout
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/checkout');
      });
    });

    it('should preserve cart items while LoginDialog is open', async () => {
      // Arrange
      const user = userEvent.setup();
      renderCart();

      // Act
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      await user.click(checkoutButton);

      // Assert - Cart items and dialog should still be visible
      await waitFor(() => {
        expect(screen.getByTestId('login-dialog')).toBeInTheDocument();
        expect(screen.getByText('Laptop')).toBeInTheDocument();
        expect(screen.getByText('SKU-001')).toBeInTheDocument();
      });
    });
  });

  describe('Checkout Navigation - Authenticated User', () => {
    beforeEach(() => {
      mockNavigate.mockClear();

      const mockCartItems = [
        {
          product: {
            id: 1,
            name: 'Laptop',
            sku: 'SKU-001',
            price: 999.99,
            image_url: 'https://example.com/laptop.jpg',
            onhand: 10,
            description: 'High performance laptop',
            status: 'A' as const,
          },
          quantity: 1,
        },
      ];

      vi.mocked(CartContextModule.useCart).mockReturnValue({
        items: mockCartItems,
        totalAmount: 999.99,
        totalItems: 1,
        addToCart: vi.fn(),
        removeFromCart: mockRemoveFromCart,
        updateQuantity: mockUpdateQuantity,
        clearCart: vi.fn(),
      });

      vi.mocked(AuthContextModule.useAuth).mockReturnValue({
        isAuthenticated: true,
        user: {
          token: 'test-token',
          client: {
            id: 1,
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
            phone: '555-1234',
            address: '123 Main St',
          },
        },
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        updateProfile: vi.fn(),
      });
    });

    it('should navigate directly to /checkout when authenticated user clicks button', async () => {
      // Arrange
      const user = userEvent.setup();
      renderCart();

      // Act
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      await user.click(checkoutButton);

      // Assert - Should navigate immediately
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledOnce();
        expect(mockNavigate).toHaveBeenCalledWith('/checkout');
      });
    });

    it('should NOT open LoginDialog when authenticated user clicks button', async () => {
      // Arrange
      const user = userEvent.setup();
      renderCart();

      // Act
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      await user.click(checkoutButton);

      // Assert - Dialog should NOT be visible
      const dialog = screen.queryByTestId('login-dialog');
      expect(dialog).not.toBeInTheDocument();
    });

    it('should navigate immediately without showing login form', async () => {
      // Arrange
      const user = userEvent.setup();
      renderCart();

      // Act
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      await user.click(checkoutButton);

      // Assert - Should navigate immediately
      expect(mockNavigate).toHaveBeenCalledWith('/checkout');

      // Login form should not exist
      expect(screen.queryByTestId('login-email')).not.toBeInTheDocument();
      expect(screen.queryByTestId('login-password')).not.toBeInTheDocument();
    });

    it('should allow authenticated user to proceed to checkout without friction', async () => {
      // Arrange
      const user = userEvent.setup();
      renderCart();

      // Assert - User can see cart is populated
      expect(screen.getByText('Laptop')).toBeInTheDocument();

      // Act - Click checkout
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      expect(checkoutButton).toBeEnabled();
      await user.click(checkoutButton);

      // Assert - Single navigation to checkout, no dialog shown
      expect(mockNavigate).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith('/checkout');
    });
  });
});
