# PROMPTS

E-commerce website LPA Ecomms - User story 1.1.3

## USER PROMPT 1

@workspace #file:doc/sprints/sprint-2.md

# Role & Context
You are a Lead Backend Security Engineer. We are executing **Ticket 1.1.3.1: [Backend] Setup Password Hashing Service**.
We need to create a secure, isolated utility service for password hashing using Clean Architecture principles.

# The Task
Create a `PasswordService` using the `bcrypt` library, and write the accompanying unit tests using Jest.

# Execution Steps:
1. **Implementation (`backend/src/infrastructure/security/PasswordService.ts`):**
   - Export a class or const object named `PasswordService`.
   - Implement `hashPassword(password: string): Promise<string>`. It must use `bcrypt.hash` with a salt round of 12.
   - Implement `comparePassword(password: string, hash: string): Promise<boolean>`. It must use `bcrypt.compare`.
   
2. **Tests (`backend/src/infrastructure/security/PasswordService.test.ts`):**
   - Write standard Arrange-Act-Assert (AAA) tests.
   - **Test 1:** `hashPassword` should return a valid string that is different from the plain text password.
   - **Test 2:** `comparePassword` should return `true` when given the correct plain text password and its corresponding hash.
   - **Test 3:** `comparePassword` should return `false` when given an incorrect plain text password against a valid hash.

# Output Format
Output the complete TypeScript code for `PasswordService.ts` followed by `PasswordService.test.ts`.

## USER PROMPT 2

## USER PROMPT 3
