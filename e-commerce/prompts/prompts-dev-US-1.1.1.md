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
