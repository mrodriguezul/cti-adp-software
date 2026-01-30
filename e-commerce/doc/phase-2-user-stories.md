# LPA eComms - Phase 2 (UX & Optimization) User Stories

This document outlines the user stories for Phase 2, focusing on Product Discovery (Search/Filter) and Customer Self-Service (Profile Management).

## Epic-06: Discovery & Search Optimization
**Goal:** Help users quickly locate specific electronics within the catalog without scrolling through every page.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **2.6.1** | **As a Shopper with a specific need**, I want to **search for products by keyword** so that I can find exactly what I am looking for (e.g., "Sony Headphones"). | High | 5 | 1. Search bar is visible in the global navigation.<br>2. Entering text matches against Product Name and Description.<br>3. Results page displays matching items.<br>4. If no matches found, show a helpful "No results" message. |
| **2.6.2** | **As a Budget-Conscious Shopper**, I want to **filter products by price range** so that I only see items I can afford. | High | 3 | 1. Sidebar displays a Price Filter (Min/Max inputs or Slider).<br>2. Applying filter updates the product grid instantly (AJAX) or on "Apply" click.<br>3. Products outside the range are hidden. |
| **2.6.3** | **As a Tech Enthusiast**, I want to **filter products by Category** so that I can browse just "Laptops" or "Cables". | Medium | 3 | 1. Sidebar lists available Categories (derived from stock data).<br>2. Clicking a category (e.g., "Monitors") refreshes the grid to show only those items.<br>3. Active filter is visually highlighted. |
| **2.6.4** | **As a Shopper**, I want to **sort the product list** so that I can see the cheapest or newest items first. | Low | 2 | 1. "Sort By" dropdown is available on the Product Listing Page.<br>2. Options include: Price (Low-High), Price (High-Low), and Name (A-Z).<br>3. Selecting an option reorders the current list. |

---

## Epic-07: Customer Dashboard & Engagement (Part 1: Self-Service)
**Goal:** Reduce friction for returning customers by allowing them to manage their personal data and view past activity.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **2.7.1** | **As a Registered Customer**, I want to **update my default shipping address** so that I don't have to type it in every time I buy something. | High | 3 | 1. "My Profile" page contains an "Edit Address" form.<br>2. Form pre-fills with current data from `lpa_clients`.<br>3. Saving updates the database record.<br>4. Next Checkout session auto-populates this new address. |
| **2.7.2** | **As a Returning Customer**, I want to **view my Order History** so that I can remember what I bought previously. | Medium | 5 | 1. "My Orders" section lists all past invoices associated with the user's Client ID.<br>2. List shows Date, Order ID, Status (e.g., Shipped), and Total Amount.<br>3. List is sorted by newest first. |
| **2.7.3** | **As a Customer**, I want to **view the details of a past order** so that I can see exactly which items were included. | Medium | 3 | 1. Clicking an Order ID in the history list opens a detailed view.<br>2. View displays the "Snapshot" data (Price/Address at time of purchase) from `lpa_invoices` and `lpa_invoice_items`. |
| **2.7.4** | **As a Security-Minded User**, I want to **change my password** so that I can keep my account secure if I suspect a breach. | Low | 3 | 1. Profile includes a "Change Password" feature.<br>2. User must enter "Current Password" (for verification) and "New Password".<br>3. System hashes the new password and updates `lpa_clients`. |