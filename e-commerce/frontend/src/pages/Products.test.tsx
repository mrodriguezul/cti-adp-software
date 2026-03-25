import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Products from "./Products";
import { Product } from "@/types";

// Mock the useProducts hook
vi.mock("@/hooks/useProducts", () => ({
  useProducts: vi.fn(),
}));

// Mock the CartContext for ProductCard
vi.mock("@/context/CartContext", () => ({
  useCart: () => ({
    addToCart: vi.fn(),
    items: [],
  }),
}));

// Import the mocked hook
import { useProducts } from "@/hooks/useProducts";

// Helper function to render with Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Products", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display loading skeleton when isLoading is true", () => {
    // Arrange
    vi.mocked(useProducts).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    // Act
    renderWithRouter(<Products />);

    // Assert
    const loadingSkeletons = screen.getAllByRole("generic").filter((el) =>
      el.className.includes("animate-pulse")
    );
    expect(loadingSkeletons.length).toBeGreaterThan(0);
  });

  it("should display error message when isError is true", () => {
    // Arrange
    const errorMessage = "Network failed";
    vi.mocked(useProducts).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error(errorMessage),
    } as any);

    // Act
    renderWithRouter(<Products />);

    // Assert
    expect(screen.getByText("Failed to load products")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should render correct number of ProductCard elements on success", () => {
    // Arrange
    const mockProducts: Product[] = [
      {
        id: 1,
        sku: "SKU-001",
        name: "Product One",
        description: "Description for product one",
        price: 29.99,
        onhand: 10,
        image_url: "https://example.com/product1.jpg",
      },
      {
        id: 2,
        sku: "SKU-002",
        name: "Product Two",
        description: "Description for product two",
        price: 49.99,
        onhand: 5,
        image_url: "https://example.com/product2.jpg",
      },
      {
        id: 3,
        sku: "SKU-003",
        name: "Product Three",
        description: "Description for product three",
        price: 79.99,
        onhand: 8,
        image_url: "https://example.com/product3.jpg",
      },
    ];

    vi.mocked(useProducts).mockReturnValue({
      data: {
        data: mockProducts,
        hasMore: false,
        total: 3,
      },
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    // Act
    renderWithRouter(<Products />);

    // Assert
    expect(screen.getByText("Product One")).toBeInTheDocument();
    expect(screen.getByText("Product Two")).toBeInTheDocument();
    expect(screen.getByText("Product Three")).toBeInTheDocument();

    // Verify all products are rendered by checking for their names
    const productCards = mockProducts.map((p) => screen.getByText(p.name));
    expect(productCards).toHaveLength(mockProducts.length);
  });
});
