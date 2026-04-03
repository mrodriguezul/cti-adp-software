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

## USER PROMPT 4
