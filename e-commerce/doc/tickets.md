# LPA eComms - Web Storefront Technical Work Tickets

**Scope:** Customer-facing web storefront implementation tickets only  
**Organization:** Ordered by product backlog priority (1-30)  
**Ticket ID Format:** `x.y.z.n` where x.y.z = Story ID, n = Ticket sequence within story

---

## Phase 1: MVP (Minimum Viable Product) — 13 Stories

### Story 1.1.3: Password Encryption
**Priority:** High | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | **1.1.3.1** | **[Backend] Setup Password Hashing Service** | **Desc:** Implement Bcrypt hashing utility module.<br>**AC:**<br>1. `hashPassword(str)` function returns salted hash.<br>2. `comparePassword(str, hash)` returns boolean.<br>3. Unit tests validate both functions.<br>4. Salting uses 12 rounds (secure default). | 3 | Backend | `Security` `Auth` |

---

### Story 1.1.1: Register Account
**Priority:** High | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | **1.1.1.1** | **[API] User Registration Endpoint** | **Desc:** Create `POST /api/auth/register` endpoint.<br>**AC:**<br>1. Accepts JSON payload with: `firstname`, `lastname`, `email`, `password`, `phone` (optional), `address` (optional).<br>2. Validates email format (RFC 5322).<br>3. Validates password minimum 8 characters.<br>4. Prevents duplicate emails (returns 409 Conflict).<br>5. Maps request fields directly to database columns: `firstname` and `lastname` (all lowercase) for Prisma compatibility.<br>6. Hashes password using 1.1.3.1 service before storage.<br>7. Inserts record into `lpa_clients` table with all provided fields.<br>8. Returns 201 Created with client ID in response: `{ success: true, data: { clientId: id } }`. | 5 | Backend | `API` `Auth` |
| [x] | **1.1.1.2** | **[Frontend] Registration Form & Page** | **Desc:** Build registration UI with React form.<br>**AC:**<br>1. Form fields (in order): First Name, Last Name, Email, Password, Confirm Password, Phone (optional), Address (optional).<br>2. Client-side validation: first name and last name required, password min 8 chars, email format, phone format optional.<br>3. Confirm Password field matches Password field validation.<br>4. Submit button calls 1.1.1.1 API with all form fields.<br>5. Success redirects to Login page with confirmation message.<br>6. Error displays detailed validation message from API.<br>7. Form preserves data on validation error (except password fields). | 5 | Frontend | `UI` `Auth` |

---

### Story 1.1.2: Login
**Priority:** High | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **1.1.2.1** | **[API] Login & JWT Token Generation** | **Desc:** Create `POST /api/auth/login` endpoint.<br>**AC:**<br>1. Accepts Email and Password.<br>2. Queries `lpa_clients` by email.<br>3. Uses 1.1.3.1 to compare password hash.<br>4. On success: generates JWT token (expires 24h), returns token and user data.<br>5. On failure: returns 401 Unauthorized with generic message. | 5 | Backend | `API` `Auth` |
| [ ] | **1.1.2.2** | **[Frontend] Login Page & Auth Context** | **Desc:** Build login UI and global auth state management.<br>**AC:**<br>1. Form fields: Email, Password.<br>2. Submit calls 1.1.2.1 API.<br>3. On success: stores token in LocalStorage, sets AuthContext, redirects to Home.<br>4. On failure: displays error message.<br>5. "Remember me" checkbox optional (future). | 3 | Frontend | `UI` `Auth` `State` |

---

### Story 1.2.1: View Product List
**Priority:** High | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | **1.2.1.1** | **[Backend] Public Product List Endpoint** | **Desc:** Create `GET /api/products` endpoint.<br>**AC:**<br>1. Returns JSON array of products from `lpa_stock`.<br>2. Supports pagination: `?page=1&limit=12`.<br>3. Returns only Active products (status='A').<br>4. Each product includes: id, sku, name, description, price, onhand, image_url.<br>5. Returns count and hasMore for pagination. | 3 | Backend | `API` |
| [x] | **1.2.1.2** | **[Frontend] Product Grid UI** | **Desc:** Build responsive product grid component.<br>**AC:**<br>1. Displays products in responsive grid (4 cols desktop, 2 mobile).<br>2. Each product card displays product image at the top.<br>3. Below image: product `sku` in small, muted text.<br>4. Product `name` displayed as bold heading.<br>5. Product `description` truncated to 2 lines.<br>6. Card footer: `price` (bolded) and `stock` count (e.g., "45 in stock") stacked on the left; "Add to Cart" button with cart icon on the right.<br>7. Out-of-stock items grayed out but visible.<br>8. Pagination buttons or "Load More".<br>9. Loading state displayed during fetch. | 5 | Frontend | `UI` |

---

### Story 1.2.2: Product Detail View
**Priority:** High | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | **1.2.2.1** | **[Frontend] Product Detail Page** | **Desc:** Build single product detail page (`/product/:id`).<br>**AC:**<br>1. Include a "<- Back to Products" navigation link at the top of the page.<br>2. Implement a two-column layout for desktop screens.<br>3. Left Column: Display a large, rounded product image.<br>4. Right Column (Top): Display the product `sku` in small muted text, followed by the `name` as a large bold heading, and then the `description`.<br>5. Right Column (Pricing): Display the `price` prominently, with the `stock` count (e.g., "X in stock") stacked below it in muted text.<br>6. Right Column (Actions): Include a "Qty" label and a number input field (defaulting to 1), positioned next to a primary "Add to Cart" button that features a shopping cart icon.<br>7. Fetches product data from `GET /api/products/:id`.<br>8. Loading and error states handled. | 3 | Frontend | `UI` |

---

### Story 1.3.1: Add to Cart
**Priority:** High | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | **1.3.1.1** | **[Frontend] Cart State Management** | **Desc:** Build global cart state using Context API or Redux.<br>**AC:**<br>1. Cart stores: itemId, quantity, price snapshot.<br>2. `addToCart(itemId, qty)` function prevents qty > stock.<br>3. Cart persists across page navigation (LocalStorage).<br>4. Cart persists on page refresh.<br>5. Events trigger for cart updates (e.g., navbar counter). | 5 | Frontend | `State` `Logic` |

---

### Story 1.3.2: View Cart
**Priority:** High | **Story Points:** 2

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | **1.3.2.1** | **[Frontend] Shopping Cart Page** | **Desc:** Build cart review page (`/cart`).<br>**AC:**<br>1. Render a table-style layout with headers: Product, Price, Qty, Amount.<br>2. Product Column: Display a rounded thumbnail image, the product name, and the product `sku` positioned underneath the name in small, muted text.<br>3. Interactive Controls: Display a number input field for the Quantity, and a red trash can icon on the far right of the row for item removal.<br>4. Totals: Calculate and display the row "Amount" (Price * Qty) in bold. At the bottom of the list, display a single "Total" row with the final sum.<br>5. Primary Action: Render a right-aligned "Proceed to Checkout" primary button featuring a right-arrow icon below the cart total.<br>6. Empty State: If the cart is empty, display a friendly message with a "Continue Shopping" button. | 3 | Frontend | `UI` |

---

### Story 1.3.3: Edit Cart Items
**Priority:** Medium | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [x] | **1.3.3.1** | **[Frontend] Cart Item Editing Controls** | **Desc:** Build quantity adjustment and removal UI.<br>**AC:**<br>1. Use a native HTML number input field for quantity adjustment (built-in up/down arrows).<br>2. Input validation enforces `min="1"` (preventing 0 or negative inputs) and `max={stockLimit}`.<br>3. Clicking the dedicated "Remove" (Trash) button deletes the item from the cart.<br>4. Cart totals update immediately via React Context without a page reload.<br>5. Context logic and UI notifications (Toasts) prevent users from exceeding available `onhand` stock limits. | 3 | Frontend | `UI` `Logic` |

---

### Story 1.4.1: Checkout - Shipping Address
**Priority:** High | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **1.4.1.1** | **[Frontend] Checkout Step 1: Address Form** | **Desc:** Build shipping address collection form.<br>**AC:**<br>1. Form fields: Address, City, State/Province, Zip/Postal, Country.<br>2. For logged-in users: pre-fill from saved profile (if available).<br>3. Validation: all fields required, zip format validation.<br>4. "Save to Profile" checkbox for registered users.<br>5. "Next" button blocked until valid.<br>6. Back button returns to cart. | 3 | Frontend | `UI` |

---

### Story 1.4.2: Simulate Payment
**Priority:** High | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **1.4.2.1** | **[Frontend] Checkout Step 2: Mock Payment Input** | **Desc:** Build payment method and card detail form.<br>**AC:**<br>1. Payment method selection (Credit Card, PayPal icons).<br>2. Credit Card fields: Card Number, Exp Date (MM/YY), CVV.<br>3. Validation: 16-digit card number, 3-digit CVV, future exp date.<br>4. Mock "Process" button submits data (no real payment).<br>5. Success returns mock token; Error shows message. | 5 | Frontend | `UI` `Forms` |

---

### Story 1.4.3: Order Review
**Priority:** High | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **1.4.3.1** | **[Frontend] Checkout Step 3: Order Review** | **Desc:** Build order summary and confirmation page.<br>**AC:**<br>1. Displays: cart items (name, qty, price), shipping address, total.<br>2. "Edit" links allow returning to previous steps.<br>3. "Agree to Terms" checkbox required.<br>4. "Place Order" button calls 1.4.3.2 API.<br>5. Back button revisits payment form. | 3 | Frontend | `UI` |
| [ ] | **1.4.3.2** | **[API] Create Order Transaction** | **Desc:** Create `POST /api/checkout/orders` endpoint.<br>**AC:**<br>1. Auth required (or guest checkout with token).<br>2. Verifies cart items stock availability.<br>3. Atomic transaction: creates `lpa_invoices` and `lpa_invoice_items`.<br>4. Updates `lpa_stock.onhand` for each item.<br>5. Clears cart on success.<br>6. Returns invoice ID and 201 Created.<br>7. Rollback on any failure.<br>8. **SECURITY: The backend MUST NOT trust product prices sent from the frontend. The API must independently fetch the current, authoritative price for each `productId` directly from the `lpa_stock` database table to calculate the final invoice total.** | 8 | Backend | `API` `DB` `Transaction` `Security` |

---

### Story 1.4.4: Order Confirmation
**Priority:** High | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **1.4.4.1** | **[Frontend] Order Confirmation Page** | **Desc:** Build success confirmation and thank you page.<br>**AC:**<br>1. Displays prominent "Order Confirmed" message.<br>2. Shows Invoice ID (e.g., INV-20260309-001).<br>3. Shows order summary: items, total, shipping address.<br>4. Displays estimated delivery date.<br>5. "Continue Shopping" button clears cart and navigates home.<br>6. For registered users: link to "View Order History".<br>7. Email confirmation sent (backend). | 5 | Frontend | `UI` |
| [ ] | **1.4.4.2** | **[Backend] Order Confirmation Email** | **Desc:** Send email confirmation on successful order.<br>**AC:**<br>1. Triggered after 1.4.3.2 success.<br>2. Email includes: Invoice ID, items, total, tracking placeholder.<br>3. Recipient: customer email from `lpa_clients`.<br>4. Uses SendGrid or similar email service.<br>5. Error logging if send fails (does not block order). | 3 | Backend | `Email` `Integration` |

---

### Story 1.1.4: Guest Shopping with Checkout Login
**Priority:** Medium | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **1.1.4.1** | **[Frontend] Guest Cart & Forced Checkout Login** | **Desc:** Enable guest cart browsing with login at checkout.<br>**AC:**<br>1. Guests can browse products and add to cart without login.<br>2. Cart persists in LocalStorage.<br>3. At checkout step 1, system prompts: "Please log in or create account".<br>4. Guest redirected to login page with query param `?redirect=checkout`.<br>5. After login, cart is preserved and merged with any existing cart.<br>6. Checkout continues seamlessly. | 5 | Frontend | `UI` `Auth` `Logic` |

---

## Phase 2: Enhanced UX & Optimization — 8 Stories

### Story 2.5.1: Keyword Search
**Priority:** High | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **2.5.1.1** | **[API] Keyword Search Endpoint** | **Desc:** Create `GET /api/products/search?q=query` endpoint.<br>**AC:**<br>1. Accepts query string parameter `q`.<br>2. Searches `lpa_stock` name, description, sku (case-insensitive).<br>3. Uses SQL LIKE or full-text search for efficiency.<br>4. Returns paginated results (12 per page default).<br>5. Returns "No results" if zero matches.<br>6. Supports pagination params (`?page=2`). | 5 | Backend | `API` `Search` |
| [ ] | **2.5.1.2** | **[Frontend] Search Bar Component** | **Desc:** Build global search UI in navbar.<br>**AC:**<br>1. Search input field in header/navbar.<br>2. Debounced search-as-you-type (show 5 quick suggestions).<br>3. Enter key navigates to full search results page (`/search?q=...`).<br>4. Results page displays full grid with filters.<br>5. Search query highlighted in results. | 5 | Frontend | `UI` `Components` |

---

### Story 2.5.2: Filter by Price
**Priority:** Medium | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **2.5.2.1** | **[API] Price Filter Endpoint** | **Desc:** Enhance `GET /api/products` to support price filtering.<br>**AC:**<br>1. Accepts query params: `?minPrice=100&maxPrice=500`.<br>2. Filters products WHERE price BETWEEN min AND max.<br>3. Validates numeric inputs (no negative).<br>4. Returns filtered count and paginated results.<br>5. Works combined with search and other filters. | 2 | Backend | `API` `Filtering` |
| [ ] | **2.5.2.2** | **[Frontend] Price Range Filter UI** | **Desc:** Build price filter sidebar component.<br>**AC:**<br>1. Min and Max price input fields or slider widget.<br>2. "Apply" button updates product grid via API.<br>3. Price range persists in URL query params.<br>4. Visual indicator shows active filter range.<br>5. "Clear" button resets to default range. | 3 | Frontend | `UI` `Filtering` |

---

### Story 2.5.3: Sort Products
**Priority:** Low | **Story Points:** 2

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **2.5.3.1** | **[Frontend] Sort Dropdown** | **Desc:** Build product sorting UI.<br>**AC:**<br>1. Dropdown with options: Price (Low-High), Price (High-Low), Name (A-Z), Newest, Relevance.<br>2. Selection updates URL query param `?sort=price_asc`.<br>3. Product grid re-fetches with new sort order.<br>4. Active sort option highlighted in dropdown.<br>5. Default sort is "Relevance" (or "Newest"). | 2 | Frontend | `UI` |

---

### Story 2.6.1: Edit Profile
**Priority:** High | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **2.6.1.1** | **[API] Update User Profile Endpoint** | **Desc:** Create `PUT /api/profile` endpoint.<br>**AC:**<br>1. Auth required (JWT token validation).<br>2. Accepts fields: firstname, lastname, phone, address.<br>3. Updates `lpa_clients` record for authenticated user.<br>4. Validates input (e.g., phone format).<br>5. Returns 200 OK with updated profile data. | 3 | Backend | `API` `Auth` |
| [ ] | **2.6.1.2** | **[Frontend] Profile Edit Page** | **Desc:** Build user profile management page.<br>**AC:**<br>1. Form fields auto-filled from current profile data.<br>2. Edit capability for: Name, Phone, Shipping Address.<br>3. "Save" button calls 2.6.1.1 API.<br>4. Success shows toast/confirmation message.<br>5. Error displays validation feedback.<br>6. Option to change password (links to 2.6.4). | 3 | Frontend | `UI` `Forms` |

---

### Story 2.6.2: View Order History
**Priority:** Medium | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **2.6.2.1** | **[API] Get User Orders Endpoint** | **Desc:** Create `GET /api/profile/orders` endpoint.<br>**AC:**<br>1. Auth required (JWT token validation).<br>2. Returns invoices from `lpa_invoices` for authenticated user only.<br>3. Each invoice: id, invoice_number, date, status, amount, item_count.<br>4. Sorted by date descending (newest first).<br>5. Supports pagination (`?page=1&limit=10`). | 3 | Backend | `API` |
| [ ] | **2.6.2.2** | **[Frontend] Order History Page** | **Desc:** Build list of customer's past orders.<br>**AC:**<br>1. Table layout: Order ID, Date, Item Count, Status, Total.<br>2. Status shown as badge (Paid, Shipped, Delivered).<br>3. Clicking a row navigates to order detail view.<br>4. Pagination controls for browsing old orders.<br>5. "Reorder" button visible for quick reorder (if Phase 3 implemented). | 3 | Frontend | `UI` |

---

### Story 2.6.3: View Order Details
**Priority:** Medium | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **2.6.3.1** | **[API] Get Order Detail Endpoint** | **Desc:** Create `GET /api/profile/orders/:invoiceId` endpoint.<br>**AC:**<br>1. Auth required; verify invoice belongs to user.<br>2. Returns invoice header: id, date, total, status, shipping address.<br>3. Returns line items: product name, qty, unit price, subtotal.<br>4. Historical prices shown (snapshot at purchase time). | 2 | Backend | `API` |
| [ ] | **2.6.3.2** | **[Frontend] Order Detail View** | **Desc:** Build receipt/detail page for a specific order.<br>**AC:**<br>1. Fetch order data from 2.6.3.1 API.<br>2. Display: invoice number, date, shipping address, itemized list.<br>3. Show subtotal, tax, grand total.<br>4. "Back to Orders" button.<br>5. Print-friendly styling or print button. | 2 | Frontend | `UI` |

---

### Story 2.6.4: Change Password
**Priority:** Low | **Story Points:** 2

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **2.6.4.1** | **[API] Change Password Endpoint** | **Desc:** Create `POST /api/profile/password` endpoint.<br>**AC:**<br>1. Auth required.<br>2. Accepts: current_password, new_password, confirm_password.<br>3. Verifies current password is correct (compare hash).<br>4. Validates new password (min 8 chars, strong rules optional).<br>5. Hashes and updates password in `lpa_clients`.<br>6. Returns 200 OK or 400 error. | 2 | Backend | `API` `Security` |
| [ ] | **2.6.4.2** | **[Frontend] Change Password Form** | **Desc:** Build password change UI.<br>**AC:**<br>1. Form fields: Current Password, New Password, Confirm Password.<br>2. Submit calls 2.6.4.1 API.<br>3. Success shows confirmation message.<br>4. Error shows validation feedback.<br>5. Accessible from profile settings. | 2 | Frontend | `UI` `Forms` |

---

### Story 2.7.1: Filter by Category
**Priority:** Medium | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **2.7.1.1** | **[Frontend] Category Filter Sidebar** | **Desc:** Build product category filtering UI.<br>**AC:**<br>1. Sidebar lists all available product categories (derived from stock data).<br>2. Checkboxes for multi-select category filtering.<br>3. Clicking category button updates product grid (AJAX, no reload).<br>4. Multiple categories enabled (OR logic: show items matching ANY selected).<br>5. Active categories visually highlighted.<br>6. "Clear Filters" button resets selection. | 3 | Frontend | `UI` `Filtering` |

---

## Phase 3: Growth & Customer Engagement — 9 Stories

### Story 3.8.1: Related Products
**Priority:** Low | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **3.8.1.1** | **[API] Related Products Endpoint** | **Desc:** Create `GET /api/products/:id/related` endpoint.<br>**AC:**<br>1. Returns 3-4 products from same category or with similar metadata.<br>2. Excludes current product ID.<br>3. Randomizes selection for discovery variety.<br>4. Returns: id, name, price, image_url. | 3 | Backend | `API` `Recommendations` |
| [ ] | **3.8.1.2** | **[Frontend] Related Products Widget** | **Desc:** Build "You Might Also Like" carousel on product detail page.<br>**AC:**<br>1. Displays 3-4 related product cards below description.<br>2. Hidden if no related items (no empty state).<br>3. Clicking card navigates to that product detail.<br>4. Card includes: image, name, price, "View" button.<br>5. Mobile-friendly scroll or thumbnail view. | 5 | Frontend | `UI` `Recommendations` |

---

### Story 3.8.2: Personalized Recommendations
**Priority:** Low | **Story Points:** 8

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **3.8.2.1** | **[API] Personalized Recommendations Endpoint** | **Desc:** Create `GET /api/recommendations` endpoint.<br>**AC:**<br>1. Auth required (personalized for logged-in users).<br>2. Returns 4-6 products based on: browsed products (30-day history), purchased items.<br>3. Excludes: items already in cart, previously purchased (unless relevant).<br>4. Optional ML/scoring if time permits (simple category matching baseline).<br>5. Returns: id, name, price, image_url, relevance_score. | 8 | Backend | `API` `ML` |
| [ ] | **3.8.2.2** | **[Frontend] Recommendations Widget** | **Desc:** Build "Recommended For You" section on homepage.<br>**AC:**<br>1. Shown only to logged-in customers (guests see generic trending).<br>2. Carousel/grid of 4-6 product recommendations.<br>3. Fetches from 3.8.2.1 API.<br>4. Refreshes when user views new products or completes orders.<br>5. Mobile-friendly layout. | 8 | Frontend | `UI` `Recommendations` |

---

### Story 3.9.1: Add to Wishlist
**Priority:** Low | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **3.9.1.1** | **[DB] Create Wishlist Table** | **Desc:** Create `lpa_wishlist` database schema.<br>**AC:**<br>1. Columns: id (PK), client_id (FK), stock_id (FK), created_at.<br>2. Unique constraint: (client_id, stock_id) to prevent duplicates.<br>3. Cascade delete on client or product deletion (optional). | 1 | Backend | `DB` |
| [ ] | **3.9.1.2** | **[API] Add/Remove Wishlist Endpoint** | **Desc:** Create `POST /api/wishlist` (add) and `DELETE /api/wishlist/:id` (remove).<br>**AC:**<br>1. Auth required.<br>2. POST: adds product to user's wishlist (returns 201).<br>3. DELETE: removes product from wishlist (returns 204).<br>4. Prevents duplicate entries (returns 409 on duplicate add).<br>5. Validates product exists before adding. | 2 | Backend | `API` |
| [ ] | **3.9.1.3** | **[Frontend] Add to Wishlist Heart Icon** | **Desc:** Build wishlist toggle UI on product cards and detail page.<br>**AC:**<br>1. Heart icon visible on all product cards (catalog, search, related).<br>2. Clicking heart adds/removes from wishlist (toggles filled state).<br>3. Guest users prompted to login before adding.<br>4. Calls 3.9.1.2 API on click.<br>5. Provides visual feedback (heart filled = saved). | 3 | Frontend | `UI` |

---

### Story 3.9.2: View & Manage Wishlist
**Priority:** Low | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **3.9.2.1** | **[API] Get User Wishlist Endpoint** | **Desc:** Create `GET /api/wishlist` endpoint.<br>**AC:**<br>1. Auth required.<br>2. Returns all items saved in user's wishlist.<br>3. Each item includes: product id, name, current price, image_url, stock status.<br>4. Shows current price (not saved price). | 1 | Backend | `API` |
| [ ] | **3.9.2.2** | **[Frontend] Wishlist Management Page** | **Desc:** Build dedicated wishlist view page (`/wishlist`).<br>**AC:**<br>1. Grid layout displaying all wishlisted products.<br>2. Each card: image, name, current price, stock status, "Add to Cart", "Remove".<br>3. Empty wishlist shows message with "Continue Shopping" link.<br>4. Clicking "Add to Cart" adds product and shows confirmation.<br>5. "Remove" or X button deletes from wishlist. | 3 | Frontend | `UI` |

---

### Story 3.9.3: Write Product Review
**Priority:** Low | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **3.9.3.1** | **[DB] Create Reviews Table** | **Desc:** Create `lpa_reviews` schema.<br>**AC:**<br>1. Columns: id (PK), stock_id (FK), client_id (FK), rating (1-5), title, text, created_at.<br>2. Unique constraint: (client_id, stock_id) to prevent duplicate reviews per user/product. | 1 | Backend | `DB` |
| [ ] | **3.9.3.2** | **[API] Submit Review Endpoint** | **Desc:** Create `POST /api/products/:id/reviews` endpoint.<br>**AC:**<br>1. Auth required; verify user purchased this product (check `lpa_invoices`).<br>2. Accepts: rating (1-5), title, text (min 10 chars).<br>3. Saves review to `lpa_reviews` table.<br>4. Returns 201 Created with review ID.<br>5. Prevents duplicate review (return 409 if user already reviewed this product). | 3 | Backend | `API` |
| [ ] | **3.9.3.3** | **[Frontend] Review Submission Form** | **Desc:** Build review form on product detail page.<br>**AC:**<br>1. "Write a Review" button visible ONLY for authenticated users who purchased product.<br>2. Form: Star rating (1-5, interactive), Title, Review text area.<br>3. Min text length validation (10+ chars).<br>4. Submit calls 3.9.3.2 API.<br>5. Success shows confirmation "Review submitted for moderation".<br>6. Error shows validation feedback. | 3 | Frontend | `UI` `Forms` |

---

### Story 3.9.4: Read Product Reviews
**Priority:** Low | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **3.9.4.1** | **[API] Get Product Reviews Endpoint** | **Desc:** Create `GET /api/products/:id/reviews` endpoint.<br>**AC:**<br>1. Returns all approved reviews for a product.<br>2. Includes: author name, rating, title, text, date, helpful count.<br>3. Sorted by: Helpful/Recent (configurable).<br>4. Calculates average rating from all reviews.<br>5. Supports pagination (`?page=1&limit=5`). | 2 | Backend | `API` |
| [ ] | **3.9.4.2** | **[Frontend] Product Reviews Display** | **Desc:** Build reviews section on product detail page.<br>**AC:**<br>1. Displays average rating badge (e.g., "4.5 ⭐ based on 42 reviews").<br>2. "Customer Reviews" tab lists individual reviews.<br>3. Each review shows: star rating, title, text excerpt, author name, date.<br>4. "Helpful?" voting buttons (simple counter, no persistence required for MVP).<br>5. Pagination for browsing all reviews.<br>6. Link to write review (if eligible). | 3 | Frontend | `UI` |

---

### Story 3.9.5: Order Status Notifications
**Priority:** Medium | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **3.9.5.1** | **[Backend] Email Notification Service** | **Desc:** Build email notification system for order status changes.<br>**AC:**<br>1. Triggered on events: Order Created (Paid), Status Updated (Shipped), etc.<br>2. Uses SendGrid/Nodemailer to send emails.<br>3. Email includes: Invoice ID, items, total, tracking info (if available).<br>4. Respects user notification preferences (opt-in/out in Account Settings).<br>5. Async processing (queue) to avoid blocking checkout. | 3 | Backend | `Email` `Notifications` |
| [ ] | **3.9.5.2** | **[Frontend] Notification Preferences** | **Desc:** Build notification settings in user profile.<br>**AC:**<br>1. Profile settings page includes "Notifications" section.<br>2. Checkboxes for: Order Confirmation, Shipment, Delivery, Reviews Replies (future).<br>3. Email on/off toggle for each notification type.<br>4. "Save" button persists preferences to `lpa_clients` or separate settings table.<br>5. Success confirmation shown. | 2 | Frontend | `UI` |

---

### Story 3.10.1: Quick Reorder
**Priority:** Low | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **3.10.1.1** | **[API] Reorder Helper Endpoint** | **Desc:** Create `POST /api/profile/orders/:invoiceId/reorder` endpoint.<br>**AC:**<br>1. Auth required; verify invoice belongs to user.<br>2. Reads all items from `lpa_invoice_items` for that invoice.<br>3. Checks current stock availability (uses current `lpa_stock.onhand`).<br>4. Returns: items with current prices, stock status, any unavailable items flagged. | 2 | Backend | `API` |
| [ ] | **3.10.1.2** | **[Frontend] Reorder Functionality** | **Desc:** Build quick reorder button and flow.<br>**AC:**<br>1. Order History page: each order row has "Reorder" button.<br>2. Clicking "Reorder" calls 3.10.1.1 API.<br>3. Items added to cart with updated prices and quantities.<br>4. Shows warning for items out of stock (with option to proceed without).<br>5. Redirects to cart and shows "Items added!" confirmation. | 3 | Frontend | `UI` `Logic` |

---

### Story 3.10.2: Purchase Summary Dashboard
**Priority:** Low | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | Labels |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| [ ] | **3.10.2.1** | **[API] User Statistics Endpoint** | **Desc:** Create `GET /api/profile/statistics` endpoint.<br>**AC:**<br>1. Auth required.<br>2. Returns: total_spent (all-time), orders_this_year, avg_order_value, favorite_category.<br>3. Calculates from `lpa_invoices` and `lpa_invoice_items` data.<br>4. Includes spending by month (last 12 months) for chart. | 2 | Backend | `API` |
| [ ] | **3.10.2.2** | **[Frontend] Spending Dashboard** | **Desc:** Build purchase analytics page in user profile.<br>**AC:**<br>1. Dashboard card layout showing: Total Spent, Orders This Year, Avg Order Value, Favorite Category.<br>2. Bar chart showing spending by month (last 12 months).<br>3. Optional loyalty tier display (foundation for future feature).<br>4. "Export as CSV" button for order history.<br>5. Responsive design for mobile viewing. | 3 | Frontend | `UI` `Charts` |

---

## Summary

**Total Tickets: 59 implementation tickets**  
**Total Story Points: 146 points**  
**Estimated Sprints: 8-11 sprints** (at 5 points/day velocity)

All tickets are ordered by product backlog priority and use the standardized `x.y.z.n` naming convention for easy cross-reference with user stories and epics.