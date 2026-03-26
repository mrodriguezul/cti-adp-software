# PROMPTS

E-commerce website LPA Ecomms - User story 1.2.1

## USER PROMPT 1

@workspace #file:doc/tickets.md #file:doc/sprints/sprint-1.md #file:doc/phase-1-user-stories.md

# The Task
Update the Acceptance Criteria and details for the **Product Detail View** (User Story 1.2.2 and its associated frontend ticket) across all attached files to match the finalized UI design.

# Updates to Apply:
Please add the following explicit UI requirements to the Acceptance Criteria for the Product Detail page:
1. Include a "<- Back to Products" navigation link at the top of the page.
2. Implement a two-column layout for desktop screens.
3. Left Column: Display a large, rounded product image.
4. Right Column (Top): Display the product `sku` in small muted text, followed by the `name` as a large bold heading, and then the `description`.
5. Right Column (Pricing): Display the `price` prominently, with the `stock` count (e.g., "X in stock") stacked below it in muted text.
6. Right Column (Actions): Include a "Qty" label and a number input field (defaulting to 1), positioned next to a primary "Add to Cart" button that features a shopping cart icon.

# Output Format
Output the fully updated tables for each file in distinct markdown code blocks so I can apply the changes directly in the editor using the "Apply in Editor" button. Do not alter any other tickets or statuses.

## USER PROMPT 2

@workspace #file:backend/src/domain/repositories/IProductRepository.ts #file:backend/src/infrastructure/persistence/PrismaProductRepository.ts #file:backend/src/presentation/controllers/ProductController.ts #file:backend/src/presentation/routes/product.routes.ts

# Role & Context
You are a Senior TypeScript Engineer. We need to validate and implement the backend endpoint for a Single Product Detail View (Ticket 1.2.2.1) following our established Layered Clean Architecture.

# The Task
Implement a `GET /api/products/:id` endpoint. 

# Execution Steps by Layer:
1. **Domain (`IProductRepository.ts`):** - Add a method signature: `findById(id: number): Promise<Product | null>;`
2. **Infrastructure (`PrismaProductRepository.ts`):** - Implement `findById` using Prisma. Ensure it fetches the product where `id` matches and `status='A'`.
3. **Application (`backend/src/application/use-cases/GetProductByIdUseCase.ts`):** - Create this new use case file. It should take the `IProductRepository` via dependency injection, accept an `id`, and throw a 404-style error (or return null) if the product is not found.
4. **Presentation (`ProductController.ts` & `product.routes.ts`):**
   - Add a `getProductById` method to the controller that extracts the `id` from `req.params`, parses it to a number, calls the use case, and returns the product or a 404 status.
   - Register the `GET /products/:id` route in your routes file.

# Output Format
Please output the updated code for `IProductRepository.ts`, `PrismaProductRepository.ts`, the new `GetProductByIdUseCase.ts`, `ProductController.ts`, and `product.routes.ts` sequentially.

## USER PROMPT 3

@workspace #file:backend/src/application/use-cases/GetProductByIdUseCase.ts #file:backend/src/presentation/controllers/ProductController.ts #file:backend/src/presentation/controllers/ProductController.test.ts

# Role & Context
You are a Lead Backend SDET. We just implemented the Single Product Detail endpoint (Ticket 1.2.2.1) and need to write the corresponding unit tests following our co-located Jest testing standards.

# The Task
1. Create a new test file for the Use Case: `backend/src/application/use-cases/GetProductByIdUseCase.test.ts`.
2. Update the existing Controller test file: `backend/src/presentation/controllers/ProductController.test.ts` to include a new `describe` block for `getProductById`.

# Strict Testing Standards (Arrange-Act-Assert):
1. **`GetProductByIdUseCase.test.ts`:**
   - Mock `IProductRepository`.
   - **Test 1:** Should return the product when a valid `id` is provided and the repository finds it.
   - **Test 2:** Should return `null` (or throw a 404 error, depending on the implementation) when the repository does not find the product.

2. **`ProductController.test.ts` (Additions):**
   - Mock the Express `Request` and `Response` objects.
   - **Test 1:** Should return `200 OK` and the product JSON when a valid `req.params.id` is provided and the use case succeeds.
   - **Test 2:** Should return `404 Not Found` when the use case cannot find the product.
   - **Test 3:** Should return `400 Bad Request` if `req.params.id` is not a valid number (e.g., a string like "abc").
   - **Test 4:** Should return `500 Internal Server Error` if the use case throws an unexpected exception.

# Output Format
Output the complete TypeScript code for `GetProductByIdUseCase.test.ts`, followed by the fully updated `ProductController.test.ts` file.

## USER PROMPT 4

## USER PROMPT 5