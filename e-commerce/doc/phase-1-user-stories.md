# LPA eComms - Phase 1 (MVP) User Stories

This document outlines the user stories required to deliver the Minimum Viable Product (MVP) for the LPA eComms Web Storefront (Customer-facing application).

**Scope:** This phase focuses on the core customer shopping experience, from discovery to checkout. Admin inventory management is handled in a separate Desktop Admin application.

---

## Epic-01: Identity & Access Management (IAM)
**Goal:** Securely manage customer access to personal data and the checkout process.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **1.1.1** | **As a New Visitor**, I want to **register for an account** so that I can buy items and track my orders later. | High | 5 | 1. User can enter Email, Password, Name, and Phone.<br>2. System validates email format and password strength (min 8 chars).<br>3. System prevents duplicate email registrations.<br>4. Upon success, user is redirected to Login page with confirmation message. |
| **1.1.2** | **As a Registered Customer**, I want to **log in with my credentials** so that I can access my saved details and complete purchases. | High | 3 | 1. User enters Email and Password.<br>2. System validates credentials against the database.<br>3. On success, a secure session (JWT Token) is created and stored.<br>4. On failure, a generic "Invalid credentials" message appears. |
| **1.1.3** | **As a Security-Conscious User**, I want my **password to be hidden and encrypted** so that my account is safe even if the database is leaked. | High | 3 | 1. Passwords are never stored in plain text.<br>2. Passwords are hashed using Bcrypt before saving to the DB.<br>3. Password input field masks characters (shows dots) while typing. |
| **1.1.4** | **As a Guest Shopper**, I want to **add items to my cart and browse without logging in** so that I can make a quick purchase. | High | 5 | 1. Guest users can view products and add items to cart without registration.<br>2. Cart persists and displays item count in navbar.<br>3. When guest clicks "Checkout" or "Proceed to Checkout", system prompts: "Please log in or create an account to continue".<br>4. Guest is redirected to Login/Register page with option to continue after account creation.<br>5. After login, guest cart is preserved and merged with their account. |

---

## Epic-02: Core Catalog & Inventory System
**Goal:** Present active products to customers with accurate availability information.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **1.2.1** | **As a Shopper**, I want to **view a list of all available products** so that I can browse what the store has to offer. | High | 5 | 1. Page displays product grid with Image, Name, and Price.<br>2. Pagination or "Load More" is used for large lists.<br>3. "Out of Stock" items are visually distinct (grayed out) but still visible.<br>4. Only "Active" products are displayed (Admin-disabled items are hidden). |
| **1.2.2** | **As a Shopper**, I want to **click on a product to see its details** so that I can read the technical specs and check availability. | High | 3 | 1. Clicking a product card opens the Detail View.<br>2. View shows Full Description, Current Stock Level, Price, and "Add to Cart" button.<br>3. Price is clearly formatted (e.g., $999.00).<br>4. Product image gallery displays (if multiple images available). |

---

## Epic-03: Shopping Cart & Session State
**Goal:** Allow users to collect items for purchase and persist this selection while they continue shopping.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **1.3.1** | **As a Shopper**, I want to **add an item to my cart** so that I can purchase it later. | High | 3 | 1. Clicking "Add to Cart" adds the item to the session with quantity 1.<br>2. Cart counter in the navbar increments immediately.<br>3. System prevents adding more quantity than is available in stock (shows alert).<br>4. Cart persists across page navigation and browser refresh. |
| **1.3.2** | **As a Shopper**, I want to **view my current cart** so that I can see the total cost and what I have selected. | High | 2 | 1. Cart view lists all selected items with thumbnail, name, unit price, quantity, and row total.<br>2. "Subtotal", "Estimated Tax" (if applicable), and "Grand Total" are calculated and displayed.<br>3. Cart shows when empty with "Continue Shopping" button. |
| **1.3.3** | **As a Shopper**, I want to **change quantities or remove items** from my cart so that I can manage my budget before checking out. | Medium | 3 | 1. User can increment/decrement quantity using "+" or "-" buttons or direct input.<br>2. Setting quantity to 0 removes the item from cart.<br>3. "Remove" button permanently deletes the item from cart.<br>4. Total price updates dynamically without page reload (AJAX). |

---

## Epic-04: Checkout Engine & Order Processing
**Goal:** Convert the Shopping Cart into a finalized Order (Invoice) with a smooth, secure checkout flow.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **1.4.1** | **As a Ready-to-Buy Customer**, I want to **enter my shipping address** so that the store knows where to send my electronics. | High | 3 | 1. Checkout Step 1 displays form with fields: Address, City, State/Province, Zip/Postal Code, Country.<br>2. If user is logged in, fields pre-fill from their Profile (if saved).<br>3. Form validation requires all fields to be completed before proceeding.<br>4. "Next" button advances to payment step. |
| **1.4.2** | **As a Customer**, I want to **simulate a payment** so that I can complete the order process without using real money. | High | 5 | 1. Checkout Step 2 displays payment method selection (Credit Card, PayPal, etc.).<br>2. For Credit Card, user enters mock/test card details (e.g., Stripe Test Card 4242...).<br>3. System validates card format (16 digits, exp date, CVV).<br>4. System receives a "Success" token from the mock payment provider (simulated). |
| **1.4.3** | **As a Customer**, I want to **review my order before final submission** so that I can verify all details are correct. | High | 3 | 1. Checkout Step 3 displays Order Summary: items, quantities, prices, shipping address, and total.<br>2. User can edit cart quantities or go back to address step.<br>3. "Place Order" button submits the purchase transaction. |
| **1.4.4** | **As a Customer**, I want to **receive an Order Confirmation** so that I know my purchase was successful and I have a reference number. | High | 5 | 1. Upon payment success, user sees a "Thank You" page with order details.<br>2. Order ID (Invoice Number, e.g., `INV-20260309-001`) is prominently displayed.<br>3. User's cart is cleared and persistent state is reset.<br>4. Confirmation details are sent to user's email (backend: should include order items, total, and tracking info). |

---