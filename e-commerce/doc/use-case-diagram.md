# LPA eComms - Use Case Diagram (Web Implementation)

## Explanation of the Diagram

* **Actors:** 
  * **Guest User:** Represents an unauthenticated visitor. They can only browse, search, and initiate registration/login.
  * **Registered Customer:** Inherits from Guest (denoted by the white arrow). They gain access to the transactional features (Cart, Checkout, Profile)..
  * **Administrator:** Represents the internal staff (likely using the Desktop interface, but interacting with the same backend logic) who manages the inventory and user base.

* **Key Relationships:**
  * **<<'include'>>:** Used in the "Checkout" flow to show that completing a checkout mandatory requires "Login" (authentication), "Simulating Payment" (transaction), and "Receiving Invoice" (system output).
  * **<<'extend'>>:** Used between "Search" and "Browse" to indicate that searching is an optional helper functionality while browsing the catalog.

### Use Case Diagram

![E-commerce Use Case Diagram](https://www.plantuml.com/plantuml/png/XLHFQzjE4BthKmm--6V3BobDRY64k4fQ0YarTjDS2cLPJQJ5grspEt9gsdxtMYkDy1ZH70pMc_Tsv-tykOsa0ZMrpIo-4927OCgAe301DHdlihWnRgk2gc6hz4QLkAQzHMZ3ofKMiqnfyW4cdngC14yHmmHKXFJ9iHMM9X86B21l8lcw9_47ynP5RTo16HJvZf6GBEllXidZSW6O-xgEiDv7mde2lx8C0E0_E3ixWpiJjTzXsCCKSaNA-X9co_V_m_BYyBkSjwH4Ro9g5H4c7u9_ZGZBu8j64uk-kuDgdb9uodzq7AbRemgwWYbyD9Omy06nLLuCoeubbTyClZ8Txf2KiL7Urp96D2kqYh0GLrqEeZvw_1hthbGbrkW8PgFcFojt8C2pYPKraUI1Z4h9Sp24G_eht1qoaxeEEyvZeRLl746wBkN3HHd9YPk5LV9fE2erZxuqJX8JDEfsYI5wfsnhuiLOb1NhmUFqrvNVReqhOGfVWt9HfT6G5iOk6dIv2YSsMaHgyWhrnZSdF4ObTstgnggs36hVlgPqq8EdhwhHx10UtCuRZU--X083vDwzc52hre-ykEU9AWxJoVR_OPsyti0iNptTpUN17I75HvKfiGXJpZIEoJlIc3vje5QpQAY2jWdqYJOHiZzPbborGvNynCfiurMtjv8j_dTpj044ri-smDBa2eGRLg1zTuwdm5iHPW-kmc2etwRpexIkVnzqJCpu3v_EFInmxZe93Yqc0sB-PM0OyF7inGvF6IT461UGw0WH4BK-ZN0bEOq7fsrJODivzpy9NH7JvKETuFoea705rzUOQ3StMLytE4yKNgI9OxfJEnA_L2AobpTfF8zl4ddcJeYtw8gcjdy1)

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Guest User" as Guest
actor "Registered Customer" as Customer
actor "Administrator" as Admin

package "LPA eComms System" {

    ' --- Discovery & Catalog (P1, P2, P3) ---
    usecase "Browse Product Catalog\n(P1)" as UC_Browse
    usecase "Search & Filter Products\n(P2)" as UC_Search
    usecase "View Product Details\n(P1)" as UC_View
    usecase "View Related Products\n(P3)" as UC_Related

    ' --- Engagement (P3) ---
    usecase "Manage Wishlist\n(P3)" as UC_Wishlist
    usecase "Write Product Review\n(P3)" as UC_Review

    ' --- Account Management (P1, P2) ---
    usecase "Register Account\n(P1)" as UC_Register
    usecase "Login\n(P1)" as UC_Login
    usecase "Manage Personal Profile\n(P2)" as UC_Profile

    ' --- Shopping & Transaction (P1, P2) ---
    usecase "Manage Shopping Cart\n(P1)" as UC_Cart
    usecase "Checkout\n(P1)" as UC_Checkout
    usecase "Simulate Payment\n(P2)" as UC_Payment
    usecase "Receive Invoice/Order Confirmation\n(P1)" as UC_Invoice

    ' --- Administration (P1) ---
    usecase "Manage Stock (CRUD)\n(P1)" as UC_ManageStock
    usecase "Manage Orders & Invoices\n(P1)" as UC_ManageOrders
    usecase "Manage Users\n(Auth Logic)" as UC_ManageUsers
}

' --- Relationships: Guest ---
Guest --> UC_Browse
Guest --> UC_Search
Guest --> UC_View
Guest --> UC_Register
Guest --> UC_Login

' --- Relationships: Customer (Inherits Guest) ---
Guest <|-- Customer
Customer --> UC_Profile
Customer --> UC_Cart
Customer --> UC_Checkout
Customer --> UC_Wishlist
Customer --> UC_Review

' --- Relationships: Administrator ---
Admin --> UC_Login
Admin --> UC_ManageStock
Admin --> UC_ManageOrders
Admin --> UC_ManageUsers

' --- Includes & Extends ---
UC_Search .> UC_Browse : <<extend>>
UC_View ..> UC_Related : <<include>>
UC_Checkout ..> UC_Login : <<include>>
UC_Checkout ..> UC_Payment : <<include>>
UC_Checkout ..> UC_Invoice : <<include>>

@enduml
```

# LPA eComms - Use Case Specifications

## 1. Functional Priority Ranking

This table ranks the 12 system functionalities by their implementation priority and strategic importance to the "LPA eComms" project.

| Rank | Functionality / Use Case | Priority | Importance | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Authentication (Login/Register)** | **High (P1)** | **Critical** | Prerequisite for identifying users and securing the checkout process. |
| **2** | **Product Catalog (Browse/View)** | **High (P1)** | **Critical** | The core purpose of the site; users must be able to see what is for sale. |
| **3** | **Shopping Cart Management** | **High (P1)** | **Critical** | Essential for holding items before purchase; persistence is key. |
| **4** | **Checkout & Invoicing** | **High (P1)** | **Critical** | The revenue generation step; creates the legal financial record (Invoice). |
| **5** | **Stock Management (CRUD)** | **High (P1)** | **Critical** | Admins must be able to add inventory, otherwise, the catalog is empty. |
| **6** | **Order Management** | **High (P1)** | **Critical** | Fulfillment; Admins need to see what has been sold to ship it. |
| **7** | **Search & Filtering** | **Medium (P2)** | **Essential** | Critical for UX when the catalog grows; specific to electronics specs. |
| **8** | **Payment Simulation** | **Medium (P2)** | **Essential** | Validates the checkout flow without processing real money (Stripe Sandbox). |
| **9** | **Customer Profile** | **Medium (P2)** | **Essential** | Allows self-service address updates, reducing admin support load. |
| **10** | **Wishlist** | **Low (P3)** | **Value Add** | Increases retention by allowing users to save items for later. |
| **11** | **Product Reviews** | **Low (P3)** | **Value Add** | Social proof; helps other users make decisions but not vital for launch. |
| **12** | **Related Products** | **Low (P3)** | **Value Add** | Recommendation engine to increase Average Order Value (AOV). |

---

## 2. Detailed Use Case Specifications

The following table details the flow and constraints for each prioritized use case.

| Use Case | Goal | Actors | Pre-conditions | Main Flow | Post-conditions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Authentication** | To securely identify the user and grant access to protected features. | Guest, Customer, Admin | User is not currently logged in. | 1. Actor clicks "Login".<br>2. Actor enters Email/Password.<br>3. System hashes password and compares with DB.<br>4. System issues JWT Token. | User is authenticated; Session token is active. |
| **2. Product Catalog** | To display available products with details (Price, Specs, Stock). | Guest, Customer | None. | 1. User navigates to Shop page.<br>2. System fetches list from `lpa_stock`.<br>3. User clicks a product.<br>4. System displays Product Detail View. | User views accurate product data. |
| **3. Shopping Cart** | To temporarily store items intended for purchase. | Guest, Customer | Product has valid stock (>0). | 1. User clicks "Add to Cart" on a product.<br>2. System validates stock availability.<br>3. System updates Cart State (Local/Session).<br>4. User views Cart to edit Qty/Remove items. | Item is added to session cart; Stock is **not** reserved yet. |
| **4. Checkout & Invoice** | To finalize the purchase and generate a sales record. | Customer | Cart is not empty; User is logged in. | 1. User initiates Checkout.<br>2. System retrieves saved Shipping Address.<br>3. User confirms Order Summary.<br>4. System creates `lpa_invoice` record.<br>5. System deducts `lpa_stock` count. | Invoice created in DB; Inventory decreased; Cart cleared. |
| **5. Stock Management** | To Create, Read, Update, or Delete inventory items. | Admin | Admin is logged in via Desktop App. | 1. Admin selects "Stock Management".<br>2. Admin enters Item Details (Name, Price).<br>3. Admin clicks "Save".<br>4. System commits to `lpa_stock`. | New product is visible in the Web Catalog immediately. |
| **6. Order Management** | To view and process customer orders. | Admin | Admin is logged in via Desktop App. | 1. Admin selects "Invoices".<br>2. System displays list of `lpa_invoices`.<br>3. Admin filters by Status (e.g., "Paid").<br>4. Admin views specific Invoice details. | Admin is informed of shipping requirements. |
| **7. Search & Filtering** | To quickly locate specific products by attributes. | Guest, Customer | Product Catalog is populated. | 1. User types query (e.g., "Sony").<br>2. User selects filter (e.g., "Price < $500").<br>3. System queries DB with `LIKE` or `WHERE` clauses.<br>4. System updates Product List. | User sees a refined list of relevant products. |
| **8. Payment Simulation** | To validate payment details without real charges. | Customer | User is in Checkout flow (Step 3). | 1. User selects "Credit Card".<br>2. User enters Mock Data (e.g., `4242...`).<br>3. System "pings" Stripe Sandbox.<br>4. Service returns "Success" token. | Payment status recorded as 'Paid' (P) locally. |
| **9. Customer Profile** | To allow users to update their personal information. | Customer | User is logged in. | 1. User goes to "My Profile".<br>2. User updates "Shipping Address".<br>3. User clicks "Save".<br>4. System updates `lpa_clients` table. | Next Checkout will auto-fill the new address. |
| **10. Wishlist** | To save items for future consideration. | Customer | User is logged in. | 1. User clicks "Heart" icon on product.<br>2. System adds Item ID to User's Wishlist collection.<br>3. User can view Wishlist later. | Item is saved to profile; No stock is reserved. |
| **11. Product Reviews** | To leave feedback on purchased items. | Customer | User has purchased the item (Verified). | 1. User views Order History.<br>2. User clicks "Write Review".<br>3. User sets Star Rating & Comment.<br>4. System saves review linked to Product. | Review is visible to other customers on Product Page. |
| **12. Related Products** | To suggest items based on current context. | Guest, Customer | User is viewing a Product Detail page. | 1. User views "Laptop".<br>2. System queries DB for same Category (e.g., "Accessories").<br>3. System displays "Mouse" and "Case". | Suggestions appear at bottom of page (Cross-sell). |

