import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import defaultProductImage from "@/assets/default-product.png";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find((i) => i.product.id === product.id);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
      <Link to={`/products/${product.id}`} className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || defaultProductImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs font-medium text-muted-foreground">{product.sku}</p>
        <Link to={`/products/${product.id}`} className="mb-1 text-sm font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">{product.name}</Link>
        <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {product.onhand > 0 ? `${product.onhand} in stock` : "Out of stock"}
            </p>
          </div>
          <Button
            size="sm"
            disabled={product.onhand === 0}
            onClick={handleAdd}
            variant={added ? "secondary" : "default"}
          >
            {added ? (
              <Check className="mr-1 h-3.5 w-3.5" />
            ) : (
              <ShoppingCart className="mr-1 h-3.5 w-3.5" />
            )}
            {added ? "Added" : inCart ? "Add More" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
