# LPA eComms - Phase 2 (Enhanced UX & Optimization) User Stories

This document outlines the user stories for Phase 2, focusing on Product Discovery (Search/Filter), Customer Self-Service (Profile Management), and Order Tracking.

**Scope:** Phase 2 extends the MVP with features that improve customer experience and retention, focusing entirely on customer-facing capabilities.

---

## Epic-05: Discovery & Search Optimization (Part 1: Core Search)
**Goal:** Help users quickly locate specific electronics within the catalog using intuitive search and filtering.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **2.5.1** | **As a Shopper with a specific need**, I want to **search for products by keyword** so that I can find exactly what I am looking for (e.g., "Sony Headphones"). | High | 5 | 1. Search bar is visible in the global navigation (header).<br>2. Entering text matches against Product Name, Description, and SKU.<br>3. Results page displays matching items in a grid with pagination.<br>4. If no matches found, show a helpful "No results. Try different keywords" message.<br>5. Search is case-insensitive and ignores extra spaces. |
| **2.5.2** | **As a Budget-Conscious Shopper**, I want to **filter products by price range** so that I only see items I can afford. | High | 3 | 1. Sidebar displays a Price Filter with Min/Max input fields or Price Range Slider.<br>2. Applying filter updates the product grid instantly (via AJAX) without page reload.<br>3. Products outside the selected range are hidden from the list.<br>4. Current filter range is displayed as a badge (e.g., "$0 - $500"). |
| **2.5.3** | **As a Shopper**, I want to **sort the product list** so that I can see the cheapest, newest, or most relevant items first. | Medium | 2 | 1. "Sort By" dropdown is available on the Product Listing Page.<br>2. Options include: Price (Low-High), Price (High-Low), Name (A-Z), Newest, and Relevance.<br>3. Selecting a sort option reorders the current list immediately.<br>4. Currently active sort is highlighted in the dropdown. |

---

## Epic-06: Customer Dashboard & Account Management
**Goal:** Allow registered customers to manage personal information, view order history, and track purchase activity.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **2.6.1** | **As a Registered Customer**, I want to **view and update my profile** so that my account information is accurate and up-to-date. | High | 3 | 1. "My Account" or "My Profile" page displays user information: Name, Email, Phone.<br>2. User can edit Name, Phone, and Preferred Shipping Address fields.<br>3. "Save" button updates the database and shows success confirmation.<br>4. Changes are immediately reflected in future checkout flows. |
| **2.6.2** | **As a Returning Customer**, I want to **view my Order History** so that I can remember and track previous purchases. | Medium | 5 | 1. "My Orders" section lists all past invoices associated with the logged-in customer.<br>2. Each row shows: Order ID, Order Date, Item Count, Status (Paid/Shipped/Delivered), and Total Amount.<br>3. List is sorted by Order Date (newest first) and paginated (10 per page).<br>4. Click on any order to view detailed information. |
| **2.6.3** | **As a Customer**, I want to **view the details of a past order** so that I can see exactly which items were purchased, prices, and shipping address. | Medium | 3 | 1. Clicking an Order ID opens a detailed view showing all order information.<br>2. View displays: Order ID, Date, Shipping Address, Billing Address (if different), and full line-item table (Product, Quantity, Unit Price, Total).<br>3. "Snapshot" data shows price/address at time of purchase (not current values).<br>4. Option to re-order or continue shopping from this detail view. |
| **2.6.4** | **As a Security-Minded User**, I want to **change my password** so that I can keep my account secure. | Low | 2 | 1. Profile page includes a "Change Password" section.<br>2. Form requires: Current Password (for verification), New Password, and Confirm New Password.<br>3. System validates current password before allowing change.<br>4. New password is hashed and stored securely; success message appears. |

---

## Epic-07: Advanced Search & Navigation Enhancements
**Goal:** Provide additional filtering options to help customers discover products more easily.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **2.7.1** | **As a Customer**, I want to **filter products by category or type** so that I can browse specific product groups (e.g., Laptops, Headphones, Cables). | Medium | 3 | 1. Sidebar lists available product categories (derived from `lpa_stock` data).<br>2. Clicking a category refreshes the product grid to show only those items.<br>3. Multiple category selection is supported (OR logic: show items matching ANY selected category).<br>4. Active categories are visually highlighted with a checkbox or badge.<br>5. "Clear Filters" button resets all selections. |