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

## USER PROMPT 3

## USER PROMPT 4