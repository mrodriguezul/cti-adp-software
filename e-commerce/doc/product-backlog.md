# LPA eComms - Strategic Product Backlog (Corrected)

## Strategic Ordering Logic
The backlog is ordered based on the **"Dependency & Value Chain"** method:
1.  **Foundation (Ranks 1-4):** Identity and Stock Management. Without these, no other feature can exist.
2.  **Revenue Loop (Ranks 5-11):** The critical path for a user to find a product, cart it, and pay. This constitutes the MVP.
3.  **Operational Closure (Ranks 12-14):** Tools for staff to actually fulfill the orders sold.
4.  **UX Friction Removal (Ranks 15-19):** Features that make buying *easier* (Search, Filters).
5.  **Retention & Growth (Ranks 20-29):** Features that encourage repeat visits (Wishlist, Reviews, History).

---

## The Complete Backlog (29 Items)

| Rank | ID | Story Name | Phase | Value | Effort | Strategic Rationale (Criteria Analysis) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **1.1.3** | **Password Encryption** | MVP | Critical | 3 | **Risk & Foundation:** Security is a hard constraint. We cannot safely test registration without encryption logic (Bcrypt) in place first. |
| **2** | **1.2.3** | **Admin: Add Stock** | MVP | Critical | 5 | **Dependency:** The "Chicken and Egg" problem. Admins must populate the DB before customers can view a catalog. |
| **3** | **1.2.1** | **View Product List** | MVP | High | 5 | **User Impact:** The primary entry point. If customers can't see products, the site has no value. |
| **4** | **1.2.2** | **Product Detail View** | MVP | High | 3 | **User Impact:** Essential for electronics. Customers need specs/details to decide to buy. |
| **5** | **1.1.1** | **Register Account** | MVP | High | 5 | **Dependency:** Checkout requires a registered user. Capturing user data early enables the sales funnel. |
| **6** | **1.1.2** | **Login** | MVP | High | 3 | **Dependency:** Prerequisite for the Cart and Checkout session logic. |
| **7** | **1.3.1** | **Add to Cart** | MVP | High | 3 | **Business Value:** Captures purchase intent. The first step of the conversion funnel. |
| **8** | **1.3.2** | **View Cart** | MVP | High | 2 | **UX:** Users need cost confirmation and a summary before committing to payment. |
| **9** | **1.4.1** | **Checkout: Address** | MVP | High | 3 | **Business Value:** Captures the shipping contract. Essential for the invoice data structure. |
| **10** | **1.4.2** | **Simulate Payment** | MVP | Critical | 5 | **Risk & Value:** High technical risk (API integration). Must be tackled early to ensure transactions work. |
| **11** | **1.4.3** | **Order Confirmation** | MVP | Critical | 5 | **Business Value:** The "Handshake." Finalizes revenue, generates the Invoice, and updates Inventory. |
| **12** | **1.5.1** | **Admin: View Orders** | MVP | High | 3 | **Urgency:** Once orders arrive, staff immediately need visibility to prevent a fulfillment backlog. |
| **13** | **1.5.2** | **Admin: Order Details** | MVP | High | 2 | **Urgency:** Operational necessity. Staff cannot pack a box if they don't know *what* is in the order. |
| **14** | **1.5.3** | **Admin: Ship Order** | MVP | Med | 2 | **Operations:** Completes the lifecycle. Lower complexity, but finishes the MVP loop. |
| **15** | **2.6.1** | **Keyword Search** | V1 | High | 5 | **UX Impact:** As the catalog grows, browsing becomes painful. Search is the highest ROI UX improvement. |
| **16** | **2.6.2** | **Filter by Price** | V1 | Med | 3 | **UX Impact:** Critical for electronics shoppers with strict budgets. Improves conversion rate. |
| **17** | **1.3.3** | **Edit Cart Items** | MVP* | Med | 3 | **UX:** Nice to have for launch, but users can survive by removing/re-adding items. Lower priority in MVP. |
| **18** | **1.2.4** | **Admin: Update Stock** | MVP* | Med | 3 | **Risk:** Operational risk if prices are wrong, but "Add Stock" (1.2.3) covers initial setup. |
| **19** | **2.7.1** | **Update Profile** | V1 | Med | 3 | **Retention:** Reduces friction for returning users (auto-fill address). Good V1 candidate. |
| **20** | **2.6.3** | **Filter by Category** | V1 | Med | 3 | **UX:** Useful, but Keyword Search usually covers this need for smaller catalogs. |
| **21** | **2.7.2** | **Order History List** | V1 | Low | 5 | **Retention:** Useful for users to track spending, but not critical for store function. |
| **22** | **2.7.3** | **View Order Details** | V1 | Med | 3 | **Retention:** *Previously Missing.* Allows users to see exactly what they bought in past orders. Dependent on 2.7.2. |
| **23** | **3.6.5** | **Related Products** | V2 | Low | 5 | **Growth:** Increases Average Order Value (AOV). Best for V2 when we have data. |
| **24** | **3.7.8** | **Read Reviews** | V2 | Low | 3 | **Growth:** Social proof is powerful, but requires a critical mass of sales first. |
| **25** | **3.7.7** | **Write Review** | V2 | Low | 5 | **Growth:** Dependent on "Read Reviews" to be useful. |
| **26** | **3.7.5** | **Add to Wishlist** | V2 | Low | 3 | **Retention:** Allows saving interest without buying. |
| **27** | **3.7.6** | **View Wishlist** | V2 | Low | 3 | **Retention:** *Previously Missing.* The necessary companion to "Add to Wishlist". |
| **28** | **2.6.4** | **Sort Products** | V1 | Low | 2 | **UX:** Low effort, but also low impact compared to Filters. |
| **29** | **2.7.4** | **Change Password** | V1 | Low | 3 | **Security:** Edge case. Users can contact admin for resets in early versions. |
