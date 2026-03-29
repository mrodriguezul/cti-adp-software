import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cart from './Cart';
import * as CartContextModule from '@/context/CartContext';
import * as AuthContextModule from '@/context/AuthContext';

// Mock the contexts
vi.mock('@/context/CartContext');
vi.mock('@/context/AuthContext');
vi.mock('@/components/LoginDialog', () => ({
  LoginDialog: () => null,
}));

describe('Cart', () => {
  const mockUpdateQuantity = vi.fn();
  const mockRemoveFromCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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
        user: { id: 1, email: 'test@example.com' },
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
      });

      // Act
      renderCart();

      // Assert - Check each product row
      const productRows = screen.getAllByText(/SKU-/).map(node => node.closest('.sm\\:grid'));
      
      // Laptop
      const laptopRow = productRows[0];
      expect(within(laptopRow).getByText('Laptop')).toBeInTheDocument();
      expect(within(laptopRow).getByText('SKU-001')).toBeInTheDocument();
      expect(within(laptopRow).getByText('$999.99')).toBeInTheDocument();
      
      // Headphones
      const headphonesRow = productRows[1];
      expect(within(headphonesRow).getByText('Headphones')).toBeInTheDocument();
      expect(within(headphonesRow).getByText('SKU-002')).toBeInTheDocument();
      expect(within(headphonesRow).getAllByText('$149.99')).toHaveLength(2);

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
        user: { id: 1, email: 'test@example.com' },
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
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
        user: { id: 1, email: 'test@example.com' },
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
      });

      // Act
      renderCart();

      // Find the trash icon button for the first item (Laptop)
      // Navigate from product name to row div, then find the delete button
      const laptopText = screen.getByText('Laptop');
      const rowDiv = laptopText.parentElement?.parentElement?.parentElement;
      const deleteButton = within(rowDiv!).getByRole('button');

      // Click the delete button
      await fireEvent.click(deleteButton);

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
        user: { id: 1, email: 'test@example.com' },
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
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
        user: { id: 1, email: 'test@example.com' },
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
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
        user: { id: 1, email: 'test@example.com' },
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
      });

      // Act
      renderCart();

      // Assert - Line item amount should be $2999.97 (999.99 × 3)
      const productRow = screen.getByText('Laptop').closest('.sm\\:grid');
      expect(within(productRow).getByText(`$${expectedAmount.toFixed(2)}`)).toBeInTheDocument();
    });
  });
});
