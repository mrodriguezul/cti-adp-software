# PROMPTS

E-commerce website LPA Ecomms - User story 1.3.2

## USER PROMPT 1

@workspace #file:doc/tickets.md #file:doc/sprints/sprint-1.md #file:doc/phase-1-user-stories.md

# The Task
Update the Acceptance Criteria and details for the **Shopping Cart Page** (User Story 1.3.2 and Ticket 1.3.2.1) across all attached files to match the finalized UI design.

# Updates to Apply:
Please replace the existing Acceptance Criteria for Ticket 1.3.2.1 and Story 1.3.2 with the following explicit UI requirements:
1. Render a table-style layout with headers: Product, Price, Qty, Amount.
2. Product Column: Display a rounded thumbnail image, the product name, and the product `sku` positioned underneath the name in small, muted text.
3. Interactive Controls: Display a number input field for the Quantity, and a red trash can icon on the far right of the row for item removal.
4. Totals: Calculate and display the row "Amount" (Price * Qty) in bold. At the bottom of the list, display a single "Total" row with the final sum.
5. Primary Action: Render a right-aligned "Proceed to Checkout" primary button featuring a right-arrow icon below the cart total.
6. Empty State: If the cart is empty, display a friendly message with a "Continue Shopping" button.

# Output Format
Output the fully updated tables for each file in distinct markdown code blocks so I can apply the changes directly in the editor using the "Apply in Editor" button. Do not alter any other tickets or statuses.

## USER PROMPT 2

@workspace #file:frontend-static/src/pages/Cart.tsx #file:frontend/src/pages/Cart.tsx #file:frontend/src/context/CartContext.tsx

# Role & Context
You are a Lead Frontend React Architect. We are executing **Ticket 1.3.2.1: [Frontend] Shopping Cart Page**.
Instead of building the UI from scratch, we want to reuse the exact visual layout from the `frontend-static/src/pages/Cart.tsx` template, but wire it up to our real `CartContext`.

# The Task
Migrate the static template into `frontend/src/pages/Cart.tsx` and bind it to the real `useCart` hook.

# Execution Steps:
1. **Copy UI Structure:** Use the exact JSX structure, Tailwind classes, and `shadcn/ui` imports from the `frontend-static` version.
2. **Bind Context:** Import `useCart` from our context and extract `items`, `updateQuantity`, `removeFromCart`, and `totalAmount`.
3. **Map Real Data:** Replace the hardcoded cart items with a `.map()` over our real `items` array.
   - *Crucial Data Mapping:* Remember that our context stores the full product object. You must map to `item.product.name`, `item.product.sku`, `item.product.price`, and `item.product.imageUrl`.
4. **Wire Up Interactivity:**
   - **Quantity Input:** Bind the input value to `item.quantity`. On change, call `updateQuantity(item.product, newQuantity)`. Ensure the max attribute is set to `item.product.onhand`.
   - **Remove Button:** Bind the trash icon button's `onClick` to call `removeFromCart(item.product.id)`.
5. **Totals:** Replace the hardcoded total with the dynamic `totalAmount` from the context.
6. **Image Fallback:** Just like we did on the product grid, import `@/assets/default-product.jpg` and use it if `item.product.imageUrl` is null.

# Output Format
Output the complete, production-ready TypeScript code for `frontend/src/pages/Cart.tsx`.

## USER PROMPT 3

@workspace #file:frontend/src/pages/Cart.tsx #file:frontend/src/context/CartContext.tsx

# Role & Context
You are a Lead Frontend SDET. We have just completed Ticket 1.3.2.1 (Shopping Cart Page) and need to write enterprise-grade unit tests using Vitest and React Testing Library.

# The Task
Generate the test file `frontend/src/pages/Cart.test.tsx` using the co-location standard.

# Strict Testing Standards (Arrange-Act-Assert):
1. **Setup & Mocks:**
   - Mock the `useCart` hook from our `CartContext` so we can control the cart state without needing the actual context provider logic.
   - You MUST wrap the `Cart` component in a `<MemoryRouter>` during the `render` step, otherwise the "Continue Shopping" or "Proceed to Checkout" navigation elements will throw errors.
   - Set up mock functions: `const mockUpdateQuantity = vi.fn(); const mockRemoveFromCart = vi.fn();`

2. **Test Cases:**
   - **Test 1 (Empty State):** Mock `useCart` to return `{ items: [], totalAmount: 0 }`. Assert that the empty state message ("Your cart is empty") and the "Continue Shopping" link are visible.
   - **Test 2 (Populated State):** Mock `useCart` to return an array with at least two different products (e.g., a Laptop and Headphones). Assert that the product names, formatted prices, and the `totalAmount` are rendered in the document.
   - **Test 3 (Update Quantity):** Render a populated cart. Find the number input for the first item. Use `fireEvent.change` or `userEvent.type` to change the quantity to a new valid number. Assert that `mockUpdateQuantity` was called with the correct product object and the new quantity.
   - **Test 4 (Remove Item):** Render a populated cart. Find the trash can (delete) button for an item and click it. Assert that `mockRemoveFromCart` was called with the correct product ID.

# Output Format
Output the complete, production-ready TypeScript code for `Cart.test.tsx`.
