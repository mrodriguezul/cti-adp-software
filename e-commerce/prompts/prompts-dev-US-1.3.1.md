# PROMPTS

E-commerce website LPA Ecomms - User story 1.3.1

## USER PROMPT 1

@workspace #file:frontend/src/context/CartContext.tsx #file:frontend/src/hooks/use-toast.ts

# Role & Context
You are a React UX Specialist. Our `CartContext.tsx` is functionally working, but it fails silently when a user tries to add more items than we have in stock (`product.onhand`). We need to add user feedback without changing any existing data structures.

# The Task
Inject the `useToast` hook into `CartContext.tsx` to notify the user when they hit a stock limit.

# Strict Constraints:
1. **DO NOT** change the `CartItem` interface.
2. **DO NOT** change the shape of the data saved to `localStorage`.
3. **DO NOT** change the parameters of `addToCart` or `updateQuantity`.

# Execution Steps:
1. Import the `useToast` hook: `import { useToast } from "@/hooks/use-toast";`
2. Inside the `CartProvider` component, initialize the hook: `const { toast } = useToast();`
3. In `addToCart`, right before or inside the logic that caps the quantity, add a check: if the total requested quantity exceeds `product.onhand`, trigger a toast.
   - Example: `toast({ variant: "destructive", title: "Stock Limit Reached", description: `Only ${product.onhand} available in stock.` });`
4. Do the exact same check and toast notification inside `updateQuantity` (comparing against `i.product.onhand`).

# Output Format
Output the completely updated `CartContext.tsx` file.

## USER PROMPT 2

@workspace #file:frontend/src/context/CartContext.tsx #file:frontend/src/hooks/use-toast.ts

# Role & Context
You are a Lead Frontend SDET. We just completed Ticket 1.3.1.1 (Cart State Management) and need to write unit tests for the `CartContext` and `useCart` hook using Vitest and React Testing Library.

# The Task
Generate the test file `frontend/src/context/CartContext.test.tsx`.

# Strict Testing Standards (Arrange-Act-Assert):
1. **Setup & Mocks:**
   - Mock the `use-toast` module so we can spy on the `toast` function (`vi.mock('@/hooks/use-toast', ...)`).
   - Clear `localStorage` before each test to ensure a clean slate.
   - Create a wrapper component that wraps `{children}` in the `<CartProvider>`.
   - Create a dummy `mockProduct` with `id: 1001`, `price: 100`, and `onhand: 5`.

2. **Test Cases (Use `renderHook` with the wrapper and `act`):**
   - **Test 1 (Initial State):** Assert that a fresh cart has `items: []`, `totalItems: 0` (or `cartCount: 0`), and `totalAmount: 0` (or `cartTotal: 0`).
   - **Test 2 (Add to Cart):** Call `addToCart(mockProduct, 2)`. Assert the item is added, quantity is 2, and totals are correctly calculated (amount should be 200).
   - **Test 3 (Stock Limit Validation):** - Add the `mockProduct` to the cart.
     - Try to add 10 more (which exceeds `onhand: 5`).
     - Assert that the quantity is capped at 5.
     - Assert that the mocked `toast` function was called (verifying our user feedback works).
   - **Test 4 (Update Quantity):** Add an item, then call `updateQuantity(1001, 3)`. Assert the quantity updates to 3.
   - **Test 5 (Remove Item):** Add an item, then call `removeFromCart(1001)`. Assert the cart is empty again.

# Output Format
Output the complete TypeScript code for `CartContext.test.tsx`.

## USER PROMPT 3

## USER PROMPT 4