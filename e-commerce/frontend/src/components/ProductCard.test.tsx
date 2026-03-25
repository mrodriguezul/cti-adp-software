import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types";
import defaultProductImage from "@/assets/default-product.png";

// Mock the CartContext
vi.mock("@/context/CartContext", () => ({
  useCart: () => ({
    addToCart: vi.fn(),
    items: [],
  }),
}));

// Helper function to render with Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("ProductCard", () => {
  const mockProduct: Product = {
    id: 1,
    sku: "SKU-12345",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    onhand: 15,
    image_url: "https://example.com/headphones.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render product with title, price, SKU, and stock count visible in the document", () => {
    // Arrange
    renderWithRouter(<ProductCard product={mockProduct} />);

    // Act & Assert
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.sku)).toBeInTheDocument();
    expect(screen.getByText(`${mockProduct.onhand} in stock`)).toBeInTheDocument();
  });

  it("should render fallback default image when imageUrl is null", () => {
    // Arrange
    const productWithoutImage: Product = {
      ...mockProduct,
      image_url: null as unknown as string,
    };

    renderWithRouter(<ProductCard product={productWithoutImage} />);

    // Act
    const imageElement = screen.getByAltText(productWithoutImage.name) as HTMLImageElement;

    // Assert
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.src).toContain(defaultProductImage);
  });
});
