# LPA eComms - Phase 3 (Growth & Customer Engagement) User Stories

This document outlines the user stories for Phase 3, focusing on increasing customer retention, social proof, average order value, and personalization features.

**Scope:** Phase 3 adds engagement and community features that build customer loyalty and encourage repeat purchases. All features remain customer-facing with no admin functionality.

---

## Epic-08: Product Discovery & Personalization (Part 2: Recommendations)
**Goal:** Encourage customers to discover and purchase complementary or related products during their shopping journey.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :---: | :--- | :--- | :--- | :--- | :--- |
| [ ] | **3.8.1** | **As a Shopper**, I want to **see "Related Products"** when viewing a product so that I can easily find compatible or complementary items. | Low | 5 | 1. Product Detail page displays a "You Might Also Like" section below the description.<br>2. System queries and displays 3-4 other products from the same category or with similar tags.<br>3. Clicking a related product card navigates to its detail page.<br>4. Section is hidden if no related items exist (instead of showing empty state).<br>5. Related products are randomly selected/rotated on each page load (for discovery). |
| [ ] | **3.8.2** | **As a Shopper**, I want to **see personalized product recommendations** based on my browsing and purchase history so that I can discover items I might like. | Low | 8 | 1. Homepage displays a "Recommended For You" section (visible only to logged-in customers).<br>2. Recommendations are based on products viewed or purchased in the past 30 days.<br>3. System avoids recommending products already in cart or previously purchased.<br>4. Section shows 4-6 products in a carousel or grid format.<br>5. Recommendations update when user browses new products or completes purchases. |

---

## Epic-09: Customer Engagement & Community
**Goal:** Build customer relationships and social proof by enabling reviews, wishlists, and engagement features.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :---: | :--- | :--- | :--- | :--- | :--- |
| [ ] | **3.9.1** | **As a Window Shopper**, I want to **add items to a Wishlist** so that I can save them for future consideration or gift planning. | Low | 3 | 1. "Heart" or "Save for Later" icon appears on all Product Cards (catalog and search results).<br>2. Clicking the icon (when logged in) adds the product to user's wishlist.<br>3. Icon changes state (e.g., filled red heart) to indicate item is saved.<br>4. Guest users are prompted to login before adding to wishlist.<br>5. Wishlist persists across browser sessions. |
| [ ] | **3.9.2** | **As a Returning Customer**, I want to **view and manage my Wishlist** so that I can easily purchase saved items or share my list with friends. | Low | 3 | 1. "My Wishlist" page lists all saved products in a grid layout.<br>2. Each item shows: Product Image, Name, Current Price, Stock Status, and "Add to Cart" button.<br>3. Current price is displayed (not saved price) to reflect recent changes.<br>4. "Remove from Wishlist" button (X icon) removes items from the list.<br>5. Wishlist can be shared via a unique URL (tracks referrals). |
| [ ] | **3.9.3** | **As a Verified Buyer**, I want to **write a review for a product** so that I can share my experience and help other customers make informed decisions. | Low | 5 | 1. "Write a Review" button appears on Product Detail page only for logged-in users who have purchased the product (verified via `lpa_invoices`).<br>2. Review form accepts: Star Rating (1-5 stars, visually interactive), Review Title, and Review Text (min 10 chars).<br>3. User can optionally upload photos with review (future phase).<br>4. Upon submission, review is saved with user's First Name, profile picture (if available), and timestamp.<br>5. Success message appears; review is visible after admin moderation (or immediately with moderation flag). |
| [ ] | **3.9.4** | **As a Shopper**, I want to **read reviews from other customers** so that I can make confident purchasing decisions based on real user experiences. | Low | 3 | 1. Product Detail page displays an "Average Rating" badge (e.g., "4.5 ⭐ out of 5 based on 42 reviews").<br>2. "Customer Reviews" tab/section lists individual reviews sorted by Helpful/Recent.<br>3. Each review shows: Star Rating, Title, Text excerpt, Author's First Name, Date, and "Helpful?" voting count.<br>4. Reviews are paginated (5 reviews per page with Load More option).<br>5. Only reviews with Status="Approved" are displayed (reviews awaiting moderation are hidden). |
| [ ] | **3.9.5** | **As a Customer**, I want to **receive notifications about order status updates** so that I know when my order ships and is on its way. | Medium | 5 | 1. After checkout, customer receives email confirmation with Order ID and expected delivery timeframe.<br>2. When order status changes (Paid → Shipped), customer receives email with tracking information (if available).<br>3. User can opt-in/out of notifications in Account Settings.<br>4. Notification preference center allows selection of notification types (Email, SMS - future, etc.).<br>5. Each email includes order details, tracking link, and customer service contact info. |

---

## Epic-10: Shopping Experience Enhancements
**Goal:** Provide convenience features that reduce friction and increase customer satisfaction.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :---: | :--- | :--- | :--- | :--- | :--- |
| [ ] | **3.10.1** | **As a Repeat Customer**, I want to **quickly reorder items from my past purchases** so that I can save time when buying the same products again. | Low | 3 | 1. "My Orders" detail view includes a "Reorder" button for each past order or individual items.<br>2. Clicking "Reorder" adds all items (or selected items) back to cart with same quantities.<br>3. Prices are updated to current values (not historical prices).<br>4. User can adjust quantities before proceeding to checkout.<br>5. Out-of-stock items are flagged with a warning before checkout. |
| [ ] | **3.10.2** | **As a Frequent Buyer**, I want to **track my spending and view my purchase summary** so that I can manage my budget and loyalty status. | Low | 3 | 1. "Purchase History" or "My Account" page displays a spending summary dashboard.<br>2. Summary shows: Total Spent (all-time), Orders This Year, Average Order Value, and Favorite Product Category.<br>3. Visual chart shows spending by month (last 12 months).<br>4. Section for membership/loyalty tier (if applicable - future integration).<br>5. Export order history as CSV (for record-keeping). |

---