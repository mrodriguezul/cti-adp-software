import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Products = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isError, error } = useProducts(page, limit);

  const products = Array.isArray(data?.data) ? data.data : [];
  const hasMore = data?.hasMore ?? false;
  const total = data?.total ?? 0;

  const handlePrevious = () => {
    setPage((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Product Catalog</h1>
        <p className="mt-1 text-muted-foreground">
          Browse our collection of premium products
        </p>
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
          <p className="text-lg font-semibold text-destructive">
            Failed to load products
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-border bg-card"
            >
              <div className="aspect-square bg-muted" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-1/3 rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="flex justify-between">
                  <div className="h-6 w-16 rounded bg-muted" />
                  <div className="h-8 w-24 rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">
            No products available at the moment
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1}-
            {Math.min(page * limit, total)} of {total} products
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {total > limit && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button
                onClick={handlePrevious}
                disabled={page === 1}
                variant="outline"
                size="default"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Page {page} of {Math.ceil(total / limit)}
                </span>
              </div>

              <Button
                onClick={handleNext}
                disabled={!hasMore}
                variant="outline"
                size="default"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
