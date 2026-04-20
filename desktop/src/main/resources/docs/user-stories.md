# Product Backlog: LPA Desktop Management System

## Epic-01: Core Application Shell & Navigation
**Goal:** Establish the main Multi-Document Interface (MDI) using JavaFX to house all application modules securely, providing a unified navigation experience for internal staff.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
|:-------| :--- | :--- | :--- | :--- | :--- |
| `[x]`  | **1.1** | **As an internal user**, I want **the application to open in a maximized main workspace** so that I have a large, focused area to manage all business operations. | High | 3 | 1. Application launches with a main parent `JFrame` (or JavaFX Stage) set to maximized state.<br>2. The window title displays the application name.<br>3. A desktop pane area is initialized to act as the container for future `JInternalFrame` (or JavaFX equivalent) child views.<br>4. The shell remains completely decoupled from specific module logic. |
| `[x]`  | **1.2** | **As an internal user**, I want **a fixed navigation menu at the top of the screen** so that I can easily switch between Stock, Sales, Admin, and Help modules. | High | 5 | 1. Menu Bar spans the full width of the application from left to right.<br>2. Menu hierarchy exactly matches the specification (Stock Management, Sales and Invoicing > Invoices/Clients, System Administration > User Management, Exit, Help > User Guide/About).<br>3. Separator lines are visually implemented as specified.<br>4. Clicking a menu item programmatically loads the corresponding view into the main desktop pane without launching separate external windows. |

## Epic-02: Authentication Gateway
**Goal:** Secure the application by implementing a login barrier that verifies credentials against the PostgreSQL database before granting access to the MDI shell.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **2.1** | **As a staff member**, I want to **log in securely** so that unauthorized individuals cannot access sensitive company data. | High | 5 | 1. A standalone Login interface appears before the main shell is launched.<br>2. User inputs `username` and `password`.<br>3. System validates the password against the secure hash stored in `lpa_users`.<br>4. System verifies that the user's `status` is 'A' (Active).<br>5. Upon success, the main shell is launched; upon failure, a clear error message is displayed. |
| `[ ]` | **2.2** | **As a system administrator**, I want **the system to restrict access based on user roles** so that normal users cannot access administrative functions. | High | 3 | 1. Upon login, the user's `role` is stored in a session context.<br>2. If the role is 'user', the "System Administration" menu is hidden or disabled.<br>3. If the role is 'admin', all menus remain visible and accessible.<br>4. Domain logic handling permissions is covered by unit tests. |

## Epic-03: Stock Management UI Refactoring & Integration
**Goal:** Migrate the existing standalone JavaFX Stock Management application into the new MDI shell while ensuring strict data validation and preserving its internal architecture.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **3.1** | **As an inventory manager**, I want to **open the Stock Management interface within the main shell** so that my workspace remains unified. | High | 5 | 1. The existing `stock-view.fxml` is refactored to load as a child view within the main shell's desktop pane.<br>2. The layout remains responsive and matches the existing mobile application interface requirements.<br>3. The UI presentation layer relies solely on the `StockService` to handle operations, maintaining clear boundary segregation. |
| `[ ]` | **3.2** | **As an inventory manager**, I want the system to **validate my stock entries before saving** so that inventory records remain mathematically sound and accurate. | High | 5 | 1. UI validates that `onhand` quantity is greater than or equal to 0 before saving.<br>2. UI validates that `price` is greater than or equal to 0.00 before saving.<br>3. Database constraints (`check_stock_positive`, `check_price_positive`) are successfully mapped and handled if triggered.<br>4. Product status is properly captured as 'A' or 'D'. |

## Epic-04: User Management System
**Goal:** Provide an administrative interface to manage staff accounts, enforcing robust constraints and role assignments.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **4.1** | **As a system administrator**, I want to **create new internal staff accounts** so that new hires can access the system. | Medium | 8 | 1. UI includes labels and text fields for User ID, Username, First Name, Last Name.<br>2. UI includes a Role dropdown combo box with options matching the requirements (normal user, admin user).<br>3. UI includes a Status dropdown combo box for Enabled ('A') and Disabled ('D').<br>4. System validates that the `username` is unique before inserting into `lpa_users`.<br>5. Passwords for new users are hashed before persistence. |
| `[ ]` | **4.2** | **As a system administrator**, I want to **disable a staff member's account** so that departed employees lose system access immediately. | Medium | 3 | 1. Selecting an existing user populates their data in the form.<br>2. Changing the status dropdown to 'Disabled' updates the user's `status` to 'D' in the `lpa_users` table.<br>3. The action executes via the domain repository interfaces without leaking SQL logic to the controller. |

## Epic-05: Client Management System
**Goal:** Provide a read-only dashboard to view customer profiles that have been registered via the e-commerce storefront.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **5.1** | **As a staff member**, I want to **view a list of registered clients** so that I can look up their contact and billing details. | Medium | 5 | 1. UI is accessible via Sales and Invoicing > Clients.<br>2. A data grid/table displays existing client records fetched from `lpa_clients`.<br>3. View displays First Name, Last Name, Address, Phone, Email, and Status.<br>4. The interface strictly implements read-only repository patterns following SOLID principles, preventing any accidental data modification from the desktop client. |

## Epic-06: Sales and Invoicing Management
**Goal:** Provide a comprehensive view of e-commerce orders and allow staff to manage fulfillment statuses.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **6.1** | **As a staff member**, I want to **view a list of all client invoices** so that I can monitor incoming online orders. | High | 8 | 1. UI accessible via Sales and Invoicing > Invoices.<br>2. A data grid displays header records from `lpa_invoices`.<br>3. View displays `invoice_number`, `client_name`, `amount`, and `status`.<br>4. The layout utilizes read-only views for historical snapshots, ensuring past financial data is not editable. |
| `[ ]` | **6.2** | **As a staff member**, I want to **view the specific line items of an invoice** so that I know what products need to be packed and fulfilled. | High | 5 | 1. Selecting an invoice from the main list populates a detail view with related `lpa_invoice_items`.<br>2. Detail view displays `stock_name`, `price`, `quantity`, and `subtotal` for each item. |
| `[ ]` | **6.3** | **As a fulfillment manager**, I want to **update the fulfillment status of an invoice** so that the system accurately reflects whether an order is paid, unpaid, or shipped. | High | 5 | 1. While viewing an invoice, the user can change its status.<br>2. Status updates are strictly limited to 'P' (Paid), 'U' (Unpaid), or 'S' (Shipped) and saved to `lpa_invoices`. |

## Epic-07: Help and System Documentation
**Goal:** Provide built-in user assistance and system information to reduce training overhead for staff.

| Status | ID | User Story | Priority | Est. (Pts) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **7.1** | **As an internal user**, I want to **access system guides and version info** so that I can get help without leaving the application. | Low | 2 | 1. Clicking "User Guide" under the Help menu opens a text view or bundled PDF detailing basic workflows.<br>2. Clicking "About" opens a small modal displaying the application title, version number, and current database connection status.<br>3. Both options are accessible regardless of the user's assigned role. |