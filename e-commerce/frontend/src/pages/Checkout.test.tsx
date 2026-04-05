import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkout from './Checkout';
import * as orderService from '@/services/orderService';

// Mock the dependencies
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/context/CartContext', () => ({
  useCart: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    Link: ({ to, children }: any) => <a href={to}>{children}</a>,
  };
});

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

vi.mock('@/services/orderService', () => ({
  createOrder: vi.fn(),
}));

// Get mocked functions
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

describe('Checkout Component', () => {
  const mockNavigate = vi.fn();
  const mockToast = vi.fn();
  const mockClearCart = vi.fn();

  const mockAuthUser = {
    client: {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      phone: '555-1234',
      address: '123 Old Street',
    },
    token: 'test-token-123',
  };

  const mockCartItem = {
    product: {
      id: 101,
      sku: 'PROD-001',
      name: 'Test Product',
      description: 'A test product',
      price: 99.99,
      onhand: 10,
      image_url: 'https://example.com/product.jpg',
    },
    quantity: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    (useAuth as any).mockReturnValue({
      user: mockAuthUser,
      isAuthenticated: true,
    });

    (useCart as any).mockReturnValue({
      items: [mockCartItem],
      totalItems: 2,
      totalAmount: 199.98,
      clearCart: mockClearCart,
    });

    (useNavigate as any).mockReturnValue(mockNavigate);

    (useToast as any).mockReturnValue({
      toast: mockToast,
    });

    (orderService.createOrder as any).mockResolvedValue({
      success: true,
      data: {
        invoiceId: 999,
        invoiceNumber: 'INV-20260405-001',
        amount: 199.98,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Empty Cart Redirect', () => {
    it('should display empty cart message when cart is empty', () => {
      (useCart as any).mockReturnValue({
        items: [],
        totalItems: 0,
        totalAmount: 0,
        clearCart: mockClearCart,
      });

      render(<Checkout />);

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      expect(
        screen.getByText('Add items to your cart before checking out.')
      ).toBeInTheDocument();
      expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
    });
  });

  describe('Authentication Required', () => {
    it('should display auth required message when user is not logged in', () => {
      (useAuth as any).mockReturnValue({
        user: null,
        isAuthenticated: false,
      });

      render(<Checkout />);

      expect(screen.getByText('Authentication Required')).toBeInTheDocument();
      expect(
        screen.getByText('Please log in to complete your checkout.')
      ).toBeInTheDocument();
    });
  });

  describe('Full Happy Path (Step 1 → 2 → 3)', () => {
    it('should complete full checkout flow with data persistence', async () => {
      const user = userEvent.setup();
      render(<Checkout />);

      // ===== STEP 1: Address Step =====
      expect(screen.getByText('Address')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument(); // Read-only name

      // Fill out address form
      const addressInput = screen.getByRole('textbox', { name: /Street Address/i });
      await user.clear(addressInput);
      await user.type(addressInput, '456 New Avenue');
      const cityInput = screen.getByPlaceholderText('Your City');
      const stateInput = screen.getByPlaceholderText('Your State');
      const postalInput = screen.getByPlaceholderText('Your postal code');
      const countryInput = screen.getByPlaceholderText('Your Country');

      await user.type(cityInput, 'Los Angeles');
      await user.type(stateInput, 'CA');
      await user.type(postalInput, '90001');
      await user.type(countryInput, 'USA');

      // Click Next
      const nextButton = screen.getByRole('button', { name: /Next: Payment/i });
      await user.click(nextButton);

      // ===== STEP 2: Payment Step =====
      await waitFor(() => {
        expect(screen.getByText('Payment Method')).toBeInTheDocument();
      });

      // Fill out credit card form
      const nameOnCardInput = screen.getByPlaceholderText('John Doe');
      const cardNumberInput = screen.getByPlaceholderText('4242424242424242');
      const expiryInput = screen.getByPlaceholderText('12/26');
      const cvvInput = screen.getByPlaceholderText('123');

      await user.type(nameOnCardInput, 'John Doe');
      await user.type(cardNumberInput, '4242424242424242');
      await user.type(expiryInput, '12/25');
      await user.type(cvvInput, '123');

      // Click Continue to Review
      const continueReviewButton = screen.getByRole('button', {
        name: /Continue to Review/i,
      });
      await user.click(continueReviewButton);

      // ===== STEP 3: Review Step =====
      await waitFor(() => {
        expect(screen.getByText('Order Review')).toBeInTheDocument();
      });

      // Verify cart items are displayed
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('PROD-001')).toBeInTheDocument();

      // Verify shipping address
      expect(screen.getByText('456 New Avenue, Los Angeles, CA, 90001, USA')).toBeInTheDocument();

      // Check terms
      const termsCheckbox = screen.getByRole('checkbox', {
        name: /I agree to the Terms and Conditions/i,
      });
      await user.click(termsCheckbox);

      // Click Place Order
      const placeOrderButton = screen.getByRole('button', {
        name: /Place Order/i,
      });
      await user.click(placeOrderButton);

      // ===== Verify API Call =====
      await waitFor(() => {
        expect(orderService.createOrder).toHaveBeenCalledWith({
          clientAddress: '456 New Avenue, Los Angeles, CA, 90001, USA',
          paymentToken: expect.stringMatching(/^mock_cc_/),
          items: [{ productId: 101, quantity: 2 }],
        });
      });

      // ===== Verify Side Effects =====
      expect(mockClearCart).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Order Placed Successfully!',
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        '/checkout-complete',
        expect.objectContaining({
          state: expect.objectContaining({
            invoice: expect.objectContaining({
              invoiceNumber: 'INV-20260405-001',
            }),
          }),
        })
      );
    });

    it('should handle PayPal payment flow', async () => {
      const user = userEvent.setup();
      render(<Checkout />);

      // Step 1: Fill and advance
      const addressInputStep = screen.getByRole('textbox', { name: /Street Address/i });
      await user.clear(addressInputStep);
      await user.type(addressInputStep, '789 Test Lane');
      await user.type(screen.getByPlaceholderText('Your City'), 'Chicago');
      await user.type(screen.getByPlaceholderText('Your State'), 'IL');
      await user.type(screen.getByPlaceholderText('Your postal code'), '60601');
      await user.type(screen.getByPlaceholderText('Your Country'), 'USA');

      await user.click(screen.getByRole('button', { name: /Next: Payment/i }));

      // Step 2: Click PayPal tab
      await waitFor(() => {
        expect(screen.getByText('Payment Method')).toBeInTheDocument();
      });

      const paypalTab = screen.getByRole('tab', { name: 'PayPal' });
      await user.click(paypalTab);

      // Click PayPal button
      const paypalButton = screen.getByRole('button', { name: /Log in to PayPal/i });
      await user.click(paypalButton);

      // Step 3: Complete and verify
      await waitFor(() => {
        expect(screen.getByText('Order Review')).toBeInTheDocument();
      });

      const termsCheckbox = screen.getByRole('checkbox');
      await user.click(termsCheckbox);

      const placeOrderButton = screen.getByRole('button', { name: /Place Order/i });
      await user.click(placeOrderButton);

      await waitFor(() => {
        expect(orderService.createOrder).toHaveBeenCalledWith(
          expect.objectContaining({
            paymentToken: expect.stringMatching(/^mock_paypal_/),
          })
        );
      });
    });
  });

  describe('State Retention (Back Button)', () => {
    it('should preserve address form data when navigating back from payment step', async () => {
      const user = userEvent.setup();
      render(<Checkout />);

      // Step 1: Fill address
      const testAddress = '999 Retention Ave';
      const testCity = 'Boston';
      const testState = 'MA';
      const testPostal = '02101';
      const testCountry = 'USA';

      const addressInputRetention = screen.getByRole('textbox', { name: /Street Address/i });
      await user.clear(addressInputRetention);
      await user.type(addressInputRetention, testAddress);
      await user.type(screen.getByPlaceholderText('Your City'), testCity);
      await user.type(screen.getByPlaceholderText('Your State'), testState);
      await user.type(screen.getByPlaceholderText('Your postal code'), testPostal);
      await user.type(screen.getByPlaceholderText('Your Country'), testCountry);

      // Advance to payment
      await user.click(screen.getByRole('button', { name: /Next: Payment/i }));

      await waitFor(() => {
        expect(screen.getByText('Payment Method')).toBeInTheDocument();
      });

      // Go back to address
      const backButton = screen.getAllByRole('button', { name: /Back/i })[0];
      await user.click(backButton);

      // Verify address data is retained
      await waitFor(() => {
        expect(screen.getByDisplayValue(testAddress)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testCity)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testState)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testPostal)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testCountry)).toBeInTheDocument();
      });
    });

    it('should preserve payment form data when navigating back from review step', async () => {
      const user = userEvent.setup();
      render(<Checkout />);

      // Step 1: Complete address
      const addressInputData = screen.getByRole('textbox', { name: /Street Address/i });
      await user.clear(addressInputData);
      await user.type(addressInputData, '555 Data Ln');
      await user.type(screen.getByPlaceholderText('Your City'), 'Portland');
      await user.type(screen.getByPlaceholderText('Your State'), 'OR');
      await user.type(screen.getByPlaceholderText('Your postal code'), '97201');
      await user.type(screen.getByPlaceholderText('Your Country'), 'USA');

      await user.click(screen.getByRole('button', { name: /Next: Payment/i }));

      // Step 2: Fill payment with specific card number
      await waitFor(() => {
        expect(screen.getByText('Payment Method')).toBeInTheDocument();
      });

      const testCardNumber = '5555555555554444';
      const testNameOnCard = 'Jane Doe';
      const testExpiry = '06/27';
      const testCVV = '456';

      await user.type(screen.getByPlaceholderText('John Doe'), testNameOnCard);
      await user.type(screen.getByPlaceholderText('4242424242424242'), testCardNumber);
      await user.type(screen.getByPlaceholderText('12/26'), testExpiry);
      await user.type(screen.getByPlaceholderText('123'), testCVV);

      await user.click(screen.getByRole('button', { name: /Continue to Review/i }));

      // Step 3: Go back to payment
      await waitFor(() => {
        expect(screen.getByText('Order Review')).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: /Back/i });
      await user.click(backButton);

      // Verify payment data is retained
      await waitFor(() => {
        expect(screen.getByDisplayValue(testNameOnCard)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testCardNumber)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testExpiry)).toBeInTheDocument();
        expect(screen.getByDisplayValue(testCVV)).toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    it('should prevent submission with invalid address', async () => {
      const user = userEvent.setup();
      render(<Checkout />);

      // Clear the address field to make it invalid
      const addressInputValidation = screen.getByRole('textbox', { name: /Street Address/i });
      await user.clear(addressInputValidation);

      // Try to submit with empty address
      const nextButton = screen.getByRole('button', { name: /Next: Payment/i });
      await user.click(nextButton);

      // Should show error
      await waitFor(() => {
        expect(screen.getByText('Address is required')).toBeInTheDocument();
      });

      // Should not advance
      expect(screen.getByText('Address')).toBeInTheDocument();
    });

    it('should prevent submission with invalid credit card', async () => {
      const user = userEvent.setup();
      render(<Checkout />);

      // Step 1: Complete
      const addressInputValidation2 = screen.getByRole('textbox', { name: /Street Address/i });
      await user.clear(addressInputValidation2);
      await user.type(addressInputValidation2, '100 Main St');
      await user.type(screen.getByPlaceholderText('Your City'), 'Seattle');
      await user.type(screen.getByPlaceholderText('Your State'), 'WA');
      await user.type(screen.getByPlaceholderText('Your postal code'), '98101');
      await user.type(screen.getByPlaceholderText('Your Country'), 'USA');

      await user.click(screen.getByRole('button', { name: /Next: Payment/i }));

      // Step 2: Try with invalid card
      await waitFor(() => {
        expect(screen.getByText('Payment Method')).toBeInTheDocument();
      });

      // Submit with invalid card number
      const continueButton = screen.getByRole('button', {
        name: /Continue to Review/i,
      });
      await user.click(continueButton);

      // Should show error
      await waitFor(() => {
        expect(screen.getByText('Card number must be 16 digits')).toBeInTheDocument();
      });
    });

    it('should disable Place Order button if terms are not agreed', async () => {
      const user = userEvent.setup();
      render(<Checkout />);

      // Complete Steps 1 & 2
      const addressInputValidation = screen.getByRole('textbox', { name: /Street Address/i });
      await user.clear(addressInputValidation);
      await user.type(addressInputValidation, '100 Main St');
      await user.type(screen.getByPlaceholderText('Your City'), 'Seattle');
      await user.type(screen.getByPlaceholderText('Your State'), 'WA');
      await user.type(screen.getByPlaceholderText('Your postal code'), '98101');
      await user.type(screen.getByPlaceholderText('Your Country'), 'USA');

      await user.click(screen.getByRole('button', { name: /Next: Payment/i }));

      await waitFor(() => {
        expect(screen.getByText('Payment Method')).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('John Doe'), 'Jane Smith');
      await user.type(screen.getByPlaceholderText('4242424242424242'), '4111111111111111');
      await user.type(screen.getByPlaceholderText('12/26'), '03/26');
      await user.type(screen.getByPlaceholderText('123'), '789');

      await user.click(screen.getByRole('button', { name: /Continue to Review/i }));

      await waitFor(() => {
        expect(screen.getByText('Order Review')).toBeInTheDocument();
      });

      // Place Order should be disabled without terms
      const placeOrderButton = screen.getByRole('button', { name: /Place Order/i });
      expect(placeOrderButton).toBeDisabled();

      // Enable by checking terms
      const termsCheckbox = screen.getByRole('checkbox');
      await user.click(termsCheckbox);

      expect(placeOrderButton).not.toBeDisabled();
    });
  });

  describe('API Error Handling', () => {
    it('should display error toast on order creation failure', async () => {
      (orderService.createOrder as any).mockRejectedValueOnce(
        new Error('Payment declined')
      );

      const user = userEvent.setup();
      render(<Checkout />);

      // Complete Steps 1 & 2
      const addressInputValidation = screen.getByRole('textbox', { name: /Street Address/i });
      await user.clear(addressInputValidation);
      await user.type(addressInputValidation, '100 Main St');
      await user.type(screen.getByPlaceholderText('Your City'), 'Seattle');
      await user.type(screen.getByPlaceholderText('Your State'), 'WA');
      await user.type(screen.getByPlaceholderText('Your postal code'), '98101');
      await user.type(screen.getByPlaceholderText('Your Country'), 'USA');

      await user.click(screen.getByRole('button', { name: /Next: Payment/i }));

      await waitFor(() => {
        expect(screen.getByText('Payment Method')).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('John Doe'), 'Jane Smith');
      await user.type(screen.getByPlaceholderText('4242424242424242'), '4111111111111111');
      await user.type(screen.getByPlaceholderText('12/26'), '03/26');
      await user.type(screen.getByPlaceholderText('123'), '789');

      await user.click(screen.getByRole('button', { name: /Continue to Review/i }));

      await waitFor(() => {
        expect(screen.getByText('Order Review')).toBeInTheDocument();
      });

      const termsCheckbox = screen.getByRole('checkbox');
      await user.click(termsCheckbox);

      await user.click(screen.getByRole('button', { name: /Place Order/i }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            variant: 'destructive',
            title: 'Order Failed',
            description: 'Payment declined',
          })
        );
      });
    });
  });
});
