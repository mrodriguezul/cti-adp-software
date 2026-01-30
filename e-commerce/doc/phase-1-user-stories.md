# LPA eComms - Phase 1 (MVP) User Stories

This document outlines the user stories required to deliver the Minimum Viable Product (MVP) for the LPA eComms system.

## Epic-01: Identity & Access Management (IAM)
**Goal:** Securely manage customer access to personal data and the checkout process.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **1.1.1** | **As a New Visitor**, I want to **register for an account** so that I can buy items and track my orders later. | High | 5 | 1. User can enter Email, Password, Name, and Phone.<br>2. System validates email format and password strength (min 8 chars).<br>3. System prevents duplicate email registrations.<br>4. Upon success, user is redirected to Login. |
| **1.1.2** | **As a Registered Customer**, I want to **log in with my credentials** so that I can access my saved details and complete purchases. | High | 3 | 1. User enters Email and Password.<br>2. System validates credentials against the database.<br>3. On success, a secure session (Token) is started.<br>4. On failure, a generic "Invalid credentials" message appears. |
| **1.1.3** | **As a Security-Conscious User**, I want my **password to be hidden and encrypted** so that my account is safe even if the database is leaked. | High | 3 | 1. Passwords are never stored in plain text.<br>2. Passwords are hashed (e.g., Bcrypt) before saving to the DB.<br>3. Input field masks characters (shows dots) while typing. |

---

## Epic-02: Core Catalog & Inventory System
**Goal:** Present products to customers and allow Admins to manage the `lpa_stock` inventory.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **1.2.1** | **As a Shopper**, I want to **view a list of all available products** so that I can browse what the store has to offer. | High | 5 | 1. Page displays product grid with Image, Name, and Price.<br>2. Pagination or "Load More" is used for large lists.<br>3. "Out of Stock" items are visually distinct but still visible. |
| **1.2.2** | **As a Shopper**, I want to **click on a product to see its details** so that I can read the technical specs and check availability. | High | 3 | 1. Clicking a product card opens the Detail View.<br>2. View shows Description, Stock Level, and "Add to Cart" button.<br>3. Price is clearly formatted (e.g., $999.00). |
| **1.2.3** | **As an Inventory Manager**, I want to **add new electronics to the system** so that customers can buy them. | High | 5 | 1. Admin can input Name, Description, Price, Stock Qty, and Image URL.<br>2. System saves the new record to `lpa_stock`.<br>3. New item immediately appears on the Web Storefront. |
| **1.2.4** | **As an Inventory Manager**, I want to **update product details (Price/Stock)** so that the store information is always accurate. | Medium | 3 | 1. Admin can search for a product by ID or Name.<br>2. Admin can edit Price and Quantity fields.<br>3. Changes are saved and reflected instantly. |

---

## Epic-03: Shopping Cart & Session State
**Goal:** Allow users to collect items for purchase and persist this selection while they continue shopping.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **1.3.1** | **As a Shopper**, I want to **add an item to my cart** so that I can purchase it later. | High | 3 | 1. Clicking "Add to Cart" adds the item to the session.<br>2. Cart counter in the navbar increments.<br>3. System prevents adding more quantity than is available in stock. |
| **1.3.2** | **As a Shopper**, I want to **view my current cart** so that I can see the total cost and what I have selected. | High | 2 | 1. Cart view lists all selected items with thumbnail, name, price, and row total.<br>2. "Grand Total" is calculated and displayed at the bottom. |
| **1.3.3** | **As a Shopper**, I want to **change quantities or remove items** from my cart so that I can manage my budget before checking out. | Medium | 3 | 1. User can hit "+" or "-" to adjust quantity.<br>2. Setting quantity to 0 removes the item.<br>3. "Remove" button deletes the item immediately.<br>4. Total price updates dynamically without page reload. |

---

## Epic-04: Checkout Engine & Order Processing
**Goal:** Convert the Shopping Cart into a finalized Order (Invoice) and capture revenue.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **1.4.1** | **As a Ready-to-Buy Customer**, I want to **enter my shipping address** so that the store knows where to send my electronics. | High | 3 | 1. Checkout Step 1 asks for Address, City, State, Zip.<br>2. If user is logged in, these fields pre-fill from their Profile.<br>3. Form requires all fields to be completed to proceed. |
| **1.4.2** | **As a Customer**, I want to **simulate a payment** so that I can complete the order process without using real money. | High | 5 | 1. User selects "Credit Card" (Simulation).<br>2. User enters mock details (e.g., Stripe Test Card).<br>3. System validates the format (16 digits).<br>4. System receives a "Success" token from the mock provider. |
| **1.4.3** | **As a Customer**, I want to **receive an Order Confirmation** so that I know my purchase was successful. | High | 5 | 1. Upon payment success, user sees a "Thank You" page.<br>2. An Invoice ID is displayed (e.g., `INV-1001`).<br>3. The user's Cart is cleared.<br>4. Stock quantity in `lpa_stock` is automatically reduced. |

---

## Epic-05: Admin Order Fulfillment
**Goal:** Provide the warehouse staff with the visibility needed to process and ship customer orders.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **1.5.1** | **As a Warehouse Staff**, I want to **view a list of new orders** so that I know what needs to be packed today. | High | 3 | 1. Admin Dashboard lists all Invoices from `lpa_invoices`.<br>2. List shows Date, Client Name, Total, and Status.<br>3. Orders are sorted by Date (Newest first). |
| **1.5.2** | **As a Warehouse Staff**, I want to **view the specific items in an order** so that I pack the correct products. | High | 2 | 1. Clicking an Invoice shows the "Line Items" (Product Name, Qty).<br>2. Shipping Address is clearly visible for printing labels. |
| **1.5.3** | **As a Warehouse Staff**, I want to **update the order status to "Shipped"** so that the system tracks fulfillment. | Medium | 2 | 1. Admin can change `lpa_inv_status` from "Paid" to "Shipped".<br>2. The status update is saved to the database. |