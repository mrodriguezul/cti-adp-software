# LPA eComms - Epics (Customer-Facing Application)

**Scope:** This document describes epics for the LPA eComms Web Storefront (customer-facing application only). Admin inventory management and order fulfillment features are handled in a separate Desktop Admin application.

---

## List of Epics

The following Epics group the prioritized use cases into actionable development units. Each Epic contains the technical scope and the business justification.

### Epic-01: Identity & Access Management (IAM)
* **Description:** Build the security layer that manages customer identity, handling secure registration, login, and password management for both registered users and guest shoppers.
* **Priority:** High (P1)
* **Business Value:** Establishes trust and security. Protects customer personal data (GDPR/Privacy compliance) and enables personalized experiences. Reduces fraud by validating user identity before accessing saved addresses and order history.
* **Key Scope:**
    * Implement JWT (JSON Web Token) generation and validation for secure sessions.
    * Create secure registration forms with input validation (Email format, Password strength - min 8 chars).
    * Implement Password Hashing (Bcrypt) before storage in `lpa_clients` database.
    * Support both registered user login and guest checkout flows.
    * Password reset via email verification (future enhancement).

### Epic-02: Core Catalog & Product Discovery
* **Description:** Provide customers with a comprehensive, browsable catalog of products with accurate availability information and detailed product specifications.
* **Priority:** High (P1)
* **Business Value:** The primary revenue driver. Customers cannot purchase what they cannot see. A well-structured, easy-to-navigate catalog ensures accurate product presentation, boosts average order value, and reduces cart abandonment through clear availability status.
* **Key Scope:**
    * **Product Listing:** Grid view with pagination, Image, Name, Price, Stock Status indicators.
    * **Product Detail:** Full description, multiple images, technical specs, price, real-time stock level, "Add to Cart" CTA.
    * **Backend API:** RESTful endpoints to fetch `lpa_stock` data with filtering and pagination support (GET /products, GET /products/:id).
    * **Data:** Display only "Active" products; clearly show "Out of Stock" status for disabled or depleted items.

### Epic-03: Shopping Cart & Session State Management
* **Description:** Implement a persistent, user-friendly shopping cart that holds items before finalization and manages session state across browser sessions.
* **Priority:** High (P1)
* **Business Value:** Directly impacts Conversion Rate. A persistent and easy-to-use cart reduces "Cart Abandonment" by allowing users to save items and resume shopping later. Intuitive quantity controls and clear pricing encourages larger basket sizes (increased Average Order Value).
* **Key Scope:**
    * Develop a persistent Cart using browser LocalStorage/SessionStorage or backend session store.
    * Core functions: Add Item (with quantity), Remove Item, Update Quantity, Clear Cart.
    * Validation: Prevent adding more quantity than available stock; show real-time inventory warnings.
    * Calculate and display Subtotal, Estimated Tax (if applicable), and Grand Total dynamically.
    * Maintain cart state across page navigations and browser refresh.

### Epic-04: Checkout Engine & Order Processing
* **Description:** Implement a smooth, multi-step checkout flow that captures shipping information, processes mock payments, and generates order confirmations.
* **Priority:** High (P1)
* **Business Value:** Revenue Realization. This is the critical conversion moment. A smooth, error-free checkout flow prevents losing customers at the final step. Generates accurate, immutable invoice records for compliance and customer reference.
* **Key Scope:**
    * **Multi-step Checkout Flow:**
        * Step 1: Shipping Address (pre-fill for logged-in users, accept guest input).
        * Step 2: Payment Method Selection & Mock Payment Input (Stripe Test Cards).
        * Step 3: Order Review & Confirmation.
    * **Payment Simulation:** Accept test card details, validate format, simulate success/failure responses.
    * **Order Generation:** Create `lpa_invoices` and `lpa_invoice_items` database records atomically.
    * **Notification:** Display Order Success page with Invoice ID; send confirmation email.
    * **Cart & Inventory:** Clear cart after successful order; update `lpa_stock.onhand` inventory counts.

### Epic-05: Discovery & Search Optimization
* **Description:** Provide powerful search and filtering capabilities to help customers quickly locate specific products within potentially large catalogs.
* **Priority:** Medium (P2)
* **Business Value:** Enhances User Experience (UX) and Sales Velocity. Customers often have specific needs (e.g., "Sony Headphones" or "Budget under $500"). Effective search and filtering reduce "Time to Purchase" and decrease bounce rates when customers cannot find what they want.
* **Key Scope:**
    * **Keyword Search:** Search bar in global navigation; match against Product Name, Description, and SKU.
    * **Filtering Options:** Price Range Min/Max slider, Category multi-select, Stock Status (In Stock / All).
    * **Sorting:** Options for Price (Low-High, High-Low), Name (A-Z), Newest, Relevance.
    * **Search Results:** Display results in paginated grid with clear "No results" messaging.
    * **Performance:** Implement debouncing and pagination to handle large datasets efficiently.

### Epic-06: Customer Account Management & Order History
* **Description:** Allow registered customers to manage personal information, view order history, and access past purchase details for reordering and reference.
* **Priority:** Medium (P2)
* **Business Value:** Customer Retention and Reduced Support Costs. Enabling users to self-manage address updates and view order history reduces support inquiries. Transparent order tracking builds trust and encourages repeat purchases through ease of reordering.
* **Key Scope:**
    * **Profile Management:** View/Edit Name, Email, Phone, Preferred Shipping Address.
    * **Order History:** List of all past purchases with Order ID, Date, Status, and Total Amount.
    * **Order Detail View:** Full order information including items, quantities, prices at purchase time, shipping address, and status.
    * **Reorder Function:** Ability to quickly add previously purchased items back to cart.
    * **Password Management:** Secure password change feature with current password verification.

### Epic-07: Advanced Search & Navigation Enhancements
* **Description:** Provide additional filtering and navigation options to help customers discover products more easily, complementing the core search functionality.
* **Priority:** Medium (P2)
* **Business Value:** Continued Discovery Optimization. Category filtering and advanced navigation reduce cognitive load and discovery time, especially for large catalogs. Customers who use filtering are more likely to find relevant products and complete purchases.
* **Key Scope:**
    * **Category Filtering:** Multi-select category/type filters to browse specific product groups (e.g., Laptops, Headphones, Cables).
    * **Filter Persistence:** Active filters remain visible and can be cleared with a single button.
    * **Navigation UI:** Sidebar or filter panel with checkboxes, clear visual indicators of active filters.
    * **Performance:** Efficient filtering of product grid without page reload (AJAX-based updates).
    * **Integration:** Works seamlessly with search results and other filter types (price, stock status).

### Epic-08: Product Discovery & Personalization (Part 2: Recommendations)
* **Description:** Encourage customers to discover and purchase complementary or related products during their shopping journey through advanced recommendation features.
* **Priority:** Low (P3)
* **Business Value:** Increased Average Order Value (AOV) and Cross-Sell Opportunities. Related products and personalized recommendations guide customers to complementary items they may not have discovered independently. This increases basket size and customer satisfaction by providing relevant suggestions.
* **Key Scope:**
    * **Related Products:** "You Might Also Like" section on product detail pages showing 3-4 complementary items.
    * **Personalized Recommendations:** ML-driven "Recommended For You" section on homepage based on browsing/purchase history.
    * **Recommendation Engine:** Tracks product views, purchases, and cart additions to build customer preference profiles.
    * **Categories & Tagging:** Uses product metadata to identify related items and similar products.
    * **Performance:** Recommendations update dynamically as customer behavior changes.

### Epic-09: Community & Social Features
* **Description:** Build community and social proof through customer reviews, ratings, and engagement features.
* **Priority:** Low (P3)
* **Business Value:** Reduced Purchase Hesitation through Social Proof. Customer reviews and ratings are critical trust signals in e-commerce. Verified reviews increase conversion rates by 5-10%. Community features drive customer loyalty and repeat visits.
* **Key Scope:**
    * **Product Reviews:** Allow verified purchasers to submit star ratings and text reviews after purchase.
    * **Review Display:** Aggregate ratings, helpful voting, and chronological/relevance sorting of reviews on product pages.
    * **Wishlist Sharing:** Allow customers to share wishlists with friends via unique URLs for gift planning and referrals.
    * **Moderation:** Admin capability to approve/reject reviews (handled in separate admin application).
    * **Review Incentives:** Optional future feature for loyalty rewards tied to review submissions.

### Epic-10: Shopping Experience Enhancements
* **Description:** Provide convenience features that reduce friction in the shopping experience and increase customer satisfaction.
* **Priority:** Low (P3)
* **Business Value:** Reduced Cart Abandonment and Increased Repeat Purchase Rate. Quick reorder and spending dashboards eliminate friction for repeat customers. These features demonstrate value understanding of customer needs and increase lifetime customer value.
* **Key Scope:**
    * **Quick Reorder:** One-click reordering of previous purchases with updated pricing and stock verification.
    * **Spending Dashboard:** Customer-facing analytics showing total spending, orders this year, average order value, and favorite categories.
    * **Loyalty Tier Display:** Foundation for future loyalty program integration (e.g., Silver/Gold/Platinum tiers).
    * **Purchase Export:** CSV export of order history for record-keeping and budget tracking.
    * **Visual Analytics:** Charts showing spending trends over time to help customers understand purchasing patterns.