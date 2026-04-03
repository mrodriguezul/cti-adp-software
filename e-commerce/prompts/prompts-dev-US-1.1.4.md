# PROMPTS

E-commerce website LPA Ecomms - User story 1.1.4

## USER PROMPT 1

@workspace #file:doc/tickets.md #file:doc/phase-1-user-stories.md #file:doc/sprints/sprint-2.md

# Role & Context
You are a Lead Agile Project Manager. We have implemented a better UX for our authentication flow and need to update the Acceptance Criteria for **Ticket 1.1.4.1** (and its parent User Story 1.1.4) across our documentation to match the current reality.

# The Task
Update the Acceptance Criteria for Ticket 1.1.4.1 across all three provided markdown files. 

# Updates to Apply:
1. **Remove Page Redirections:** Completely remove any references to "redirecting to the login page."
2. **Introduce Modal Logic:** State that if an unauthenticated user attempts the restricted action (e.g., proceeding to checkout), the application will trigger the Login Dialog/Modal instead.
3. **Remove Specific Messaging:** Remove the exact string requirement `"Please log in or create account"`. Replace it with a general functional description (e.g., "The login pop-up will display if the user is not logged in").
4. **Post-Login Behavior:** Specify that upon successful login via the modal, the modal closes and the user remains on their current page, ready to continue their action.

# Output Format
Output the fully updated markdown sections for Ticket 1.1.4.1 (and User Story 1.1.4 if applicable) for each of the three files in distinct markdown code blocks. Do not alter any other tickets or user stories.

## USER PROMPT 2

@workspace #file:frontend/src/pages/Cart.tsx #file:frontend/src/pages/Checkout.tsx #file:frontend/src/components/ui/LoginDialog.tsx 

# Role & Context
You are a Lead Frontend SDET. We just updated our auth flow so that unauthenticated users are prompted with a `LoginDialog` instead of being redirected when trying to access restricted actions (Ticket 1.1.4.1).

# The Task
Write the UI component tests to verify this specific interception logic using React Testing Library and Vitest.

# Execution Steps:
1. Identify which component handles the "Proceed to Checkout" or restricted action click (likely `Cart.tsx` or a wrapper). Create/update the `.test.tsx` file for that component.
2. Mock `useAuth` to return `isAuthenticated: false`.
3. **Test 1:** When the user clicks the restricted action button (e.g., "Checkout"), it should NOT navigate to the protected route. Instead, it should trigger the state/function that opens the `LoginDialog`.
4. Mock `useAuth` to return `isAuthenticated: true`.
5. **Test 2:** When the user clicks the restricted action button, it SHOULD navigate to the protected route normally.

# Output Format
Output the complete TypeScript code for the new/updated `.test.tsx` file in a distinct markdown code block.

## USER PROMPT 3
