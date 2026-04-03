# PROMPTS

E-commerce website LPA Ecomms - User story 1.1.2

## USER PROMPT 1

@workspace #file:backend/src/infrastructure/security/PasswordService.ts #file:backend/src/domain/repositories/IClientRepository.ts #file:backend/src/presentation/controllers/AuthController.ts #file:backend/src/presentation/routes/auth.routes.ts

# Role & Context
You are a Senior Backend Security Engineer. We are executing **Ticket 1.1.2.1: [API] Login & JWT Token Generation**.
We must strictly follow our Layered Clean Architecture and Domain-Driven Design.

# The Task
Implement the JWT Service, the Login Use Case, and update the Auth Controller.

# Execution Steps by Layer:

1. **Infrastructure (`backend/src/infrastructure/security/JwtService.ts`):**
   - Export a class or const object `JwtService`.
   - Implement `generateToken(payload: { id: number, email: string }): string`. Use `jsonwebtoken` (`jwt.sign`) with `process.env.JWT_SECRET` (fallback to a default string if missing for dev purposes). Set expiration to `'24h'`.

2. **Application (`backend/src/application/use-cases/LoginClientUseCase.ts`):**
   - Create and export `LoginClientUseCase`. Inject `IClientRepository`. Import `PasswordService` and `JwtService`.
   - Implement an `execute({ email, password })` method.
   - **Step A:** Call `repository.findByEmail(email)`. 
   - **Step B:** If user is null, throw a generic Error("Invalid email or password").
   - **Step C:** Call `PasswordService.comparePassword(password, user.password)`. If false, throw the SAME generic Error("Invalid email or password").
   - **Step D:** Call `JwtService.generateToken({ id: user.id, email: user.email })`.
   - **Step E:** Return an object containing the `token` and the user data (call `user.toJSON()` to ensure the password is stripped out).

3. **Presentation (`backend/src/presentation/controllers/AuthController.ts` & `backend/src/presentation/routes/auth.routes.ts`):**
   - Add an async `login` method to `AuthController`.
   - Extract `email` and `password` from `req.body`.
   - Call `LoginClientUseCase.execute`.
   - If successful, return `200 OK` with `{ success: true, data: { token, client: userData } }`.
   - Catch errors. If the error message is "Invalid email or password", return `401 Unauthorized`. Otherwise, `500`.
   - Update `auth.routes.ts` to register the `POST /login` route to this new method.

# Output Format
Output the code for `JwtService.ts`, `LoginClientUseCase.ts`, the updated `AuthController.ts`, and the updated `auth.routes.ts` sequentially in distinct markdown code blocks.

## USER PROMPT 2

@workspace #file:backend/src/infrastructure/security/JwtService.ts #file:backend/src/application/use-cases/LoginClientUseCase.ts #file:backend/src/presentation/controllers/AuthController.ts

# Role & Context
You are a Lead Backend SDET. We have completed the code for Ticket 1.1.2.1 (Login & JWT Token Generation) and need to write isolated unit tests for the Infrastructure, Application, and Presentation layers using Jest.

# The Task
Generate three test files: `JwtService.test.ts`, `LoginClientUseCase.test.ts`, and update `AuthController.test.ts` to include login tests.

# Execution Steps:

1. **Service Tests (`backend/src/infrastructure/security/JwtService.test.ts`):**
   - Mock `jsonwebtoken`.
   - **Test 1:** `generateToken` should call `jwt.sign` with the correct payload, secret, and expiration, returning a token string.

2. **Use Case Tests (`backend/src/application/use-cases/LoginClientUseCase.test.ts`):**
   - Mock `IClientRepository`, `PasswordService.comparePassword`, and `JwtService.generateToken`.
   - **Test 1 (Success):** Should return a token and client data (without the password) when given a valid email and correct password.
   - **Test 2 (Failure - Not Found):** Should throw an Error("Invalid email or password") if `repository.findByEmail` returns null.
   - **Test 3 (Failure - Wrong Password):** Should throw an Error("Invalid email or password") if `PasswordService.comparePassword` returns false.

3. **Controller Tests (Add to `backend/src/presentation/controllers/AuthController.test.ts`):**
   - Mock `LoginClientUseCase.execute`.
   - **Test 1 (Success):** Should return `200` with the token and user data on successful login.
   - **Test 2 (Unauthorized):** Should return `401` with an error message if the use case throws an "Invalid email or password" error.
   - **Test 3 (Server Error):** Should return `500` for any other unexpected errors.

# Output Format
Output the complete TypeScript code for `JwtService.test.ts`, then `LoginClientUseCase.test.ts`, then the updated `AuthController.test.ts` in distinct markdown code blocks.

## USER PROMPT 3

@workspace #file:doc/tickets.md #file:doc/phase-1-user-stories.md #file:doc/sprints/sprint-2.md

# The Task
Update the Acceptance Criteria for **User Story 1.1.2** and **Ticket 1.1.2.2 ([Frontend] Login Page & Auth Context)** to reflect that the login UI is a Modal/Dialog, not a separate page.

# Updates to Apply:
Across all three files, modify the title of 1.1.2.2 to **"[Frontend] Login Modal & Auth Context"** and update the Acceptance Criteria to the following:
1. Implement the login UI as a pop-up Modal/Dialog triggered by the "Login" navbar button.
2. Form fields: Email and Password.
3. Submit button ("Sign In") calls the `POST /api/auth/login` endpoint (Ticket 1.1.2.1).
4. On success: stores JWT token in LocalStorage, updates `AuthContext` to set the user as authenticated, closes the modal, and triggers a success Toast.
5. On failure (401 Unauthorized): displays a destructive Toast ("Invalid email or password").
6. Includes a link to switch to the Registration page.

# Output Format
Output the fully updated tables for each file in distinct markdown code blocks so I can apply the changes directly. Do not alter any other tickets.

## USER PROMPT 4

@workspace #file:frontend/src/services/authService.ts #file:frontend/src/context/AuthContext.tsx #file:frontend/src/components/ui/LoginDialog.tsx

# Role & Context
You are a Lead Frontend React Architect. We are connecting our Login Dialog to the real backend, but we must strictly preserve the existing `AuthUser` type shape (`{ client: Client, token: string }`) so we do not break the Navbar dropdown.

# The Task
Update `authService.ts`, `AuthContext.tsx`, and `LoginDialog.tsx` to use the real API while maintaining perfect type compatibility with the rest of the app.

# Execution Steps:

1. **API Service (`frontend/src/services/authService.ts`):**
   - Implement `export async function loginUser(email, password): Promise<AuthUser>`.
   - `fetch` from `POST ${API_URL}/auth/login`.
   - Our backend returns: `{ success: boolean, data: { token: string, client: Client } }`.
   - **Crucial:** You must extract and return ONLY the `data` object so the return value exactly matches the `AuthUser` interface (`{ client, token }`). Do not return the `success` wrapper.
   - Throw an error if `!response.ok`.

2. **Auth Context (`frontend/src/context/AuthContext.tsx`):**
   - Keep the existing `persist` and state logic exactly as it is (it already handles `{ client, token }` correctly).
   - Update the `login` function to simply call `const result = await authService.loginUser(email, password); persist(result);`.

3. **UI Component (`frontend/src/components/ui/LoginDialog.tsx`):**
   - Connect the form to `useAuth().login`.
   - Ensure the form uses `zod` and `react-hook-form`.
   - On successful login: `toast` a success message and close the dialog. Do NOT try to navigate away (the user should stay on the current page).
   - On error: `toast` the error message.

# Output Format
Output the updated code for `authService.ts`, `AuthContext.tsx`, and `LoginDialog.tsx` sequentially.

## USER PROMPT 5

@workspace #file:frontend/src/components/ui/LoginDialog.tsx

# Role & Context
You are a Lead Frontend React Architect. We are standardizing our UI components and need to remove the `sonner` dependency from our login modal.

# The Task
Refactor `LoginDialog.tsx` to use our local `shadcn/ui` toast system instead of `sonner`.

# Execution Steps:
1. **Remove Sonner:** Delete `import { toast } from "@/components/ui/sonner";` (or wherever `sonner` is imported from).
2. **Import Hook:** Add `import { useToast } from "@/hooks/use-toast";` at the top of the file.
3. **Initialize Hook:** Inside the `LoginDialog` component definition, add `const { toast } = useToast();`.
4. **Update Toast Calls:** Inside your `onSubmit` or login handler, rewrite the toast payloads to match the `shadcn/ui` object signature:
   - Success: `toast({ title: "Welcome back!", description: "You have successfully logged in." });`
   - Error: `toast({ variant: "destructive", title: "Login failed", description: error.message });`

# Output Format
Output the fully updated TypeScript code for `LoginDialog.tsx`.

## USER PROMPT 6

@workspace #file:frontend/src/services/authService.ts #file:frontend/src/services/authService.test.ts #file:frontend/src/context/AuthContext.tsx #file:frontend/src/context/AuthContext.test.tsx #file:frontend/src/components/ui/LoginDialog.tsx

# Role & Context
You are a Lead Frontend SDET. We have completed the code for Ticket 1.1.2.2 (Login Modal & Auth Context) and need to add isolated unit tests for this flow using Vitest and React Testing Library.

# The Task
Update the existing `authService.test.ts` and `AuthContext.test.tsx` to include login tests, and create a new test file `LoginDialog.test.tsx`. 
**CRUCIAL:** Do NOT delete the existing registration tests in the service or context files. Append the new tests.

# Execution Steps:

1. **Service Tests (Update `frontend/src/services/authService.test.ts`):**
   - Add a `describe('loginUser')` block.
   - **Test 1 (Success):** Should call `fetch` with POST, the correct URL, headers, and body. It must mock a successful backend response (`{ success: true, data: { token: '123', client: {...} } }`) and assert that the function unwraps and returns ONLY the `data` object (`{ token, client }`).
   - **Test 2 (Failure):** Should throw an Error with the backend's message if the response is not `ok` (e.g., 401 Unauthorized).

2. **Context Tests (Update `frontend/src/context/AuthContext.test.tsx`):**
   - Add a `describe('login')` block.
   - **Test 1:** Calling `login` should call `authService.loginUser` with the provided email and password.
   - **Test 2:** Ensure successful login updates the `user` state and saves the result to `localStorage` (since it calls `persist`).

3. **UI Component (Create `frontend/src/components/ui/LoginDialog.test.tsx`):**
   - Mock `useAuth` to return a fake `login` function.
   - Mock `useToast` from `@/hooks/use-toast`.
   - **Setup:** Render the `LoginDialog`. Since it's a dialog, you may need to pass a mocked `open={true}` prop or render a trigger button to open it in the test.
   - **Test 1:** Should render the Email and Password fields.
   - **Test 2:** Should show Zod validation errors if the form is submitted empty.
   - **Test 3:** On valid submission, should call `login`, trigger a success toast, and call the `onOpenChange(false)` function to close the dialog.
   - **Test 4:** If `login` throws an error, should trigger a destructive toast with the error message.

# Output Format
Output the updated code for `authService.test.ts` and `AuthContext.test.tsx`, followed by the complete code for the new `LoginDialog.test.tsx` in distinct markdown code blocks.
