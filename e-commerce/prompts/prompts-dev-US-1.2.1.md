# PROMPTS

E-commerce website LPA Ecomms - User story 1.2.1

## USER PROMPT 1

@workspace #file:doc/sprints/sprint-1.md #file:doc/tickets.md #file:backend/prisma/schema.prisma

# Role & Context
You are a Senior TypeScript Engineer strictly following Layered Clean Architecture and Domain-Driven Design (DDD). We are executing **Ticket 1.2.1.1: [Backend] Public Product List Endpoint**.

# Architectural Mapping & Task
You must split the implementation across our existing folder structure. Do not create new root folders. Apply SOLID, DRY, and KISS principles.

1. **Domain Layer (`backend/src/domain/`):**
   - Create `repositories/IProductRepository.ts`: Define an interface for fetching paginated products (needs to return active products, total count, and a `hasMore` boolean).
   - Create `entities/Product.ts` (if necessary for typing the return layer, or just use Prisma types in the infra layer and map to a custom DTO).

2. **Infrastructure Layer (`backend/src/infrastructure/`):**
   - Create `persistence/PrismaProductRepository.ts`: Implement `IProductRepository` using the Prisma client. It must query the `Stock` (or `lpa_stock`) table where `status='A'`. Apply pagination logic (`skip` and `take`).

3. **Application Layer (`backend/src/application/`):**
   - Create `use-cases/GetProductsUseCase.ts`: This class should accept `IProductRepository` via dependency injection. It handles the business logic of validating pagination inputs (defaults to page=1, limit=12) and executing the repository call.

4. **Presentation Layer (`backend/src/presentation/`):**
   - Create `controllers/ProductController.ts`: Handle the Express `Request` and `Response`. Instantiate/inject the use case, extract query parameters, and return the JSON payload.
   - Create `routes/product.routes.ts`: Define the `GET /api/products` route and bind it to the controller.

# Output
Output the complete TypeScript code for each file sequentially. Ensure all imports use correct relative paths based on the provided folder structure.

## USER PROMPT 2

@workspace #file:frontend-static/src/main.tsx #file:frontend-static/src/App.tsx #file:frontend-static/src/index.css #file:frontend-static/tailwind.config.ts #file:frontend-static/components.json

# Role & Context
You are a Lead Frontend React Architect. Before we build specific feature pages, we need to establish the global App Shell in our active `frontend` directory using the Lovable-generated `frontend-static` directory as our exact blueprint.

# The Task
Migrate the core architectural shell, routing, providers, and global design tokens from `frontend-static` to our active `frontend` directory.

# Execution Steps:
1. **Design System & Configs:** - Copy the exact contents of `tailwind.config.ts`, `components.json` (for shadcn/ui), and `tsconfig.json` (specifically the path aliases like `@/*`) from the static folder to the active frontend folder.
   - Copy the global CSS variables and base styles from `frontend-static/src/index.css` to `frontend/src/index.css`.
2. **Core Providers & Entry:**
   - Replicate `frontend-static/src/main.tsx` into the active folder.
   - Replicate `frontend-static/src/App.tsx`. Ensure `react-router-dom` (BrowserRouter, Routes, Route) and `@tanstack/react-query` (QueryClientProvider) are set up exactly as they are in the static version.
3. **The Layout Shell:**
   - Locate the main layout component (usually `src/components/Layout.tsx`, `Navbar.tsx`, or similar) in the static folder and port it over to the active folder. 
   - Keep all `lucide-react` icons and `shadcn/ui` structural classes intact.
   - For any placeholder pages in the routes (like `/products`, `/cart`, `/login`), just create dummy placeholder components for now (e.g., `const Products = () => <div>Products Page</div>`). We will build the real ones in the upcoming tickets.

# Output Format
Please provide the terminal commands needed to install the core layout dependencies (like `react-router-dom`, `@tanstack/react-query`, `lucide-react`, `tailwindcss-animate`, etc.), followed by a summary of the files you are creating/updating. Use the "Apply in Editor" capability where possible.

## USER PROMPT 3

@workspace #file:doc/tickets.md #file:doc/sprints/sprint-1.md #file:doc/phase-1-user-stories.md

# The Task
Update the Acceptance Criteria and details for **Ticket 1.2.1.2: [Frontend] Product List View** (and its parent User Story 1.2.1) across all attached files to match the finalized UI design.

# Updates to Apply:
Please add the following explicit UI requirements to the Acceptance Criteria for the Product Card component:
1. The card must display the product image at the top.
2. Below the image, display the product `sku` in small, muted text.
3. Display the product `name` in a bold heading.
4. Display the product `description`, truncated to 2 lines.
5. In the footer of the card, display the `price` (bolded) and the `stock` count (e.g., "45 in stock") stacked on the left.
6. On the right side of the footer, include an "Add to Cart" button containing a cart icon.

# Output Format
Output the fully updated tables for each file in distinct markdown code blocks so I can apply the changes directly in the editor. Do not alter any other tickets or statuses.

## USER PROMPT 4

@workspace #file:doc/tickets.md #file:frontend-static/src/pages/Products.tsx #file:frontend-static/src/components/ProductCard.tsx 

# Role & Context
You are a Senior React/TypeScript Engineer. We are executing **Ticket 1.2.1.2: [Frontend] Product Grid UI**. 
Our active working directory is `frontend`. The `frontend-static` directory is our static design reference. 

# The Task
Migrate the Product Catalog UI from `frontend-static` into our active `frontend` directory. Replace the mock data with a real integration to our backend API (`http://localhost:3000/api/products`).

# Strict Frontend Best Practices & Architecture:
Please implement this using a clean 3-layer separation of concerns:

1. **Service Layer (`frontend/src/services/productService.ts`):**
   - Create a service function to fetch products. 
   - It must accept `page` and `limit` parameters.
   - Define strict TypeScript interfaces for the API Response (matching our backend: `data` array of products, `total`, `hasMore`).

2. **State/Hook Layer (`frontend/src/hooks/useProducts.ts`):**
   - Use `@tanstack/react-query` (`useQuery`) to manage the fetching state.
   - Handle loading and error states gracefully.

3. **Presentation Layer (`frontend/src/pages/Products.tsx` & `frontend/src/components/ProductCard.tsx`):**
   - Copy the visual layout, Tailwind classes, and `shadcn/ui` structure EXACTLY as they appear in the `frontend-static` reference files. Do not change the design.
   - Map the real API data (e.g., `sku`, `name`, `price`, `description`, `stock`) to the UI.
   - Add basic pagination controls (Next/Previous buttons) at the bottom of the grid using the `page` state.

# Output Format
Output the complete TypeScript code for `productService.ts`, `useProducts.ts`, `ProductCard.tsx`, and `Products.tsx` sequentially.

## USER PROMPT 5

@workspace #file:frontend/src/services/productService.ts #file:frontend/src/hooks/useProducts.ts #file:frontend/src/pages/Products.tsx

# The Problem
The frontend `productService` is failing because the fetch URL is hardcoded and the backend API response structure is different than expected.

# Real Backend Response:
{
    "success": true,
    "data": {
        "products": [
            {
                "id": 1001,
                "sku": "SKU-CTI-LAP-1001",
                "name": "Lenovo ThinkPad E14 Gen 5",
                "description": "14-inch business laptop...",
                "price": 1299.99,
                "onhand": 18,
                "imageUrl": null
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 12,
            "totalCount": 5,
            "hasMore": false,
            "totalPages": 1
        }
    }
}

# The Task
Refactor the frontend to correctly consume this API.

# Execution Steps:
1. **Environment Variables:** In `productService.ts`, replace the hardcoded URL with `import.meta.env.VITE_API_URL`. Ensure the fetch URL is properly constructed (e.g., `${import.meta.env.VITE_API_URL}/products?page=${page}&limit=${limit}`).
2. **TypeScript Interfaces:** Update `ProductsApiResponse` in the service to perfectly match the nested JSON structure above (`success`, `data.products`, `data.pagination`).
3. **Data Mapping:** In `fetchProducts`, extract the array from the JSON response (`json.data.products`). Make sure to map the backend's `onhand` property to the specific stock property that the `ProductCard` UI component expects.
4. **Update Hook:** Ensure `useProducts.ts` extracts the data correctly from the new service return type so `Products.tsx` can render the grid without throwing an undefined error.

# Output Format
Output the complete, updated code for `productService.ts` and `useProducts.ts`.

## USER PROMPT 6

@workspace #file:frontend/src/components/ProductCard.tsx

# The Problem
Our API currently returns `imageUrl: null` for several products. The `ProductCard` needs to handle this gracefully by displaying a default fallback image instead of a broken image link.

# The Task
Update the `ProductCard` component to use a local default image when the API does not provide one.

# Execution Steps:
1. **Import the Asset:** Add an import statement at the top of the file to pull in the default image from the assets folder: `import defaultProductImage from '@/assets/default-product.jpg';` (adjust the extension if necessary).
2. **Implement Fallback:** Update the `<img>` tag (or Next.js Image component if used by Lovable) so the `src` attribute falls back to the default image if `product.imageUrl` is falsy (null, undefined, or empty string).
   Example: `src={product.imageUrl || defaultProductImage}`
3. **Preserve UI:** Ensure all Tailwind classes (like `object-cover`, `w-full`, `h-48`, etc.) remain exactly as they are so the layout does not break.

# Output Format
Output the complete, updated code for `ProductCard.tsx`.

## USER PROMPT 7

@workspace #file:backend/src/application/use-cases/GetProductsUseCase.ts #file:backend/src/presentation/controllers/ProductController.ts #file:backend/src/domain/repositories/IProductRepository.ts

# Role & Context
You are a Lead Backend SDET (Software Development Engineer in Test). We have just completed the implementation for the Product List feature using strict Layered Clean Architecture.

# The Task
Generate comprehensive Jest unit tests for the Application and Presentation layers to fulfill the testing requirements for **Ticket 1.2.1.1**.

# Strict Testing Standards & Best Practices:
1. **Framework:** Use `jest`. Use the **Arrange-Act-Assert (AAA)** pattern for every single test block.
2. **Use Case Tests (`backend/src/application/use-cases/GetProductsUseCase.test.ts`):**
   - Mock the `IProductRepository`. Do NOT connect to a real database.
   - **Test 1:** Should successfully return paginated products and map the data correctly.
   - **Test 2:** Should use default pagination values (page 1, limit 12) if none are provided.
   - **Test 3:** Should handle an empty database gracefully (return 0 products, total 0, hasMore false).
3. **Controller Tests (`backend/src/presentation/controllers/ProductController.test.ts`):**
   - Mock the `GetProductsUseCase`.
   - Mock the Express `Request` and `Response` objects (you can use a partial mock for `req.query`, `res.status`, and `res.json`).
   - **Test 1:** Should parse query parameters, call the use case, and return a `200 OK` with the JSON payload.
   - **Test 2:** Should catch internal errors from the use case and return a `500 Internal Server Error`.

# Output Format
Please output the complete TypeScript code for both `GetProductsUseCase.test.ts` and `ProductController.test.ts` sequentially.

## USER PROMPT 8