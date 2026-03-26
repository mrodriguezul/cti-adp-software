import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import defaultProductImage from "@/assets/default-product.png";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, isError } = useProduct(Number(id));
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="animate-pulse grid gap-8 md:grid-cols-2">
          <div className="aspect-square rounded-xl bg-muted" />
          <div className="space-y-4 py-4">
            <div className="h-4 w-1/4 rounded bg-muted" />
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-20 w-full rounded bg-muted" />
            <div className="h-8 w-1/3 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="mb-2 text-2xl font-bold text-foreground">Product Not Found</h1>
        <p className="mb-6 text-muted-foreground">The product you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const inCart = items.find((i) => i.product.id === product.id);
  const productImage = product.image_url || defaultProductImage;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-muted">
          <img
            src={productImage}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col py-2">
          <p className="mb-1 text-sm font-medium text-muted-foreground">{product.sku}</p>
          <h1 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">{product.name}</h1>
          <p className="mb-6 text-muted-foreground leading-relaxed">{product.description}</p>

          <p className="mb-1 text-3xl font-bold text-foreground">${product.price.toFixed(2)}</p>
          <p className="mb-6 text-sm text-muted-foreground">
            {product.onhand > 0 ? `${product.onhand} in stock` : "Out of stock"}
          </p>

          <div className="mt-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="qty" className="text-sm font-medium text-foreground">Qty</label>
              <Input
                id="qty"
                type="number"
                min={1}
                max={product.onhand}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.onhand, parseInt(e.target.value) || 1)))}
                className="h-10 w-20"
                disabled={product.onhand === 0}
              />
            </div>
            <Button
              size="lg"
              disabled={product.onhand === 0}
              onClick={handleAdd}
              variant={added ? "secondary" : "default"}
              className="flex-1"
            >
              {added ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <ShoppingCart className="mr-2 h-4 w-4" />
              )}
              {added ? "Added to Cart" : inCart ? "Add More" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

