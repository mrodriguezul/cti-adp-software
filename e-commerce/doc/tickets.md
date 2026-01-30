# LPA eComms - Master Technical Work Ticket List

This document contains the comprehensive breakdown of all 29 User Stories into actionable technical tickets.

## Phase 1: MVP (Core Foundation)

| Ticket ID | Story Ref | Title | Details & Acceptance Criteria (AC) | Priority | Est. (Pts) | Assign | Labels |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **T-001** | **1.1.3** | **[Backend] Setup Password Encryption Service** | **Desc:** Implement Bcrypt hashing utility.<br>**AC:**<br>1. `hashPassword(str)` returns a hash.<br>2. `compare(str, hash)` returns boolean.<br>3. Unit tests pass. | Critical | 3 | Backend | `Security` |
| **T-002** | **1.1.1** | **[API] User Registration Endpoint** | **Desc:** `POST /api/register`. Validates input and creates `lpa_client` record.<br>**AC:**<br>1. Validates Email format.<br>2. Prevents duplicate emails (409 Conflict).<br>3. Returns 201 Created on success. | High | 5 | Backend | `API` `Auth` |
| **T-003** | **1.1.1** | **[Frontend] Registration Form** | **Desc:** UI with Email/Pass/Name fields.<br>**AC:**<br>1. Client-side validation (Min 8 chars).<br>2. Submit calls API.<br>3. Success redirects to Login. | High | 5 | Frontend | `UI` |
| **T-004** | **1.1.2** | **[API] Login & JWT Generation** | **Desc:** `POST /api/login`. Issues JWT.<br>**AC:**<br>1. Valid creds return Token.<br>2. Invalid creds return 401.<br>3. Token contains User ID & Role. | High | 5 | Backend | `API` `Auth` |
| **T-005** | **1.1.2** | **[Frontend] Login Page & Auth State** | **Desc:** Login UI and global `AuthContext`.<br>**AC:**<br>1. Form submits to API.<br>2. Stores Token in LocalStorage/Cookie.<br>3. Redirects to Home. | High | 3 | Frontend | `UI` |
| **T-006** | **1.2.3** | **[DB] Create Stock Table Schema** | **Desc:** Create `lpa_stock` table.<br>**AC:**<br>1. Columns: ID, Name, Desc, Price, OnHand, Image.<br>2. Migration runs successfully. | Critical | 2 | Database | `DB` |
| **T-007** | **1.2.3** | **[API] Admin: Add Product Endpoint** | **Desc:** `POST /api/admin/products`.<br>**AC:**<br>1. Requires Admin Token.<br>2. Validates Price > 0.<br>3. Creates DB record. | High | 3 | Backend | `API` `Admin` |
| **T-008** | **1.2.3** | **[Desktop] Admin: Add Product Form** | **Desc:** Java Swing Form to input product details.<br>**AC:**<br>1. Fields for all columns.<br>2. Save button commits to DB via JDBC. | High | 5 | Desktop | `Java` |
| **T-009** | **1.2.1** | **[API] Public Product List Endpoint** | **Desc:** `GET /api/products`.<br>**AC:**<br>1. Returns JSON array.<br>2. Supports Pagination (`?page=1`).<br>3. Excludes Disabled items. | High | 3 | Backend | `API` |
| **T-010** | **1.2.1** | **[Frontend] Product Grid UI** | **Desc:** Display products in a responsive grid.<br>**AC:**<br>1. Shows Image, Name, Price.<br>2. "Out of Stock" items dimmed. | High | 5 | Frontend | `UI` |
| **T-011** | **1.2.2** | **[Frontend] Product Detail View** | **Desc:** Individual product page (`/product/:id`).<br>**AC:**<br>1. Fetches data by ID.<br>2. Renders HTML Description.<br>3. Shows "Add to Cart" button. | High | 3 | Frontend | `UI` |
| **T-012** | **1.2.4** | **[Desktop] Admin: Edit Stock** | **Desc:** Update Price/Qty in Java App.<br>**AC:**<br>1. Search for item.<br>2. Update fields.<br>3. Save updates DB immediately. | Med | 3 | Desktop | `Java` |
| **T-013** | **1.3.1** | **[Frontend] Cart Logic (Context)** | **Desc:** Global state for Cart.<br>**AC:**<br>1. `addToCart` adds item ID/Qty.<br>2. Persists on page reload.<br>3. Checks Max Stock limit. | High | 5 | Frontend | `Logic` |
| **T-014** | **1.3.2** | **[Frontend] Cart Page UI** | **Desc:** View all items in cart.<br>**AC:**<br>1. Lists items with thumbnail.<br>2. Shows Subtotal & Grand Total. | High | 3 | Frontend | `UI` |
| **T-015** | **1.3.3** | **[Frontend] Update/Remove Cart Items** | **Desc:** Controls to change Qty.<br>**AC:**<br>1. `+` / `-` buttons update state.<br>2. "Remove" deletes item.<br>3. Totals recalculate instantly. | Med | 3 | Frontend | `UI` |
| **T-016** | **1.4.1** | **[Frontend] Checkout: Address Form** | **Desc:** Step 1 of Checkout.<br>**AC:**<br>1. Validation for City/Zip.<br>2. Auto-fills if User has Profile.<br>3. Next button blocked if invalid. | High | 3 | Frontend | `UI` |
| **T-017** | **1.4.2** | **[Frontend] Mock Payment UI** | **Desc:** Step 2 of Checkout.<br>**AC:**<br>1. Credit Card Input fields.<br>2. Mock validation (Length 16).<br>3. Returns specific Token. | Critical | 5 | Frontend | `UI` |
| **T-018** | **1.4.3** | **[API] Create Order (Transaction)** | **Desc:** `POST /api/orders`. Atomic transaction.<br>**AC:**<br>1. Verify Stock.<br>2. Create Invoice.<br>3. Create Items.<br>4. Decrement Stock. | Critical | 8 | Backend | `API` |
| **T-019** | **1.4.3** | **[Frontend] Order Success Page** | **Desc:** Final confirmation.<br>**AC:**<br>1. Displays Invoice ID.<br>2. Clears Cart state.<br>3. Link to "Continue Shopping". | High | 2 | Frontend | `UI` |
| **T-020** | **1.5.1** | **[Desktop] Admin: Order List** | **Desc:** View incoming orders.<br>**AC:**<br>1. Table showing Date, Client, Total, Status.<br>2. Sort by Newest. | High | 3 | Desktop | `Java` |
| **T-021** | **1.5.2** | **[Desktop] Admin: Order Details** | **Desc:** View items in an order.<br>**AC:**<br>1. Master-Detail view.<br>2. Shows Shipping Address.<br>3. Shows List of Items (Qty). | High | 2 | Desktop | `Java` |
| **T-022** | **1.5.3** | **[Desktop] Admin: Update Status** | **Desc:** Mark as Shipped.<br>**AC:**<br>1. Dropdown for Status (Paid -> Shipped).<br>2. Update commits to DB. | Med | 2 | Desktop | `Java` |

---

## Phase 2: UX & Optimization

| Ticket ID | Story Ref | Title | Details & Acceptance Criteria (AC) | Priority | Est. (Pts) | Assign | Labels |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **T-023** | **2.6.1** | **[API] Search Products Endpoint** | **Desc:** Enhance `GET /products`.<br>**AC:**<br>1. Accept `?search=query`.<br>2. SQL `LIKE %query%` on Name/Desc.<br>3. Return matches. | High | 3 | Backend | `API` |
| **T-024** | **2.6.1** | **[Frontend] Search Bar Component** | **Desc:** Global header search.<br>**AC:**<br>1. Input field in Navbar.<br>2. Enter key navigates to `/search?q=...`.<br>3. Displays results grid. | High | 3 | Frontend | `UI` |
| **T-025** | **2.6.2** | **[API] Filter by Price Endpoint** | **Desc:** Enhance `GET /products`.<br>**AC:**<br>1. Accept `?minPrice` & `?maxPrice`.<br>2. Filter SQL query.<br>3. Validate numbers. | Med | 2 | Backend | `API` |
| **T-026** | **2.6.2** | **[Frontend] Price Filter Sidebar** | **Desc:** UI range slider/inputs.<br>**AC:**<br>1. Min/Max inputs.<br>2. "Apply" button refreshes list.<br>3. Persist params in URL. | Med | 3 | Frontend | `UI` |
| **T-027** | **2.6.3** | **[Frontend] Category Filter** | **Desc:** Sidebar links.<br>**AC:**<br>1. List categories.<br>2. Clicking filters list.<br>3. Active category highlighted. | Med | 2 | Frontend | `UI` |
| **T-028** | **2.6.4** | **[Frontend] Sort Dropdown** | **Desc:** Sort options.<br>**AC:**<br>1. Options: Price Low/High, Name.<br>2. Update URL query `?sort=price_asc`.<br>3. Refresh list. | Low | 2 | Frontend | `UI` |
| **T-029** | **2.7.1** | **[API] Update Client Profile** | **Desc:** `PUT /api/profile`.<br>**AC:**<br>1. Auth required.<br>2. Updates Address/Phone in `lpa_clients`.<br>3. Validation. | Med | 3 | Backend | `API` |
| **T-030** | **2.7.1** | **[Frontend] Profile Edit Page** | **Desc:** User settings form.<br>**AC:**<br>1. Pre-fill existing data.<br>2. Save button calls API.<br>3. Success toast. | Med | 3 | Frontend | `UI` |
| **T-031** | **2.7.2** | **[API] Get User Orders** | **Desc:** `GET /api/profile/orders`.<br>**AC:**<br>1. Auth required.<br>2. Return invoices for current User ID only.<br>3. Sort desc date. | Low | 3 | Backend | `API` |
| **T-032** | **2.7.2** | **[Frontend] Order History Page** | **Desc:** List of past purchases.<br>**AC:**<br>1. Table format.<br>2. Link to detail view.<br>3. Status badges. | Low | 3 | Frontend | `UI` |
| **T-033** | **2.7.3** | **[Frontend] Order Detail View** | **Desc:** Specific order receipt.<br>**AC:**<br>1. Shows itemized list.<br>2. Shows total paid.<br>3. "Back to History" button. | Med | 2 | Frontend | `UI` |
| **T-034** | **2.7.4** | **[API] Change Password** | **Desc:** `POST /api/profile/password`.<br>**AC:**<br>1. Verify old password.<br>2. Hash new password.<br>3. Update DB. | Low | 3 | Backend | `Security` |

---

## Phase 3: Growth & Engagement

| Ticket ID | Story Ref | Title | Details & Acceptance Criteria (AC) | Priority | Est. (Pts) | Assign | Labels |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **T-035** | **3.6.5** | **[API] Related Products Logic** | **Desc:** `GET /api/products/:id/related`.<br>**AC:**<br>1. Query 4 items from same Category.<br>2. Exclude current Item ID.<br>3. Randomize selection. | Low | 3 | Backend | `API` |
| **T-036** | **3.6.5** | **[Frontend] Related Items Widget** | **Desc:** Carousel/Grid at bottom of PDP.<br>**AC:**<br>1. Display 3-4 cards.<br>2. Hidden if no related items.<br>3. Click navigates to item. | Low | 3 | Frontend | `UI` |
| **T-037** | **3.7.5** | **[DB] Wishlist Table** | **Desc:** Create schema.<br>**AC:**<br>1. Table `lpa_wishlist`.<br>2. Cols: `user_id`, `stock_id`.<br>3. Compound PK. | Low | 2 | Database | `DB` |
| **T-038** | **3.7.5** | **[Frontend] Add to Wishlist** | **Desc:** Heart icon on cards.<br>**AC:**<br>1. Toggle state (Empty/Filled).<br>2. API call to add/remove.<br>3. Redirect to Login if Guest. | Low | 2 | Frontend | `UI` |
| **T-039** | **3.7.6** | **[Frontend] Wishlist Page** | **Desc:** Dedicated page.<br>**AC:**<br>1. Grid of saved items.<br>2. "Move to Cart" button.<br>3. "Remove" button. | Low | 3 | Frontend | `UI` |
| **T-040** | **3.7.7** | **[API] Submit Review** | **Desc:** `POST /api/products/:id/reviews`.<br>**AC:**<br>1. Verify user purchased item (Check Invoice).<br>2. Save Rating (1-5) & Text.<br>3. Prevent duplicates. | Low | 5 | Backend | `API` |
| **T-041** | **3.7.8** | **[Frontend] Product Reviews Tab** | **Desc:** Display reviews on PDP.<br>**AC:**<br>1. Show Avg Rating (Stars).<br>2. List text reviews.<br>3. Show "Verified Purchase" badge. | Low | 3 | Frontend | `UI` |