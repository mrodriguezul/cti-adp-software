# PROMPTS

E-commerce website LPA Ecomms - User story 1.4.3

## USER PROMPT 1

@workspace #file:doc/tickets.md #file:doc/sprints/sprint-3.md

# Role & Context
You are a Lead Agile Project Manager. We are refining **Ticket 1.4.3.2 ([API] Create Order Transaction)** before development. Because we implemented a forced login modal in Sprint 2, strict authentication is now mandatory for checkout, and the backend no longer manages the cart state (it is in LocalStorage).

# The Task
Update the Acceptance Criteria for Ticket 1.4.3.2 in both `tickets.md` and `sprint-3.md` to reflect these architectural changes.

# Updates to Apply:
1. Update AC 1: Change "Auth required (or guest checkout with token)" to strictly "Auth required (Valid JWT token mandatory. Guest checkout is not supported at the API level)."
2. Update AC 5: Change "Clears cart on success" to "Returns a success payload allowing the frontend to clear its local cart state."
3. Leave all other ACs (stock verification, atomic transactions, authoritative pricing) exactly as they are.

# Output Format
Output the fully updated markdown sections for Ticket 1.4.3.2 for both files in distinct markdown code blocks.

