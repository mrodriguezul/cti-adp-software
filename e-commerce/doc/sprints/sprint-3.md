# Sprint 3: Checkout Engine & Order Processing

## Sprint Goal
Complete the checkout engine (from address collection to order confirmation), enabling customers to finalize purchases with a smooth, secure multi-step checkout flow and receive order confirmations.

**Duration:** TBD
**Scope:** 4 User Stories | 6 Implementation Tickets | Estimated Effort: 27 Points

---

## Sprint 3 User Stories

| Status | ID | User Story | Priority | Est. (Pts) |
| :---: | :--- | :--- | :--- | :--- |
| [x] | **1.4.1** | **As a Ready-to-Buy Customer**, I want to **enter my shipping address** so that the store knows where to send my electronics. | High | 3 |
| [x] | **1.4.2** | **As a Customer**, I want to **simulate a payment** so that I can complete the order process without using real money. | High | 5 |
| [x] | **1.4.3** | **As a Customer**, I want to **review my order before final submission** so that I can verify all details are correct. | High | 3 |
| [ ] | **1.4.4** | **As a Customer**, I want to **receive an Order Confirmation** so that I know my purchase was successful and I have a reference number. | High | 5 |

---

## Sprint 3 Implementation Tickets

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Domain | Effort |
| :---: | :--- | :--- | :--- | :--- | :--- |
| [x] | **1.4.1.1** | **[Frontend] Checkout Step 1: Address Form** | **Desc:** Build shipping address collection form.<br>**AC:**<br>1. Display the logged-in customer's full name (First Name + Last Name) as a read-only label based on session data.<br>2. Form fields: Address, City, State/Province, Zip/Postal, Country.<br>3. For logged-in users: pre-fill from saved profile (if available).<br>4. Validation: all fields required, zip format validation.<br>5. The system must concatenate Address, City, State/Province, Zip/Postal, and Country into a single `clientAddress` string for the backend payload.<br>6. "Next" button blocked until valid.<br>7. Back button returns to cart. | Frontend | 3 |
| [x] | **1.4.2.1** | **[Frontend] Checkout Step 2: Mock Payment Input** | **Desc:** Build payment method and card detail form.<br>**AC:**<br>1. Payment method selection (Credit Card, PayPal icons).<br>2. Credit Card method: includes Name on Card, 16-digit Card Number, Exp Date (MM/YY), and 3-digit CVV fields.<br>3. Validation: 16-digit card number, 3-digit CVV, future exp date.<br>4. PayPal method: renders a mock "Log in to PayPal" button that acts as the continue button. When clicked, it generates a mock token (e.g., `mock_paypal_123`) and instantly advances to Step 3.<br>5. Form includes a "Continue to Review" button. On valid submit, the system generates a mock token (e.g., `mock_cc_123`), saves it to local checkout state, and advances to Step 3. | Frontend | 5 |
| [x] | **1.4.3.1** | **[Frontend] Checkout Step 3: Order Review** | **Desc:** Build order summary and confirmation page.<br>**AC:**<br>1. Cart items display matches the cart interface visually (Product image, price, quantity, row amount) but must be entirely **read-only**.<br>2. Include an "Edit Cart" link that redirects the user back to the main `/cart` page to make changes.<br>3. Display: shipping address and total.<br>4. "Edit" links allow returning to previous steps.<br>5. "Agree to Terms" checkbox required.<br>6. The "Place Order" button must be disabled if the cart is empty.<br>7. "Place Order" button calls 1.4.3.2 API.<br>8. Back button revisits payment form. | Frontend | 3 |
| [x] | **1.4.3.2** | **[API] Create Order Transaction** | **Desc:** Create `POST /api/orders` endpoint.<br>**AC:**<br>1. Auth required (Valid JWT token mandatory. Guest checkout is not supported at the API level).<br>2. Verifies cart items stock availability.<br>3. Atomic transaction: creates `lpa_invoices` and `lpa_invoice_items`.<br>4. Updates `lpa_stock.onhand` for each item.<br>5. Returns a success payload allowing the frontend to clear its local cart state.<br>6. Returns invoice ID and 201 Created.<br>7. Rollback on any failure.<br>8. **SECURITY: The backend MUST NOT trust product prices sent from the frontend. The API must independently fetch the current, authoritative price for each `productId` directly from the `lpa_stock` database table to calculate the final invoice total.** | Backend | 8 |
| [x] | **1.4.4.1** | **[Frontend] Order Confirmation Page** | **Desc:** Build success confirmation and thank you page.<br>**AC:**<br>1. Displays prominent "Order Confirmed" message.<br>2. Shows Invoice ID (e.g., INV-20260309-001).<br>3. Shows order summary: items, total, shipping address.<br>4. Displays estimated delivery date.<br>5. "Continue Shopping" button clears cart and navigates home.<br>6. For registered users: link to "View Order History".<br>7. Email confirmation sent (backend). | Frontend | 5 |
| [ ] | **1.4.4.2** | **[Backend] Order Confirmation Email** | **Desc:** Send email confirmation on successful order.<br>**AC:**<br>1. Triggered after 1.4.3.2 success.<br>2. Email includes: Invoice ID, items, total, tracking placeholder.<br>3. Recipient: customer email from `lpa_clients`.<br>4. Uses SendGrid or similar email service.<br>5. Error logging if send fails (does not block order). | Backend | 3 |

---

## Sprint Metrics

| Metric | Value |
| :--- | :--- |
| Total User Stories | 4 |
| Total Tickets | 6 |
| Total Story Points | 16 |
| Total Ticket Effort (man-days) | 27 |
| Backend Tickets | 2 |
| Frontend Tickets | 4 |

---

## Dependencies & Notes

- **Blockers:** Ticket 1.4.3.2 (Create Order Transaction API) must be completed before 1.4.4.2 (Order Confirmation Email) can proceed; frontend tickets 1.4.1.1, 1.4.2.1, and 1.4.3.1 can proceed in parallel but depend on 1.4.3.2 API being ready for integration testing
- **Architecture Decision:** Multi-step checkout flow with stateful progress tracking (address → payment → review); mock payment tokenization (no real payment processing); atomic database transactions with rollback on failure; JWT or guest token authentication for checkout
- **Security Considerations:** Backend independently fetches and validates product prices from database (prevents frontend price tampering); cart validation before invoice creation; secure storage of payment mock tokens; generic error messages for failed transactions
- **Testing Plan:** Unit tests for form validation (address, payment fields); API integration tests for order creation endpoint with stock verification, transaction rollback scenarios; E2E tests for complete checkout flow (guest and logged-in users); email service mocking for confirmation email testing
- **Definition of Done:** All AC met, code reviewed, tests passing, documented API contracts, no console errors, security best practices followed (price validation enforced server-side, transaction integrity verified)
