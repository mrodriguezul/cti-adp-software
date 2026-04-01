# PROMPTS

E-commerce website LPA Ecomms - User story 1.1.1

## USER PROMPT 1

@workspace #file:doc/sprints/sprint-2.md #file:backend/src/infrastructure/security/PasswordService.ts

# Role & Context
You are a Senior Backend TypeScript Engineer. We are executing **Ticket 1.1.1.1: [API] User Registration Endpoint**.
We must strictly follow our established Layered Clean Architecture (Domain, Infrastructure, Application, Presentation) and use Prisma for database access to the `lpa_clients` table.

# The Task
Implement the full vertical slice for the user registration flow.

# Execution Steps by Layer:

1. **Domain (`backend/src/domain/repositories/IClientRepository.ts`):**
   - Create an interface with two methods: `findByEmail(email: string): Promise<Client | null>` and `create(clientData: any): Promise<Client>`. (Define a basic `Client` interface matching the DB fields: id, email, password, name, phone).

2. **Infrastructure (`backend/src/infrastructure/persistence/PrismaClientRepository.ts`):**
   - Implement `IClientRepository` using Prisma. 
   - `findByEmail` should query the `lpa_clients` table.
   - `create` should insert into `lpa_clients`.

3. **Application (`backend/src/application/use-cases/RegisterClientUseCase.ts`):**
   - Create the use case. It should inject `IClientRepository` and import `PasswordService`.
   - **Step A:** Validate the email format using a standard RFC 5322 regex. Throw an error if invalid.
   - **Step B:** Call `repository.findByEmail`. If a user exists, throw a custom Error with a message indicating a conflict (so the controller can return a 409).
   - **Step C:** Await `PasswordService.hashPassword(data.password)`.
   - **Step D:** Call `repository.create` with the hashed password, name, phone, and email.
   - **Step E:** Return the newly created client's `id`.

4. **Presentation (`backend/src/presentation/controllers/AuthController.ts` & `backend/src/presentation/routes/auth.routes.ts`):**
   - Create `AuthController.ts` with a `register` method. Extract `email`, `password`, `name`, and `phone` from `req.body`.
   - Call `RegisterClientUseCase`.
   - If successful, return `201 Created` with a JSON payload: `{ success: true, data: { clientId: id } }`.
   - Catch errors. If the error is a duplicate email conflict, return `409 Conflict`. Otherwise, return `400 Bad Request` (for validation) or `500`.
   - Create `auth.routes.ts` and register the `POST /register` route to this controller.

# Output Format
Please output the code for `IClientRepository.ts`, `PrismaClientRepository.ts`, `RegisterClientUseCase.ts`, `AuthController.ts`, and `auth.routes.ts` sequentially.

## USER PROMPT 2

@workspace #file:backend/src/application/use-cases/RegisterClientUseCase.ts #file:backend/src/presentation/controllers/AuthController.ts

# Role & Context
You are a Lead Backend SDET. We just built the user registration flow for Ticket 1.1.1.1 and need to write isolated unit tests for the Application and Presentation layers using Jest.

# The Task
Generate two test files: `RegisterClientUseCase.test.ts` and `AuthController.test.ts`.

# Execution Steps:

1. **`backend/src/application/use-cases/RegisterClientUseCase.test.ts`:**
   - Mock `IClientRepository` (using `jest.fn()`).
   - Mock `PasswordService.hashPassword` to return a dummy hash.
   - **Test 1:** Should successfully register a user and return an ID when given valid data.
   - **Test 2:** Should throw an error if the email format is invalid.
   - **Test 3:** Should throw a conflict error if `repository.findByEmail` returns an existing user.

2. **`backend/src/presentation/controllers/AuthController.test.ts`:**
   - Mock Express `Request` and `Response` objects (specifically `res.status` and `res.json`).
   - Mock the `RegisterClientUseCase`.
   - **Test 1:** Should return `201` and the client ID on successful registration.
   - **Test 2:** Should return `409` if the use case throws a duplicate email conflict error.
   - **Test 3:** Should return `400` if validation fails (e.g., missing fields or bad email format).

# Output Format
Output the complete TypeScript code for `RegisterClientUseCase.test.ts` followed by `AuthController.test.ts`.

## USER PROMPT 3

@workspace #file:backend/src/domain/repositories/IClientRepository.ts #file:backend/src/infrastructure/persistence/PrismaClientRepository.ts #file:backend/src/application/use-cases/RegisterClientUseCase.ts #file:backend/src/presentation/controllers/AuthController.ts #file:backend/src/application/use-cases/RegisterClientUseCase.test.ts #file:backend/src/presentation/controllers/AuthController.test.ts

# Role & Context
You are a Senior Backend TypeScript Engineer. We are modifying the User Registration Endpoint (Ticket 1.1.1.1) to match the updated frontend form fields.

# The Task
Refactor the existing registration flow (Domain, Infrastructure, Application, Presentation, and Tests) to replace the generic `name` field with `firstname`, `lastname`, and an `address` field.

# Execution Steps:

1. **Domain (`IClientRepository.ts`)**:
   - Update the `Client` and creation DTO interfaces to use `firstname`, `lastname`, `address`, `phone`, `email`, and `password`. Remove `name`.

2. **Infrastructure (`PrismaClientRepository.ts`)**:
   - Update the `create` method to map `firstname`, `lastname`, `address`, `phone`, `email`, and `password` to the Prisma query.

3. **Application (`RegisterClientUseCase.ts`)**:
   - Update the input parameters/DTO to expect `firstname`, `lastname`, and `address` alongside `phone`, `email`, and `password`.
   - Pass the updated fields to `repository.create()`.

4. **Presentation (`AuthController.ts`)**:
   - Update the `req.body` destructuring to extract `firstname`, `lastname`, `address`, `phone`, `email`, and `password`.
   - Pass these into the `RegisterClientUseCase`.

5. **Tests (`RegisterClientUseCase.test.ts` & `AuthController.test.ts`)**:
   - Update all mock request bodies and expected payloads to use `{ firstname: "Miguel", lastname: "Smith", address: "123 Main St", phone: "+61400000000", email: "test@test.com", password: "password123" }` instead of the old `name` field.

# Output Format
Please output the updated code for all 6 files sequentially in distinct markdown code blocks.

## USER PROMPT 4

@workspace #file:doc/tickets.md #file:doc/phase-1-user-stories.md #file:doc/sprints/sprint-2.md

# The Task
Update the Acceptance Criteria for **User Story 1.1.1**, **Ticket 1.1.1.1 ([API] User Registration Endpoint)**, and **Ticket 1.1.1.2 ([Frontend] Registration Form & Page)** to reflect our updated database schema fields.

# Updates to Apply:
Across all three files, modify the AC for the registration flow to specify these exact fields instead of the old ones:
- `firstname` (string, required)
- `lastname` (string, required)
- `email` (string, required, unique formatting)
- `password` (string, required, min 8 chars)
- `phone` (string, optional)
- `address` (string, optional)

Make sure to remove any references to a singular `Name` field. 
For Ticket 1.1.1.1, explicitly mention that the API payload must map to `firstname` and `lastname` (all lowercase) for Prisma compatibility.

# Output Format
Output the fully updated tables for each file in distinct markdown code blocks so I can easily apply the changes. Do not alter any other tickets.

## USER PROMPT 5

@workspace #file:backend/src/domain/repositories/IClientRepository.ts #file:backend/src/infrastructure/persistence/PrismaClientRepository.ts #file:backend/src/application/use-cases/RegisterClientUseCase.ts

# Role & Context
You are a Lead Backend Architect. We are fixing a Domain-Driven Design inconsistency. We need to extract the `Client` interface from the repository into a proper Domain Entity class.

# The Task
1. **Create `backend/src/domain/entities/Client.ts`**:
   - Create and export a `Client` class.
   - It should have a constructor that takes: `id`, `firstname`, `lastname`, `email`, `password`, `status`, and optional `phone` and `address`.
   - Add a business method: `public isActive(): boolean { return this.status === 'A'; }`
   - Add a `toJSON()` method to safely return data without the password.

2. **Update `IClientRepository.ts`**:
   - Remove the inline `Client` interface.
   - Import the new `Client` entity class.
   - `findByEmail` and `create` must return `Promise<Client | null>` and `Promise<Client>`.

3. **Update `PrismaClientRepository.ts`**:
   - When returning data from Prisma, instantiate the `Client` class (e.g., `return new Client(data.id, data.firstname, ...)`) before returning it.

4. **Update `RegisterClientUseCase.ts`**:
   - Ensure it imports the new `Client` entity if it references the type.

# Output Format
Output the code for `Client.ts`, then the updated `IClientRepository.ts` and `PrismaClientRepository.ts`.

## USER PROMPT 6

@workspace #file:frontend-static/src/context/AuthContext.tsx #file:frontend-static/src/services/authService.ts #file:frontend-static/src/pages/Register.tsx #file:frontend/src/pages/Register.tsx 

# Role & Context
You are a Lead Frontend React Architect. We are executing **Ticket 1.1.1.2: [Frontend] Registration Form & Page**.
We need to migrate the static Auth files to connect to our real backend, drop the mock data, and wire up the UI using `react-hook-form` and `zod`.

# The Task
Implement the real `authService.ts`, update `AuthContext.tsx`, and build `Register.tsx`.

# Execution Steps:

1. **API Service (`frontend/src/services/authService.ts`):**
   - REMOVE all mock data, delays, and fake arrays.
   - Define the base API URL: `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';`
   - Create `export async function registerUser(data: Omit<Client, "id"> & { password: string }): Promise<void>`.
   - Use `fetch` to POST to `${API_URL}/auth/register`. 
   - If `!response.ok`, `await response.json()` and throw an Error with the backend's message (crucial for handling 409 Email Conflicts).

2. **Auth Context (`frontend/src/context/AuthContext.tsx`):**
   - Copy the structure from the static version.
   - Update the `register` function in the context to simply call `await authService.registerUser(data)`. 
   - **Crucial:** Do NOT call `persist(result)` inside the `register` context function, because our backend registration endpoint does not log the user in or return a JWT. It only creates the account.

3. **UI Component (`frontend/src/pages/Register.tsx`):**
   - Migrate the exact visual structure from the static template.
   - Define `registerSchema` using `zod` to match the backend payload: `firstname`, `lastname`, `email`, `password`, `phone` (optional), `address` (optional).
   - Setup `useForm` with `zodResolver`.
   - Extract `register` from `useAuth()`.
   - In the `onSubmit` handler, call `await register(data)`.
   - **On Success:** Call `toast({ title: "Account created", description: "You can now log in." })` and `Maps('/login')`.
   - **On Error:** Catch the error and call `toast({ variant: "destructive", title: "Registration failed", description: error.message })`.

# Output Format
Output the complete, production-ready TypeScript code for `authService.ts`, then `AuthContext.tsx`, then `Register.tsx` in distinct markdown code blocks.

## USER PROMPT 7

@workspace #file:frontend/src/pages/Register.tsx

# Role & Context
You are a Lead Frontend React Architect. We are cleaning up tech debt in our Registration page by standardizing our UI components.

# The Task
Refactor `Register.tsx` to remove the `sonner` dependency and exclusively use our local `shadcn/ui` toast system.

# Execution Steps:
1. **Remove Sonner:** Delete `import { toast } from "sonner";`.
2. **Import Hook:** Add `import { useToast } from "@/hooks/use-toast";` at the top.
3. **Initialize Hook:** Inside the `Register` component, add `const { toast } = useToast();` alongside `useNavigate()`.
4. **Update Toast Calls:** Inside the `onSubmit` function, rewrite the toast payloads to match the `shadcn/ui` object signature:
   - Success: `toast({ title: "Account created", description: "You can now log in." });`
   - Error: `toast({ variant: "destructive", title: "Registration failed", description: error.message });`

# Output Format
Output the fully updated TypeScript code for `Register.tsx`.

## USER PROMPT 8

@workspace #file:frontend/src/services/authService.ts #file:frontend/src/context/AuthContext.tsx #file:frontend/src/pages/Register.tsx

# Role & Context
You are a Lead Frontend SDET. We have completed the code for Ticket 1.1.1.2 (Registration Flow) and need to lock it down with enterprise-grade tests using Vitest and React Testing Library.

# The Task
Generate three test files: `authService.test.ts`, `AuthContext.test.tsx`, and `Register.test.tsx`.

# Execution Steps:

1. **Service Tests (`frontend/src/services/authService.test.ts`):**
   - Mock `global.fetch`.
   - **Test 1:** `registerUser` should call `fetch` with the correct POST method, URL, headers, and stringified body.
   - **Test 2:** Should throw an Error with the backend's message if the response is not `ok` (e.g., a 409 conflict).

2. **Context Tests (`frontend/src/context/AuthContext.test.tsx`):**
   - Mock `authService.ts` (`vi.mock('@/services/authService')`).
   - Create a dummy component to consume `useAuth`. Wrap it in `<AuthProvider>`.
   - **Test 1:** Calling `register` from the context should call `authService.registerUser` with the provided data.
   - **Test 2:** Ensure `register` does NOT automatically set the user state or `localStorage` (since registration only creates the account, it doesn't log them in).

3. **UI Tests (`frontend/src/pages/Register.test.tsx`):**
   - Mock `useAuth` to return a mocked `register` function.
   - Mock `useToast` from `@/hooks/use-toast`.
   - Mock `react-router-dom` (specifically `useNavigate`).
   - Wrap the rendered component in a `<MemoryRouter>`.
   - **Test 1:** Should render all form fields (First Name, Last Name, Email, Password, Phone, Address).
   - **Test 2:** Should show validation errors (via Zod) if the form is submitted empty.
   - **Test 3:** On valid submission, should call `register`, trigger a success toast, and navigate to `/login`.
   - **Test 4:** If `register` throws an error, should trigger a destructive toast with the error message.

# Output Format
Output the complete TypeScript code for `authService.test.ts`, then `AuthContext.test.tsx`, then `Register.test.tsx` in distinct markdown code blocks.
