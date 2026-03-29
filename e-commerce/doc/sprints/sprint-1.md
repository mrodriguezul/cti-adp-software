# Sprint 1: Core Product Catalog & Shopping Cart

## Sprint Goal
Build the core product catalog and shopping cart experience, enabling customers to browse products, view detailed information, and manage items in their cart before checkout.

**Duration:** TBD
**Scope:** 5 User Stories | 6 Implementation Tickets | Estimated Effort: 17 Points

---

## Sprint 1 User Stories

| Status | ID | User Story | Priority | Est. (Pts) |
| :---: | :--- | :--- | :--- | :--- |
| [x] | **1.2.1** | **As a Shopper**, I want to **view a list of all available products** so that I can browse what the store has to offer. | High | 5 |
| [x] | **1.2.2** | **As a Shopper**, I want to **click on a product to see its details** so that I can read the technical specs and check availability. | High | 3 |
| [x] | **1.3.1** | **As a Shopper**, I want to **add an item to my cart** so that I can purchase it later. | High | 3 |
| [x] | **1.3.2** | **As a Shopper**, I want to **view my current cart** so that I can see the total cost and what I have selected. | High | 2 |
| [x] | **1.3.3** | **As a Shopper**, I want to **change quantities or remove items** from my cart so that I can manage my budget before checking out. | Medium | 3 |

---

## Sprint 1 Implementation Tickets

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Domain | Effort |
| :---: | :--- | :--- | :--- | :--- | :--- |
| [x] | **1.2.1.1** | **[Backend] Public Product List Endpoint** | **Desc:** Create `GET /api/products` endpoint.<br>**AC:**<br>1. Returns JSON array of products from `lpa_stock`.<br>2. Supports pagination: `?page=1&limit=12`.<br>3. Returns only Active products (status='A').<br>4. Each product includes: id, sku, name, description, price, onhand, image_url.<br>5. Returns count and hasMore for pagination. | Backend | 3 |
| [x] | **1.2.1.2** | **[Frontend] Product Grid UI** | **Desc:** Build responsive product grid component.<br>**AC:**<br>1. Displays products in responsive grid (4 cols desktop, 2 mobile).<br>2. Each product card displays product image at the top.<br>3. Below image: product `sku` in small, muted text.<br>4. Product `name` displayed as bold heading.<br>5. Product `description` truncated to 2 lines.<br>6. Card footer: `price` (bolded) and `stock` count (e.g., "45 in stock") stacked on the left; "Add to Cart" button with cart icon on the right.<br>7. Out-of-stock items grayed out but visible.<br>8. Pagination buttons or "Load More".<br>9. Loading state displayed during fetch. | Frontend | 5 |
| [x] | **1.2.2.1** | **[Frontend] Product Detail Page** | **Desc:** Build single product detail page (`/product/:id`).<br>**AC:**<br>1. Include a "<- Back to Products" navigation link at the top of the page.<br>2. Implement a two-column layout for desktop screens.<br>3. Left Column: Display a large, rounded product image.<br>4. Right Column (Top): Display the product `sku` in small muted text, followed by the `name` as a large bold heading, and then the `description`.<br>5. Right Column (Pricing): Display the `price` prominently, with the `stock` count (e.g., "X in stock") stacked below it in muted text.<br>6. Right Column (Actions): Include a "Qty" label and a number input field (defaulting to 1), positioned next to a primary "Add to Cart" button that features a shopping cart icon.<br>7. Fetches product data from `GET /api/products/:id`.<br>8. Loading and error states handled. | Frontend | 3 |
| [x] | **1.3.1.1** | **[Frontend] Cart State Management** | **Desc:** Build global cart state using Context API or Redux.<br>**AC:**<br>1. Cart stores: itemId, quantity, price snapshot.<br>2. `addToCart(itemId, qty)` function prevents qty > stock.<br>3. Cart persists across page navigation (LocalStorage).<br>4. Cart persists on page refresh.<br>5. Events trigger for cart updates (e.g., navbar counter). | Frontend | 5 |
| [x] | **1.3.2.1** | **[Frontend] Shopping Cart Page** | **Desc:** Build cart review page (`/cart`).<br>**AC:**<br>1. Render a table-style layout with headers: Product, Price, Qty, Amount.<br>2. Product Column: Display a rounded thumbnail image, the product name, and the product `sku` positioned underneath the name in small, muted text.<br>3. Interactive Controls: Display a number input field for the Quantity, and a red trash can icon on the far right of the row for item removal.<br>4. Totals: Calculate and display the row "Amount" (Price * Qty) in bold. At the bottom of the list, display a single "Total" row with the final sum.<br>5. Primary Action: Render a right-aligned "Proceed to Checkout" primary button featuring a right-arrow icon below the cart total.<br>6. Empty State: If the cart is empty, display a friendly message with a "Continue Shopping" button. | Frontend | 3 |
| [x] | **1.3.3.1** | **[Frontend] Cart Item Editing Controls** | **Desc:** Build quantity adjustment and removal UI.<br>**AC:**<br>1. Use a native HTML number input field for quantity adjustment (built-in up/down arrows).<br>2. Input validation enforces `min="1"` (preventing 0 or negative inputs) and `max={stockLimit}`.<br>3. Clicking the dedicated "Remove" (Trash) button deletes the item from the cart.<br>4. Cart totals update immediately via React Context without a page reload.<br>5. Context logic and UI notifications (Toasts) prevent users from exceeding available `onhand` stock limits. | Frontend | 3 |

---

## Sprint Metrics

| Metric | Value |
| :--- | :--- |
| Total User Stories | 5 |
| Total Tickets | 6 |
| Total Story Points | 16 |
| Total Ticket Effort (man-days) | 22 |
| Backend Tickets | 1 |
| Frontend Tickets | 5 |

---

## Dependencies & Notes

- **Blockers:** Story 1.2.1 (backend endpoint) must be completed before Stories 1.2.2 and 1.3.1 can proceed (frontend requires API data)
- **Architecture Decision:** Cart state managed in frontend (LocalStorage) for MVP; future phases may move to backend sessions
- **Testing Plan:** Unit tests for cart state logic; API integration tests for `/api/products` endpoint; E2E tests for cart workflow (add → view → edit)
- **Definition of Done:** All AC met, code reviewed, tests passing, documented API contracts, no console errors
