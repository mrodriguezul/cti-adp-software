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
