### Story 1.1: As an internal user, I want the application to open in a maximized main workspace so that I have a large, focused area to manage all business operations.
**Priority:** High | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | References | Labels/Tags |
|:-------| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[x]`  | **1.1.1** | Initialize Main Application Window | **Purpose:** Establish the parent workspace container.<br>**Details:** Create the primary Java/JavaFX main window set to maximize on launch.<br>**AC:**<br>- App compiles and launches.<br>- Window opens maximized by default.<br>- Title is "LPA Management System". | 1 | Frontend | Story 1.1 | Task, UI, Core |
| `[x]`  | **1.1.2** | Implement MDI Desktop Pane | **Purpose:** Provide a container for child modules.<br>**Details:** Add a `JDesktopPane` (or TabPane) below the menu area to load internal frames.<br>**AC:**<br>- Pane stretches to fill available window space.<br>- Pane successfully accepts and renders a dummy child node. | 2 | Frontend | Story 1.1 | Task, UI |

### Story 1.2: As an internal user, I want a fixed navigation menu at the top of the screen so that I can easily switch between modules.
**Priority:** High | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | References | Labels/Tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **1.2.1** | Build Global Menu Bar UI | **Purpose:** Create the main navigation interface.<br>**Details:** Construct the menu hierarchy (Stock, Sales > Invoices/Clients, Admin, Help) with separator lines.<br>**AC:**<br>- Menu is fixed at the top, 100% width.<br>- All items and separators match PRD structure. | 2 | Frontend | Story 1.2 | Task, UI |
| `[ ]` | **1.2.2** | Implement Menu Event Routing | **Purpose:** Connect menu clicks to view rendering.<br>**Details:** Wire action listeners to menu items to load the respective child views into the MDI pane.<br>**AC:**<br>- Clicking a menu item clears current view and loads correct FXML/Frame.<br>- Invalid views throw a graceful UI error. | 3 | Frontend | Story 1.2 | Task, UI, Logic |

### Story 2.1: As a staff member, I want to log in securely so that unauthorized individuals cannot access sensitive company data.
**Priority:** High | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | References | Labels/Tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **2.1.1** | Auth Domain & DB Repository | **Purpose:** Validate user credentials.<br>**Details:** Implement `UserAuthenticationService` and PostgreSQL repository targeting `lpa_users`.<br>**AC:**<br>- TDD tests pass for valid/invalid logins.<br>- Verifies Bcrypt/Argon2 hashes.<br>- Rejects users with status 'D'. | 3 | Backend | Story 2.1 | Task, Backend, Security |
| `[ ]` | **2.1.2** | Login UI & Controller Integration | **Purpose:** Provide user-facing login screen.<br>**Details:** Build standalone login view launching before the main shell.<br>**AC:**<br>- View captures username/password.<br>- Shows error message on failure.<br>- On success, closes login and launches Main Shell. | 2 | Frontend | Story 2.1 | Task, UI |

### Story 2.2: As a system administrator, I want the system to restrict access based on user roles so that normal users cannot access administrative functions.
**Priority:** High | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | References | Labels/Tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **2.2.1** | Implement Session State & Role Toggle | **Purpose:** Enforce UI security based on user role.<br>**Details:** Store the authenticated user's role in a global session manager. Update the Main Menu controller to check this role.<br>**AC:**<br>- If role is 'user', System Administration menu is disabled/hidden.<br>- If role is 'admin', all menus are visible. | 3 | Full-Stack | Story 2.2, lpa_ecomms_schema.sql | Task, Security, UI |

### Story 3.1: As an inventory manager, I want to open the Stock Management interface within the main shell so that my workspace remains unified.
**Priority:** High | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | References | Labels/Tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **3.1.1** | Refactor Stock UI to Internal View | **Purpose:** Adapt standalone code to new shell.<br>**Details:** Convert existing Stock `JFrame` into a `JInternalFrame` or embedded FXML.<br>**AC:**<br>- View loads inside main MDI pane via menu click.<br>- UI layout remains unbroken. | 3 | Frontend | Story 3.1 | Improvement, UI |
| `[ ]` | **3.1.2** | Verify Stock Service Segregation | **Purpose:** Ensure DDD architecture is preserved.<br>**Details:** Check that `StockController` only interacts with `StockService`.<br>**AC:**<br>- UI performs CRUD operations successfully.<br>- Domain tests pass without modification. | 2 | Backend | Story 3.1 | Task, Architecture |

### Story 3.2: As an inventory manager, I want the system to validate my stock entries before saving so that inventory records remain mathematically sound and accurate.
**Priority:** High | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | References | Labels/Tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **3.2.1** | Implement Domain & UI Validation | **Purpose:** Prevent invalid data from reaching the database.<br>**Details:** Update `Stock` domain model and UI controller to validate inputs before passing to the repository.<br>**AC:**<br>- Rejects `onhand` < 0.<br>- Rejects `price` < 0.<br>- UI displays clear validation error messages. | 5 | Full-Stack | Story 3.2, lpa_ecomms_schema.sql | Task, Backend, UI |

### Story 4.1: As a system administrator, I want to create new internal staff accounts so that new hires can access the system.
**Priority:** Medium | **Story Points:** 8

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | References | Labels/Tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **4.1.1** | User Management FXML View | **Purpose:** Create the UI for staff administration.<br>**Details:** Build the form with inputs for ID, Username, First Name, Last Name, Role, and Status.<br>**AC:**<br>- Layout matches requirements.<br>- Role combo box shows "user", "admin".<br>- Status combo box shows "A", "D". | 3 | Frontend | Story 4.1 | Task, UI |
| `[ ]` | **4.1.2** | User Repository Write Implementation | **Purpose:** Persist new user data securely.<br>**Details:** Add insert methods to the PostgreSQL user repository. Implement password hashing before save.<br>**AC:**<br>- New records save successfully to `lpa_users`.<br>- Passwords are hashed.<br>- Validates username uniqueness. | 5 | Backend | Story 4.1, lpa_ecomms_schema.sql | Task, Backend, DB |

### Story 4.2: As a system administrator, I want to disable a staff member's account so that departed employees lose system access immediately.
**Priority:** Medium | **Story Points:** 3

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | References | Labels/Tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **4.2.1** | User Status Update Logic | **Purpose:** Allow admins to deactivate accounts.<br>**Details:** Wire the UI to fetch a user, allow status change in the combo box, and execute an update via the repository.<br>**AC:**<br>- Changing status to 'D' updates DB successfully.<br>- Disabled user cannot log in (verifies Task 2.1.1). | 3 | Full-Stack | Story 4.2 | Task, Full-Stack |

### Story 5.1: As a staff member, I want to view a list of registered clients so that I can look up their contact and billing details.
**Priority:** Medium | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | References | Labels/Tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **5.1.1** | Client Read-Only Repository | **Purpose:** Fetch client data securely.<br>**Details:** Implement `ClientReadOnlyRepository` querying `lpa_clients`.<br>**AC:**<br>- Domain model is immutable.<br>- Repository only exposes read methods. | 2 | Backend | Story 5.1 | Task, Database |
| `[ ]` | **5.1.2** | Client Data Grid UI | **Purpose:** Display e-commerce clients to staff.<br>**Details:** Build FXML view with a data table.<br>**AC:**<br>- Displays First/Last Name, Email, Phone, Address, Status.<br>- View contains no Add/Edit/Delete buttons. | 3 | Frontend | Story 5.1 | Task, UI |

### Story 6.1: As a staff member, I want to view a list of all client invoices so that I can monitor incoming online orders.
**Priority:** High | **Story Points:** 8

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | References | Labels/Tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **6.1.1** | Invoice Read-Only Repository | **Purpose:** Fetch historical invoice headers safely.<br>**Details:** Implement repository querying `lpa_invoices`. Map snapshot fields.<br>**AC:**<br>- Model maps `client_name` and `amount` snapshots.<br>- No insert/delete methods are exposed. | 3 | Backend | Story 6.1 | Task, Database |
| `[ ]` | **6.1.2** | Invoice List Data Grid UI | **Purpose:** Display order headers to staff.<br>**Details:** Build the Invoices list UI with a data table.<br>**AC:**<br>- Displays `invoice_number`, `client_name`, `amount`, and `status`.<br>- Successfully loads via Sales menu. | 5 | Frontend | Story 6.1 | Task, UI |

### Story 6.2: As a staff member, I want to view the specific line items of an invoice so that I know what products need to be packed and fulfilled.
**Priority:** High | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | References | Labels/Tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **6.2.1** | Invoice Detail View & Item Fetching | **Purpose:** Show purchased items for a specific order.<br>**Details:** Add repository method to fetch `lpa_invoice_items` by `invoice_id`. Update UI to show a detail table when a header is clicked.<br>**AC:**<br>- Clicking an invoice populates the detail view.<br>- Displays `stock_name`, `price`, `quantity`, and `subtotal`. | 5 | Full-Stack | Story 6.2, lpa_ecomms_schema.sql | Task, Full-Stack |

### Story 6.3: As a fulfillment manager, I want to update the fulfillment status of an invoice so that the system accurately reflects order progress.
**Priority:** High | **Story Points:** 5

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | References | Labels/Tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **6.3.1** | Invoice Status Update Logic & UI | **Purpose:** Allow updates to specific order states.<br>**Details:** Add `updateStatus()` to domain/repository. Add dropdown control to invoice detail UI.<br>**AC:**<br>- Domain restricts updates to 'P', 'U', 'S'.<br>- DB executes update on `status` field successfully. | 5 | Full-Stack | Story 6.3 | Task, Full-Stack |

### Story 7.1: As an internal user, I want to access system guides and version info so that I can get help without leaving the application.
**Priority:** Low | **Story Points:** 2

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Effort | Domain | References | Labels/Tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `[ ]` | **7.1.1** | Implement Help & About Modals | **Purpose:** Provide user assistance and build info.<br>**Details:** Wire the Help menu items to open simple dialogs or external files.<br>**AC:**<br>- "User Guide" opens a PDF or simple text FXML view.<br>- "About" opens a modal with App Version and DB connection status. | 2 | Frontend | Story 7.1 | Task, UI |