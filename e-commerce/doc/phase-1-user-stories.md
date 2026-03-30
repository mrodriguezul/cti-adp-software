# LPA eComms - Phase 1 (MVP) User Stories

This document outlines the user stories required to deliver the Minimum Viable Product (MVP) for the LPA eComms Web Storefront (Customer-facing application).

**Scope:** This phase focuses on the core customer shopping experience, from discovery to checkout. Admin inventory management is handled in a separate Desktop Admin application.

---

## Epic-01: Identity & Access Management (IAM)
**Goal:** Securely manage customer access to personal data and the checkout process.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :---: | :--- | :--- | :--- | :--- | :--- |
| [ ] | **1.1.1** | **As a New Visitor**, I want to **register for an account** so that I can buy items and track my orders later. | High | 5 | 1. User can enter First Name, Last Name, Email, Password, Confirm Password, Phone (optional), and Address (optional).<br>2. System validates that first name and last name are provided (required fields).<br>3. System validates email format and prevents duplicate email registrations.<br>4. System validates password strength (minimum 8 characters).<br>5. System validates that Confirm Password matches Password.<br>6. Upon success, user is redirected to Login page with confirmation message and new account can log in immediately. |
| [ ] | **1.1.2** | **As a Registered Customer**, I want to **log in with my credentials** so that I can access my saved details and complete purchases. | High | 3 | 1. User enters Email and Password.<br>2. System validates credentials against the database.<br>3. On success, a secure session (JWT Token) is created and stored.<br>4. On failure, a generic "Invalid credentials" message appears. |
| [x] | **1.1.3** | **As a Security-Conscious User**, I want my **password to be hidden and encrypted** so that my account is safe even if the database is leaked. | High | 3 | 1. Passwords are never stored in plain text.<br>2. Passwords are hashed using Bcrypt before saving to the DB.<br>3. Password input field masks characters (shows dots) while typing. |
| [ ] | **1.1.4** | **As a Guest Shopper**, I want to **add items to my cart and browse without logging in** so that I can make a quick purchase. | High | 5 | 1. Guest users can view products and add items to cart without registration.<br>2. Cart persists and displays item count in navbar.<br>3. When guest clicks "Checkout" or "Proceed to Checkout", system prompts: "Please log in or create an account to continue".<br>4. Guest is redirected to Login/Register page with option to continue after account creation.<br>5. After login, guest cart is preserved and merged with their account. |

---

## Epic-02: Core Catalog & Inventory System
**Goal:** Present active products to customers with accurate availability information.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :---: | :--- | :--- | :--- | :--- | :--- |
| [x] | **1.2.1** | **As a Shopper**, I want to **view a list of all available products** so that I can browse what the store has to offer. | High | 5 | 1. Page displays product grid (4 cols desktop, 2 mobile).<br>2. Each product card displays: image at top, `sku` in small muted text, `name` as bold heading, `description` truncated to 2 lines.<br>3. Card footer shows: `price` (bolded) and `stock` count (e.g., "45 in stock") stacked on left; "Add to Cart" button with cart icon on right.<br>4. "Out of Stock" items are visually distinct (grayed out) but still visible.<br>5. Only "Active" products are displayed (Admin-disabled items are hidden).<br>6. Pagination or "Load More" is used for large lists. |
| [x] | **1.2.2** | **As a Shopper**, I want to **click on a product to see its details** so that I can read the technical specs and check availability. | High | 3 | 1. Include a "<- Back to Products" navigation link at the top of the page.<br>2. Implement a two-column layout for desktop screens.<br>3. Left Column: Display a large, rounded product image.<br>4. Right Column (Top): Display the product `sku` in small muted text, followed by the `name` as a large bold heading, and then the `description`.<br>5. Right Column (Pricing): Display the `price` prominently, with the `stock` count (e.g., "X in stock") stacked below it in muted text.<br>6. Right Column (Actions): Include a "Qty" label and a number input field (defaulting to 1), positioned next to a primary "Add to Cart" button that features a shopping cart icon.<br>7. Price is clearly formatted (e.g., $999.00). |

---

## Epic-03: Shopping Cart & Session State
**Goal:** Allow users to collect items for purchase and persist this selection while they continue shopping.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :---: | :--- | :--- | :--- | :--- | :--- |
| [x] | **1.3.1** | **As a Shopper**, I want to **add an item to my cart** so that I can purchase it later. | High | 3 | 1. Clicking "Add to Cart" adds the item to the session with quantity 1.<br>2. Cart counter in the navbar increments immediately.<br>3. System prevents adding more quantity than is available in stock (shows alert).<br>4. Cart persists across page navigation and browser refresh. |
| [x] | **1.3.2** | **As a Shopper**, I want to **view my current cart** so that I can see the total cost and what I have selected. | High | 2 | 1. Render a table-style layout with headers: Product, Price, Qty, Amount.<br>2. Product Column: Display a rounded thumbnail image, the product name, and the product `sku` positioned underneath the name in small, muted text.<br>3. Interactive Controls: Display a number input field for the Quantity, and a red trash can icon on the far right of the row for item removal.<br>4. Totals: Calculate and display the row "Amount" (Price * Qty) in bold. At the bottom of the list, display a single "Total" row with the final sum.<br>5. Primary Action: Render a right-aligned "Proceed to Checkout" primary button featuring a right-arrow icon below the cart total.<br>6. Empty State: If the cart is empty, display a friendly message with a "Continue Shopping" button. |
| [x] | **1.3.3** | **As a Shopper**, I want to **change quantities or remove items** from my cart so that I can manage my budget before checking out. | Medium | 3 | 1. Use a native HTML number input field for quantity adjustment (built-in up/down arrows).<br>2. Input validation enforces `min="1"` (preventing 0 or negative inputs) and `max={stockLimit}`.<br>3. Clicking the dedicated "Remove" (Trash) button deletes the item from the cart.<br>4. Cart totals update immediately via React Context without a page reload.<br>5. Context logic and UI notifications (Toasts) prevent users from exceeding available `onhand` stock limits. |

---

## Epic-04: Checkout Engine & Order Processing
**Goal:** Convert the Shopping Cart into a finalized Order (Invoice) with a smooth, secure checkout flow.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :---: | :--- | :--- | :--- | :--- | :--- |
| [ ] | **1.4.1** | **As a Ready-to-Buy Customer**, I want to **enter my shipping address** so that the store knows where to send my electronics. | High | 3 | 1. Checkout Step 1 displays form with fields: Address, City, State/Province, Zip/Postal Code, Country.<br>2. If user is logged in, fields pre-fill from their Profile (if saved).<br>3. Form validation requires all fields to be completed before proceeding.<br>4. "Next" button advances to payment step. |
| [ ] | **1.4.2** | **As a Customer**, I want to **simulate a payment** so that I can complete the order process without using real money. | High | 5 | 1. Checkout Step 2 displays payment method selection (Credit Card, PayPal, etc.).<br>2. For Credit Card, user enters mock/test card details (e.g., Stripe Test Card 4242...).<br>3. System validates card format (16 digits, exp date, CVV).<br>4. System receives a "Success" token from the mock payment provider (simulated). |
| [ ] | **1.4.3** | **As a Customer**, I want to **review my order before final submission** so that I can verify all details are correct. | High | 3 | 1. Checkout Step 3 displays Order Summary: items, quantities, prices, shipping address, and total.<br>2. User can edit cart quantities or go back to address step.<br>3. "Place Order" button submits the purchase transaction.<br>4. **SECURITY: Backend independently fetches current prices from `lpa_stock` table (never trusts frontend prices) to prevent client-side tampering of order totals.** |
| [ ] | **1.4.4** | **As a Customer**, I want to **receive an Order Confirmation** so that I know my purchase was successful and I have a reference number. | High | 5 | 1. Upon payment success, user sees a "Thank You" page with order details.<br>2. Order ID (Invoice Number, e.g., `INV-20260309-001`) is prominently displayed.<br>3. User's cart is cleared and persistent state is reset.<br>4. Confirmation details are sent to user's email (backend: should include order items, total, and tracking info). |

---