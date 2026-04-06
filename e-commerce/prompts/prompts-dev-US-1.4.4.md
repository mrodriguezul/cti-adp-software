# PROMPTS

E-commerce website LPA Ecomms - User story 1.4.4

## USER PROMPT 1

@workspace #file:frontend/src/pages/CheckoutComplete.tsx #file:frontend/src/context/AuthContext.tsx

# Role & Context
You are a Lead Frontend React Architect. We are updating our existing `CheckoutComplete.tsx` page to fulfill Ticket 1.4.4.1 (Order Confirmation Page). 

# The Task
Enhance the static `CheckoutComplete.tsx` component to dynamically display the invoice data passed from the Checkout process and satisfy the ticket's Acceptance Criteria.

# Execution Steps:

1. **Setup & Data Extraction:**
   - Import `useLocation` and `useNavigate` from `react-router-dom`.
   - Import `useAuth` from your auth context.
   - Import the `CheckCircle` icon from `lucide-react`.
   - Extract the invoice data: `const { state } = useLocation(); const invoice = state?.invoice;`
   - *Security/UX:* Add a `useEffect`. If `!invoice` exists (meaning the user just navigated to `/checkout-complete` directly without actually checking out), instantly redirect them to the home page `/`.

2. **UI Layout (Success View):**
   - Update the container to be a centered, visually pleasing success card.
   - Add the `CheckCircle` icon (styled green, large) above the "Order Complete" heading.
   - Prominently display the Order ID: `invoice.invoiceNumber`.
   - Display the Total Amount: `invoice.amount` (format it as currency).
   - Add the required hardcoded text: "Estimated Delivery: 7 business days" in a muted text color.

3. **Navigation Actions:**
   - Add a primary "Continue Shopping" button that calls `Maps('/products')`.
   - Use `useAuth()` to check if the user is logged in. If they are, render a secondary button/link below it that says "View Order History" pointing to `/profile/orders`.

# Output Format
Output the complete, updated TypeScript code for `CheckoutComplete.tsx`.

## USER PROMPT 2

@workspace #file:frontend/src/pages/CheckoutComplete.tsx #file:frontend/src/context/AuthContext.tsx

# Role & Context
You are a Lead Frontend SDET. We just updated `CheckoutComplete.tsx` to handle the dynamic order success state (Ticket 1.4.4.1) and need to write isolated UI tests using Vitest and React Testing Library.

# The Task
Create `frontend/src/pages/CheckoutComplete.test.tsx`.

# Execution Steps:

1. **Setup & Mocks:**
   - Mock `react-router-dom` to control `useLocation` and `useNavigate`.
   - Mock `useAuth` from the Auth context.

2. **Test 1: Unauthorised/Direct Access Redirect:**
   - Mock `useLocation` to return an empty state (`{ state: null }`).
   - Render the component.
   - Assert that the `useEffect` immediately called `Maps('/')`.

3. **Test 2: Valid Order Rendering (Guest User):**
   - Mock `useLocation` to return valid invoice data: `{ state: { invoice: { invoiceNumber: 'INV-123', amount: 99.99 } } }`.
   - Mock `useAuth` to return `{ isAuthenticated: false }`.
   - Assert that the "Order Complete" heading is visible.
   - Assert that the specific `invoiceNumber` ('INV-123') is displayed.
   - Assert that the "Estimated Delivery: 7 business days" text is present.
   - Assert the "Continue Shopping" button is present.
   - Assert the "View Order History" button is **not** present.

4. **Test 3: Valid Order Rendering (Authenticated User):**
   - Use the same valid invoice data.
   - Mock `useAuth` to return `{ isAuthenticated: true }`.
   - Assert that the "View Order History" link/button **is** rendered.

5. **Test 4: Navigation Interaction:**
   - Render with valid data. 
   - Simulate a user click on the "Continue Shopping" button.
   - Assert that `Maps('/products')` (or the respective homepage route) was called.

# Output Format
Output the complete, production-ready TypeScript code for `CheckoutComplete.test.tsx` in a single markdown code block.

## USER PROMPT 3