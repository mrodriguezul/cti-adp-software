# LPA eComms - Phase 3 (Growth & Engagement) User Stories

This document outlines the user stories for Phase 3, focusing on increasing user retention, social proof, and average order size.

## Epic-06: Discovery & Search Optimization (Part 2: Recommendations)
**Goal:** Encourage users to buy more items by suggesting relevant products during their shopping journey.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **3.6.5** | **As a Shopper**, I want to **see "Related Products"** when viewing an item so that I can easily find compatible accessories (e.g., a mouse for a laptop). | Low | 5 | 1. "You Might Also Like" section appears at the bottom of the Product Detail page.<br>2. System queries 3-4 other items from the same Category.<br>3. Clicking a related item navigates to its detail page.<br>4. Section is hidden if no other items exist in that category. |

---

## Epic-07: Customer Dashboard & Engagement (Part 2: Community)
**Goal:** Build a relationship with the customer by allowing them to save items for later and share their experiences.

| ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **3.7.5** | **As a Window Shopper**, I want to **add items to a Wishlist** so that I can save them for when I have the money. | Low | 3 | 1. "Heart" or "Save for Later" icon appears on Product Cards.<br>2. Clicking adds the Product ID to the user's `lpa_wishlist` table.<br>3. Icon changes state (e.g., filled red) to indicate "Saved".<br>4. Requires Login (redirects if Guest). |
| **3.7.6** | **As a Returning Customer**, I want to **view my Wishlist** so that I can quickly buy the items I saved previously. | Low | 3 | 1. "My Wishlist" page lists all saved products with current Price and Stock status.<br>2. "Move to Cart" button moves the item to the active cart and removes it from the wishlist.<br>3. "Remove" button deletes the item from the list. |
| **3.7.7** | **As a Verified Buyer**, I want to **write a review for a product** so that I can share my opinion with others. | Low | 5 | 1. User can only review items they have actually purchased (System checks `lpa_invoices`).<br>2. Form accepts a Star Rating (1-5) and a Text Comment.<br>3. Review is saved to the database linked to the User and Product. |
| **3.7.8** | **As a Shopper**, I want to **read reviews from other customers** so that I can make a confident buying decision. | Low | 3 | 1. Product Detail page displays an "Average Rating" (e.g., 4.5 Stars).<br>2. "Reviews" tab lists individual comments with Date and User First Name.<br>3. List is paginated (e.g., 5 reviews per page). |