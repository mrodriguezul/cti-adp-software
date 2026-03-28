import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";
import { CartProvider, useCart } from "./CartContext";
import { Product } from "@/types";

// Mock the use-toast hook
const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock product for testing
const mockProduct: Product = {
  id: 1001,
  sku: "TEST-001",
  name: "Test Product",
  price: 100,
  onhand: 5,
  description: "A test product",
  image_url: "https://example.com/product.jpg",
};

// Wrapper component that provides CartContext
function CartProviderWrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe("CartContext", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mock call history
    mockToast.mockClear();
  });

  describe("Initial State", () => {
    it("should have an empty cart with zero totals on initial render", () => {
      // Arrange & Act
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProviderWrapper,
      });

      // Assert
      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalAmount).toBe(0);
    });
  });

  describe("Add to Cart", () => {
    it("should add a product to the cart with correct quantity and totals", () => {
      // Arrange
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProviderWrapper,
      });

      // Act
      act(() => {
        result.current.addToCart(mockProduct, 2);
      });

      // Assert
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].product.id).toBe(1001);
      expect(result.current.items[0].quantity).toBe(2);
      expect(result.current.totalItems).toBe(2);
      expect(result.current.totalAmount).toBe(200); // 2 * 100
    });
  });

  describe("Stock Limit Validation", () => {
    it("should cap quantity at stock limit and show toast notification", () => {
      // Arrange
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProviderWrapper,
      });

      // Act: Add 2 items to cart (within stock of 5)
      act(() => {
        result.current.addToCart(mockProduct, 2);
      });

      // Act: Try to add 10 more (which exceeds stock of 5)
      act(() => {
        result.current.addToCart(mockProduct, 10);
      });

      // Assert: Quantity should be capped at 5 (stock limit)
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(5);
      expect(result.current.totalItems).toBe(5);
      expect(result.current.totalAmount).toBe(500); // 5 * 100

      // Assert: Toast should have been called with stock limit message
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Stock Limit Reached",
        description: "Only 5 available in stock.",
      });
    });
  });

  describe("Update Quantity", () => {
    it("should update the quantity of an existing item in the cart", () => {
      // Arrange
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProviderWrapper,
      });

      // Act: Add item to cart
      act(() => {
        result.current.addToCart(mockProduct, 2);
      });

      // Act: Update quantity to 3
      act(() => {
        result.current.updateQuantity(1001, 3);
      });

      // Assert
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(3);
      expect(result.current.totalItems).toBe(3);
      expect(result.current.totalAmount).toBe(300); // 3 * 100
    });
  });

  describe("Remove Item", () => {
    it("should remove an item from the cart", () => {
      // Arrange
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProviderWrapper,
      });

      // Act: Add item to cart
      act(() => {
        result.current.addToCart(mockProduct, 2);
      });

      // Assert: Item was added
      expect(result.current.items).toHaveLength(1);

      // Act: Remove the item
      act(() => {
        result.current.removeFromCart(1001);
      });

      // Assert: Cart is empty again
      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalAmount).toBe(0);
    });
  });

  describe("localStorage Persistence", () => {
    it("should persist cart to localStorage on add", () => {
      // Arrange
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProviderWrapper,
      });

      // Act
      act(() => {
        result.current.addToCart(mockProduct, 2);
      });

      // Assert: Check localStorage
      const stored = localStorage.getItem("lpa_cart");
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].product.id).toBe(1001);
      expect(parsed[0].quantity).toBe(2);
    });

    it("should load cart from localStorage on provider mount", () => {
      // Arrange: Pre-populate localStorage
      const cartData = [
        {
          product: mockProduct,
          quantity: 3,
        },
      ];
      localStorage.setItem("lpa_cart", JSON.stringify(cartData));

      // Act
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProviderWrapper,
      });

      // Assert
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(3);
      expect(result.current.totalItems).toBe(3);
      expect(result.current.totalAmount).toBe(300); // 3 * 100
    });
  });

  describe("Clear Cart", () => {
    it("should clear all items and localStorage", () => {
      // Arrange
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProviderWrapper,
      });

      // Act: Add items
      act(() => {
        result.current.addToCart(mockProduct, 2);
      });

      expect(result.current.items).toHaveLength(1);

      // Act: Clear cart
      act(() => {
        result.current.clearCart();
      });

      // Assert
      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalAmount).toBe(0);
      expect(localStorage.getItem("lpa_cart")).toBeNull();
    });
  });

  describe("Multiple Products", () => {
    it("should handle multiple different products in the cart", () => {
      // Arrange
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProviderWrapper,
      });

      const product2: Product = {
        ...mockProduct,
        id: 1002,
        price: 50,
      };

      // Act: Add two different products
      act(() => {
        result.current.addToCart(mockProduct, 2); // 2 * 100 = 200
        result.current.addToCart(product2, 3); // 3 * 50 = 150
      });

      // Assert
      expect(result.current.items).toHaveLength(2);
      expect(result.current.totalItems).toBe(5); // 2 + 3
      expect(result.current.totalAmount).toBe(350); // 200 + 150
    });
  });

  describe("Error Handling", () => {
    it("should throw error when useCart is used outside CartProvider", () => {
      // Act & Assert
      expect(() => {
        renderHook(() => useCart());
      }).toThrow("useCart must be used within CartProvider");
    });
  });

  describe("Boundary Cases", () => {
    it("should handle default quantity of 1 when no quantity is provided", () => {
      // Arrange
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProviderWrapper,
      });

      // Act
      act(() => {
        result.current.addToCart(mockProduct);
      });

      // Assert
      expect(result.current.items[0].quantity).toBe(1);
      expect(result.current.totalAmount).toBe(100);
    });

    it("should remove item when updateQuantity is called with 0 or negative number", () => {
      // Arrange
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProviderWrapper,
      });

      // Act: Add item
      act(() => {
        result.current.addToCart(mockProduct, 2);
      });

      // Act: Update quantity to 0
      act(() => {
        result.current.updateQuantity(1001, 0);
      });

      // Assert
      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
    });

    it("should cap quantity at stock limit when updating", () => {
      // Arrange
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProviderWrapper,
      });

      // Act: Add item
      act(() => {
        result.current.addToCart(mockProduct, 2);
      });

      // Act: Try to update to quantity exceeding stock
      act(() => {
        result.current.updateQuantity(1001, 10);
      });

      // Assert
      expect(result.current.items[0].quantity).toBe(5); // Capped at stock limit
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Stock Limit Reached",
        description: "Only 5 available in stock.",
      });
    });
  });
});
