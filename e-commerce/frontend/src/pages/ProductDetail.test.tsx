import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ProductDetail from './ProductDetail';
import { useProduct } from '@/hooks/useProduct';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

// Mock dependencies
vi.mock('@/hooks/useProduct');
vi.mock('@/context/CartContext');

const mockProduct: Product = {
  id: 1001,
  sku: 'SKU-CTI-LAP-1001',
  name: 'Lenovo ThinkPad E14 Gen 5',
  description:
    '14-inch business laptop with Intel Core i7 processor, 16GB RAM, and 512GB SSD. Perfect for professionals.',
  price: 1299.99,
  onhand: 18,
  image_url: 'https://example.com/product.jpg',
};

const mockUseProduct = vi.mocked(useProduct);
const mockUseCart = vi.mocked(useCart);

describe('ProductDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCart.mockReturnValue({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
    });
  });

  /**
   * Render helper that wraps ProductDetail in MemoryRouter with Routes
   * This allows useParams and Link components to work correctly during tests
   */
  const renderProductDetail = (productId: string = '1001') => {
    return render(
      <MemoryRouter initialEntries={[`/products/${productId}`]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe('Test 1: Loading State', () => {
    it('should display loading skeleton while fetching product', () => {
      // Arrange: Mock useProduct to return loading state
      mockUseProduct.mockReturnValue({
        product: null,
        loading: true,
        error: null,
        isError: false,
      });

      // Act: Render component with loading state
      renderProductDetail();

      // Assert: Verify loading indicator with animate-pulse class is visible
      const loadingContainer = document.querySelector('.animate-pulse');
      expect(loadingContainer).toBeInTheDocument();
      expect(loadingContainer).toHaveClass('grid', 'gap-8', 'md:grid-cols-2');
    });
  });

  describe('Test 2: Error State', () => {
    it('should display error message when product fetch fails', () => {
      // Arrange: Mock useProduct to return error state
      mockUseProduct.mockReturnValue({
        product: null,
        loading: false,
        error: new Error('Network failed'),
        isError: true,
      });

      // Act: Render component with error state
      renderProductDetail();

      // Assert: Verify error UI is displayed
      expect(screen.getByText('Product Not Found')).toBeInTheDocument();
      expect(
        screen.getByText("The product you're looking for doesn't exist.")
      ).toBeInTheDocument();

      // Assert: Verify back navigation link is present
      expect(
        screen.getByRole('link', { name: /Back to Products/i })
      ).toBeInTheDocument();
    });
  });

  describe('Test 3: Success State', () => {
    it('should render all product details successfully', () => {
      // Arrange: Mock useProduct to return product data
      mockUseProduct.mockReturnValue({
        product: mockProduct,
        loading: false,
        error: null,
        isError: false,
      });

      // Act: Render component with product data
      renderProductDetail();

      // Assert: Product SKU is rendered in muted text
      expect(screen.getByText('SKU-CTI-LAP-1001')).toBeInTheDocument();

      // Assert: Product name is rendered as bold heading
      const productName = screen.getByText('Lenovo ThinkPad E14 Gen 5');
      expect(productName).toBeInTheDocument();
      expect(productName.tagName).toBe('H1');
      expect(productName).toHaveClass('font-bold');

      // Assert: Product description is rendered
      expect(
        screen.getByText(
          '14-inch business laptop with Intel Core i7 processor, 16GB RAM, and 512GB SSD. Perfect for professionals.'
        )
      ).toBeInTheDocument();

      // Assert: Price is rendered with correct formatting
      const priceText = screen.getByText('$1299.99');
      expect(priceText).toBeInTheDocument();
      expect(priceText).toHaveClass('text-3xl', 'font-bold');

      // Assert: Stock count is rendered in muted text
      expect(screen.getByText('18 in stock')).toBeInTheDocument();

      // Assert: Quantity label is present
      expect(screen.getByLabelText('Qty')).toBeInTheDocument();

      // Assert: Add to Cart button is rendered
      const addToCartButton = screen.getByRole('button', {
        name: /Add to Cart/i,
      });
      expect(addToCartButton).toBeInTheDocument();
      expect(addToCartButton).not.toBeDisabled();

      // Assert: Back to Products navigation link is present
      expect(
        screen.getByRole('link', { name: /Back to Products/i })
      ).toBeInTheDocument();
    });
  });

  describe('Test 4: Image Fallback', () => {
    it('should use default image when product image URL is empty', () => {
      // Arrange: Mock useProduct with product having empty image URL
      const productWithoutImage: Product = {
        ...mockProduct,
        image_url: '',
      };
      mockUseProduct.mockReturnValue({
        product: productWithoutImage,
        loading: false,
        error: null,
        isError: false,
      });

      // Act: Render component
      renderProductDetail();

      // Assert: Verify rendered image uses default fallback
      const image = screen.getByAltText(mockProduct.name) as HTMLImageElement;
      expect(image).toBeInTheDocument();
      expect(image.src).toContain('default-product.png');
    });

    it('should use default image when product has provided image URL', () => {
      // Arrange: Mock useProduct with product having valid image URL
      mockUseProduct.mockReturnValue({
        product: mockProduct,
        loading: false,
        error: null,
        isError: false,
      });

      // Act: Render component
      renderProductDetail();

      // Assert: Verify rendered image uses provided URL
      const image = screen.getByAltText(mockProduct.name) as HTMLImageElement;
      expect(image).toBeInTheDocument();
      expect(image.src).toBe('https://example.com/product.jpg');
    });
  });

  describe('Additional: Edge Cases', () => {
    it('should display out of stock state when onhand is zero', () => {
      // Arrange: Mock useProduct with out-of-stock product
      const outOfStockProduct: Product = {
        ...mockProduct,
        onhand: 0,
      };
      mockUseProduct.mockReturnValue({
        product: outOfStockProduct,
        loading: false,
        error: null,
        isError: false,
      });

      // Act: Render component
      renderProductDetail();

      // Assert: Verify out-of-stock text is displayed
      expect(screen.getByText('Out of stock')).toBeInTheDocument();

      // Assert: Verify Add to Cart button is disabled
      const addToCartButton = screen.getByRole('button', {
        name: /Add to Cart/i,
      });
      expect(addToCartButton).toBeDisabled();

      // Assert: Verify quantity input is disabled
      const qtyInput = screen.getByLabelText('Qty') as HTMLInputElement;
      expect(qtyInput).toBeDisabled();
    });

    it('should render with different product ID parameter', () => {
      // Arrange: Mock useProduct to be called with specific product ID
      mockUseProduct.mockReturnValue({
        product: { ...mockProduct, id: 2001, sku: 'SKU-CTI-PHONE-2001' },
        loading: false,
        error: null,
        isError: false,
      });

      // Act: Render component with different product ID
      renderProductDetail('2001');

      // Assert: Verify hook was called with correct ID (converted to number)
      expect(mockUseProduct).toHaveBeenCalledWith(2001);

      // Assert: Verify different product is displayed
      expect(screen.getByText('SKU-CTI-PHONE-2001')).toBeInTheDocument();
    });
  });
});
