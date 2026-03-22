import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CartItem, Product } from "@/types";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "lpa_cart";

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  const update = (newItems: CartItem[]) => {
    setItems(newItems);
    saveCart(newItems);
  };

  const addToCart = useCallback(
    (product: Product, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        const next = existing
          ? prev.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: Math.min(i.quantity + qty, product.onhand) }
                : i
            )
          : [...prev, { product, quantity: Math.min(qty, product.onhand) }];
        saveCart(next);
        return next;
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: number) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.product.id !== productId);
      saveCart(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId: number, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) {
        const next = prev.filter((i) => i.product.id !== productId);
        saveCart(next);
        return next;
      }
      const next = prev.map((i) =>
        i.product.id === productId
          ? { ...i, quantity: Math.min(qty, i.product.onhand) }
          : i
      );
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    update([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalAmount, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
