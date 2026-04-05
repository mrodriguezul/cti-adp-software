# PROMPTS

E-commerce website LPA Ecomms - User story 1.4.3

## USER PROMPT 1

@workspace #file:doc/tickets.md #file:doc/sprints/sprint-3.md

# Role & Context
You are a Lead Agile Project Manager. We are refining **Ticket 1.4.3.2 ([API] Create Order Transaction)** before development. Because we implemented a forced login modal in Sprint 2, strict authentication is now mandatory for checkout, and the backend no longer manages the cart state (it is in LocalStorage).

# The Task
Update the Acceptance Criteria for Ticket 1.4.3.2 in both `tickets.md` and `sprint-3.md` to reflect these architectural changes.

# Updates to Apply:
1. Update AC 1: Change "Auth required (or guest checkout with token)" to strictly "Auth required (Valid JWT token mandatory. Guest checkout is not supported at the API level)."
2. Update AC 5: Change "Clears cart on success" to "Returns a success payload allowing the frontend to clear its local cart state."
3. Leave all other ACs (stock verification, atomic transactions, authoritative pricing) exactly as they are.

# Output Format
Output the fully updated markdown sections for Ticket 1.4.3.2 for both files in distinct markdown code blocks.

## USER PROMPT 2

@workspace #file:backend/src/domain/entities/Client.ts #file:backend/src/domain/entities/Product.ts 

# Role & Context
You are a Lead Backend API Architect. We are executing **Ticket 1.4.3.2 ([API] Create Order Transaction)**.
We need to create a secure, atomic checkout endpoint. 

# The Task
Implement the Auth Middleware, the Order Repository (with a Prisma `$transaction`), the Create Order Use Case, and the Order Controller.

# Execution Steps by Layer:

1. **Security Middleware (`backend/src/presentation/middleware/authMiddleware.ts`):**
   - Create an Express middleware `requireAuth`.
   - Extract the token from the `Authorization: Bearer <token>` header.
   - Use `jsonwebtoken` to verify the token using `process.env.JWT_SECRET`.
   - Attach the decoded payload (which contains `id`) to `req.user`.
   - If missing or invalid, return `401 Unauthorized`.

2. **Repository Layer (`backend/src/domain/repositories/IOrderRepository.ts` & `backend/src/infrastructure/persistence/PrismaOrderRepository.ts`):**
   - **Interface:** Define `createOrder(clientId: number, clientAddress: string, items: { productId: number, quantity: number }[]): Promise<any>`.
   - **Implementation:** Use `prisma.$transaction` to ensure atomicity. Inside the transaction:
     - Step A: Fetch the `Client` to snapshot their `firstname` and `lastname`.
     - Step B: Loop through the `items`. For each, fetch the `Stock`. 
     - Step C: If `stock.onhand < item.quantity`, throw an Error ("Insufficient stock for " + stock.name).
     - Step D: Deduct the stock: `prisma.stock.update({ where: { id }, data: { onhand: { decrement: quantity } } })`.
     - Step E: Calculate the subtotal for each item (`stock.price * quantity`) and accumulate the `totalAmount`.
     - Step F: Generate an `invoiceNumber` (e.g., `INV-${Date.now()}-${clientId}`).
     - Step G: Create the `Invoice` (with status 'U') and its nested `InvoiceItem`s in one `prisma.invoice.create()` call. Snapshot `clientName`, `clientAddress`, `stockName`, and `price`.
     - Return the created invoice.

3. **Application Layer (`backend/src/application/use-cases/CreateOrderUseCase.ts`):**
   - Inject `IOrderRepository`.
   - Implement `execute(payload: { clientId: number, clientAddress: string, paymentToken: string, items: { productId: number, quantity: number }[] })`.
   - Add a mock payment check: if `!paymentToken`, throw an Error("Payment authorization missing").
   - Call `repository.createOrder` and return the result.

4. **Presentation Layer (`backend/src/presentation/controllers/OrderController.ts` & `backend/src/presentation/routes/order.routes.ts`):**
   - **Controller:** Create `createOrder` method. Extract `clientId` from `req.user.id`. Extract `clientAddress`, `paymentToken`, and `items` from `req.body`. Call the Use Case. Return `201 Created` with `{ success: true, data: { invoiceId: result.id, invoiceNumber: result.invoiceNumber } }`. Catch and return `400` for stock errors, `500` otherwise.
   - **Routes:** Create `order.routes.ts`. Define `router.post('/orders', requireAuth, orderController.createOrder)`. Export and wire it up in your main routing file (`index.ts` or `app.ts`).

# Output Format
Output the code sequentially in distinct markdown blocks: `authMiddleware.ts`, `IOrderRepository.ts`, `PrismaOrderRepository.ts`, `CreateOrderUseCase.ts`, `OrderController.ts`, and `order.routes.ts`.

## USER PROMPT 3

@workspace #file:backend/src/presentation/middleware/authMiddleware.ts #file:backend/src/application/use-cases/CreateOrderUseCase.ts #file:backend/src/presentation/controllers/OrderController.ts

# Role & Context
You are a Lead Backend SDET. We just completed the Create Order endpoint (Ticket 1.4.3.2) and need to write isolated unit tests using Jest.

# The Task
Generate unit tests for the Auth Middleware, Create Order Use Case, and Order Controller.

# Execution Steps:

1. **Middleware Tests (`backend/src/presentation/middleware/authMiddleware.test.ts`):**
   - Mock `jsonwebtoken`.
   - Mock Express `req`, `res`, and `next`.
   - **Test 1:** Should call `next()` and attach `req.user` if a valid Bearer token is provided.
   - **Test 2:** Should return `401 Unauthorized` if no token is provided.
   - **Test 3:** Should return `401 Unauthorized` if the token is invalid or expired.

2. **Use Case Tests (`backend/src/application/use-cases/CreateOrderUseCase.test.ts`):**
   - Mock `IOrderRepository`.
   - **Test 1:** Should throw an Error if `paymentToken` is missing.
   - **Test 2:** Should call `repository.createOrder` with the correct mapped payload and return the resulting invoice on success.

3. **Controller Tests (`backend/src/presentation/controllers/OrderController.test.ts`):**
   - Mock `CreateOrderUseCase.execute`.
   - Mock Express `req` (including `req.user.id` from auth middleware) and `res`.
   - **Test 1:** Should return `201 Created` with the invoice data on successful order creation.
   - **Test 2:** Should return `400 Bad Request` if the Use Case throws a stock error or missing payment token error.
   - **Test 3:** Should return `500 Server Error` for unexpected repository failures.

# Output Format
Output the complete TypeScript code for `authMiddleware.test.ts`, `CreateOrderUseCase.test.ts`, and `OrderController.test.ts` in distinct markdown code blocks.

## USER PROMPT 4

@workspace #file:frontend/src/context/CartContext.tsx #file:frontend/src/context/AuthContext.tsx 

# Role & Context
You are a Lead Frontend React Architect. We are building the multi-step Checkout engine (Tickets 1.4.1.1, 1.4.2.1, and 1.4.3.1). 
We must follow strict Separation of Concerns: API calls go in services, and UI/State go in pages.

# The Task
1. Create `frontend/src/services/orderService.ts` to handle the API call.
2. Create `frontend/src/pages/Checkout.tsx` as a stateful parent component managing 3 step sub-components (Address, Payment, Review).

# Execution Steps:

### 1. API Service (`frontend/src/services/orderService.ts`)
- Create `createOrder(payload: { clientAddress: string; paymentToken: string; items: { productId: number; quantity: number }[] })`.
- Fetch `POST ${API_URL}/checkout/orders`. Include the `Authorization: Bearer <token>` header from LocalStorage (`lpa_auth`).
- Throw an error if `!response.ok`. Return the parsed `data` object on success.

### 2. Main Page Setup (`frontend/src/pages/Checkout.tsx`)
- Import `useCart` (for items, total, and `clearCart`) and `useAuth` (for the user's JWT and profile).
- If the cart is empty, render a friendly message and a button navigating to `/products`.
- Manage state for `step` (1, 2, or 3), `clientAddress` (string), and `paymentToken` (string).
- Define 3 internal sub-components: `AddressStep`, `PaymentStep`, and `ReviewStep` to render conditionally based on `step`.

### 3. Sub-Component: `AddressStep`
- Read-only label showing the logged-in user's Full Name (from `useAuth` context).
- Use `zod` and `react-hook-form` for: Address, City, State/Province, Zip/Postal, Country.
- Make all fields required.
- Pre-fill fields if the user object has a saved address (optional).
- On valid submit: Concatenate the fields into a single string (e.g., "123 St, City, State, Zip, Country"), call `setClientAddress()`, and `setStep(2)`.

### 4. Sub-Component: `PaymentStep`
- Use Shadcn Tabs or Radio Group to toggle between "Credit Card" and "PayPal".
- **Credit Card:** Zod schema for Name on Card, Card Number (16 chars), Exp (MM/YY), CVV (3 chars). Include a "Continue to Review" submit button.
- **PayPal:** A mock "Log in to PayPal" button.
- On CC submit OR PayPal click: Call `setPaymentToken('mock_token_' + Date.now())` and `setStep(3)`.
- Include a "Back" button calling `setStep(1)`.

### 5. Sub-Component: `ReviewStep`
- Display `clientAddress`.
- Render a read-only list of cart items (Image, Name, Price, Qty, Subtotal) matching the Cart visual style. 
- Include an "Edit Cart" `<Link>` pointing to `/cart`.
- Add a "Terms and Conditions" required checkbox (via local state or form).
- "Place Order" button logic:
  - Map `cartItems` into the required API format: `[{ productId, quantity }]`.
  - Call `await orderService.createOrder({ clientAddress, paymentToken, items })`.
  - On success: call `clearCart()`, trigger a success `toast`, and `Maps('/checkout-complete', { state: { invoice: result } })`.
  - On error: trigger a destructive `toast`.
- Include a "Back" button calling `setStep(2)`.

# Output Format
Output `orderService.ts` first, followed by the complete `Checkout.tsx` code in distinct markdown code blocks.

## USER PROMPT 5

@workspace #file:frontend/src/pages/Checkout.tsx

# Role & Context
You are a Lead Frontend React Architect. Our multi-step checkout form works, but it loses user input when navigating backwards because the step components unmount and lose their local `react-hook-form` state.

# The Task
Refactor `Checkout.tsx` to preserve the raw form data in the parent component's state and pass it down as `defaultValues`.

# Execution Steps:

1. **Update Parent State (`Checkout` component):**
   - Add state to store the raw form data objects: 
     `const [addressData, setAddressData] = useState<any>(null);`
     `const [paymentData, setPaymentData] = useState<any>(null);`

2. **Update `AddressStep` Component:**
   - Add a prop: `initialData?: any`.
   - In the `useForm` initialization, set `defaultValues: initialData || { address: '', city: '', ... }`.
   - In the `onSubmit` function, before calling `setStep(2)`, add `setAddressData(data)`. (Keep your existing concatenation logic for `clientAddress` as well).

3. **Update `PaymentStep` Component:**
   - Add a prop: `initialData?: any`.
   - In the `useForm` initialization for the credit card, set `defaultValues: initialData || { cardNumber: '', ... }`.
   - In the `onSubmit` function, before calling `setStep(3)`, add `setPaymentData(data)`.

4. **Update Parent Render Logic:**
   - When rendering `<AddressStep />`, pass the prop: `initialData={addressData}`.
   - When rendering `<PaymentStep />`, pass the prop: `initialData={paymentData}`.

# Output Format
Output the updated `Checkout.tsx` code. You only need to show the modified sections if it is too long, but ensure the prop wiring and state changes are crystal clear.

## USER PROMPT 6

@workspace #file:frontend/src/services/orderService.ts #file:frontend/src/pages/Checkout.tsx

# Role & Context
You are a Lead Frontend SDET. We have completed the multi-step `Checkout.tsx` flow and the `orderService.ts` API wrapper. We need to write isolated unit and integration tests using Vitest and React Testing Library.

# The Task
Create `frontend/src/services/orderService.test.ts` and `frontend/src/pages/Checkout.test.tsx`.

# Execution Steps:

### 1. Service Tests (`frontend/src/services/orderService.test.ts`)
- Mock the global `fetch` function.
- **Test 1:** Should successfully call the endpoint with `POST`, the `Authorization` header, and the correct body payload, returning the parsed data.
- **Test 2:** Should throw an error if the response is not `ok`.

### 2. Component Tests Setup (`frontend/src/pages/Checkout.test.tsx`)
- Mock `useAuth` to return a logged-in user with a mock token.
- Mock `useCart` to return a fake cart with 1 item, a total amount, and a mock `clearCart` function.
- Mock `useNavigate` from `react-router-dom`.
- Mock `orderService.createOrder` to resolve successfully with a mock invoice ID.
- Mock `useToast` from Shadcn UI.

### 3. Component Test Cases (`Checkout.test.tsx`)
- **Test 1: Empty Cart Redirect:** If `useCart` returns an empty cart, it should display the empty cart message and not render the checkout forms.
- **Test 2: Full Happy Path (Step 1 to Step 3):**
  - *Step 1:* Render `Checkout`. Fill out the Address form fields. Click "Next".
  - *Step 2:* Verify it moved to Payment Step. Fill out the Credit Card form (or click the mock PayPal button). Click "Continue to Review".
  - *Step 3:* Verify it moved to Review Step. Check the "Terms and Conditions" checkbox. Click "Place Order".
  - *Assertion:* Verify `orderService.createOrder` was called with the concatenated address, payment token, and mapped cart items. Verify `clearCart` was called, and `Maps` was called to `/checkout-complete`.
- **Test 3: State Retention (The "Back" Button):**
  - Fill out Step 1 and advance to Step 2. 
  - Click the "Back" button to return to Step 1.
  - Verify that the input fields in Step 1 still contain the data that was entered previously.

# Output Format
Output the complete TypeScript code for `orderService.test.ts` followed by `Checkout.test.tsx` in distinct markdown code blocks.
