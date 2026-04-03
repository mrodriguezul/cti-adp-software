# Sprint 2: Identity & Access Management (IAM)

## Sprint Goal
Build secure user registration, login, and authentication flows, enabling customers to manage accounts and allowing guest checkout with seamless login integration.

**Duration:** TBD
**Scope:** 4 User Stories | 6 Implementation Tickets | Estimated Effort: 26 Points

---

## Sprint 2 User Stories

| Status | ID | User Story | Priority | Est. (Pts) |
| :---: | :--- | :--- | :--- | :--- |
| [x] | **1.1.1** | **As a New Visitor**, I want to **register for an account** so that I can buy items and track my orders later. | High | 5 |
| [x] | **1.1.2** | **As a Registered Customer**, I want to **log in with my credentials** so that I can access my saved details and complete purchases. | High | 3 |
| [x] | **1.1.3** | **As a Security-Conscious User**, I want my **password to be hidden and encrypted** so that my account is safe even if the database is leaked. | High | 3 |
| [x] | **1.1.4** | **As a Guest Shopper**, I want to **add items to my cart and browse without logging in** so that I can make a quick purchase. | High | 5 |

---

## Sprint 2 Implementation Tickets

| Status | Ticket ID | Title | Details & Acceptance Criteria (AC) | Domain | Effort |
| :---: | :--- | :--- | :--- | :--- | :--- |
| [x] | **1.1.3.1** | **[Backend] Setup Password Hashing Service** | **Desc:** Implement Bcrypt hashing utility module.<br>**AC:**<br>1. `hashPassword(str)` function returns salted hash.<br>2. `comparePassword(str, hash)` returns boolean.<br>3. Unit tests validate both functions.<br>4. Salting uses 12 rounds (secure default). | Backend | 3 |
| [x] | **1.1.1.1** | **[API] User Registration Endpoint** | **Desc:** Create `POST /api/auth/register` endpoint.<br>**AC:**<br>1. Accepts JSON payload with: `firstname`, `lastname`, `email`, `password`, `phone` (optional), `address` (optional).<br>2. Validates email format (RFC 5322) and password minimum 8 characters.<br>3. Prevents duplicate emails (returns 409 Conflict).<br>4. Maps request fields `firstname` and `lastname` (all lowercase) to database columns for Prisma compatibility.<br>5. Hashes password using 1.1.3.1 service before insertion.<br>6. Inserts complete record into `lpa_clients` table.<br>7. Returns 201 Created with response: `{ success: true, data: { clientId: id } }`. | Backend | 5 |
| [x] | **1.1.1.2** | **[Frontend] Registration Form & Page** | **Desc:** Build registration UI with React form.<br>**AC:**<br>1. Form fields (required): First Name, Last Name, Email, Password, Confirm Password.<br>2. Form fields (optional): Phone, Address.<br>3. Client-side validation: first/last names required, password min 8 chars, email format, confirm password matches.<br>4. Submit button calls 1.1.1.1 API with all collected fields mapped to: `firstname`, `lastname`, `email`, `password`, `phone`, `address`.<br>5. Success redirects to Login page with confirmation message.<br>6. Error displays validation feedback from API response.<br>7. Form data persists on error (except passwords). | Frontend | 5 |
| [x] | **1.1.2.1** | **[API] Login & JWT Token Generation** | **Desc:** Create `POST /api/auth/login` endpoint.<br>**AC:**<br>1. Accepts Email and Password.<br>2. Queries `lpa_clients` by email.<br>3. Uses 1.1.3.1 to compare password hash.<br>4. On success: generates JWT token (expires 24h), returns token and user data.<br>5. On failure: returns 401 Unauthorized with generic message. | Backend | 5 |
| [x] | **1.1.2.2** | **[Frontend] Login Modal & Auth Context** | **Desc:** Build login UI as a Modal/Dialog and global auth state management.<br>**AC:**<br>1. Implement the login UI as a pop-up Modal/Dialog triggered by the "Login" navbar button.<br>2. Form fields: Email and Password.<br>3. Submit button ("Sign In") calls the `POST /api/auth/login` endpoint (Ticket 1.1.2.1).<br>4. On success: stores JWT token in LocalStorage, updates `AuthContext` to set the user as authenticated, closes the modal, and triggers a success Toast.<br>5. On failure (401 Unauthorized): displays a destructive Toast ("Invalid email or password").<br>6. Includes a link to switch to the Registration page. | Frontend | 3 |
| [x] | **1.1.4.1** | **[Frontend] Guest Cart & Forced Checkout Login** | **Desc:** Enable guest cart browsing with login at checkout via modal.<br>**AC:**<br>1. Guests can browse products and add to cart without login.<br>2. Cart persists in LocalStorage.<br>3. At checkout step 1, if user is unauthenticated, the Login Dialog/Modal is triggered.<br>4. User completes login via the modal form.<br>5. On successful login, the modal closes and the user remains on the checkout page, ready to continue.<br>6. Cart is preserved and accessible after login for seamless checkout. | Frontend | 5 |

---

## Sprint Metrics

| Metric | Value |
| :--- | :--- |
| Total User Stories | 4 |
| Total Tickets | 6 |
| Total Story Points | 16 |
| Total Ticket Effort (man-days) | 26 |
| Backend Tickets | 3 |
| Frontend Tickets | 3 |

---

## Dependencies & Notes

- **Blockers:** Story 1.1.3 (password hashing) must be completed before Stories 1.1.1 and 1.1.2 can proceed (both API endpoints depend on the hashing service)
- **Architecture Decision:** JWT tokens stored in LocalStorage; 24-hour token expiry; Bcrypt with 12 rounds for password hashing; separate AuthContext for global auth state management
- **Testing Plan:** Unit tests for hashing service; API integration tests for registration and login endpoints; E2E tests for complete auth workflow (register → login → guest checkout → forced login); password validation and error handling
- **Definition of Done:** All AC met, code reviewed, tests passing, documented API contracts, no console errors, security best practices followed (no passwords in logs, generic error messages)