import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LoginDialog } from "@/components/LoginDialog";
import { useState } from "react";
import defaultProductImage from "@/assets/default-product.png";

const Cart = () => {
  const { items, totalAmount, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="mb-2 text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="mb-6 text-muted-foreground">Browse our products and add items to get started.</p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Shopping Cart</h1>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Desktop table header */}
        <div className="hidden border-b border-border bg-muted/50 px-6 py-3 sm:grid sm:grid-cols-12 sm:gap-4">
          <span className="col-span-5 text-xs font-medium text-muted-foreground">Product</span>
          <span className="col-span-2 text-xs font-medium text-muted-foreground">Price</span>
          <span className="col-span-2 text-xs font-medium text-muted-foreground">Qty</span>
          <span className="col-span-2 text-xs font-medium text-muted-foreground text-right">Amount</span>
          <span className="col-span-1" />
        </div>

        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex flex-col gap-3 border-b border-border px-4 py-4 last:border-0 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:px-6"
          >
            <div className="col-span-5 flex items-center gap-3">
              <img
                src={item.product.image_url || defaultProductImage}
                alt={item.product.name}
                className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">{item.product.sku}</p>
              </div>
            </div>
            <div className="col-span-2 text-sm text-foreground">
              <span className="sm:hidden text-muted-foreground">Price: </span>
              ${item.product.price.toFixed(2)}
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                min={1}
                max={item.product.onhand}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                className="h-9 w-20"
              />
            </div>
            <div className="col-span-2 text-right text-sm font-semibold text-foreground">
              <span className="sm:hidden text-muted-foreground font-normal">Amount: </span>
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>
            <div className="col-span-1 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(item.product.id)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="flex items-center justify-between border-t border-border bg-muted/50 px-6 py-4">
          <span className="text-lg font-semibold text-foreground">Total</span>
          <span className="text-xl font-bold text-foreground">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          size="lg"
          onClick={() => {
            if (isAuthenticated) {
              navigate("/checkout");
            } else {
              setLoginOpen(true);
            }
          }}
        >
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onLoginSuccess={() => navigate("/checkout")}
      />
    </div>
  );
};

export default Cart;
