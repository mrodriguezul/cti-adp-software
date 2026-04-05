# PROMPTS

E-commerce website LPA Ecomms - User story 1.4.1

## USER PROMPT 1

@workspace #file:doc/tickets.md #file:doc/sprints/sprint-3.md #file:doc/phase-1-user-stories.md

# Role & Context
You are a Lead Agile Project Manager. We are refining the frontend checkout tickets (1.4.1.1, 1.4.2.1, and 1.4.3.1) and their parent User Stories before development.

# The Task
Update the Acceptance Criteria for these tickets across `tickets.md` and `sprint-3.md`, and update the corresponding User Stories in `phase-1-user-stories.md`.

# Updates to Apply:

**For Ticket 1.4.1.1 (and Story 1.4.1):**
- Remove the "Save to Profile" checkbox requirement.
- Add: Display the logged-in client's full name (First Name + Last Name) as a read-only label based on session data.
- Add: The system must concatenate Address, City, State/Province, Zip/Postal, and Country into a single `clientAddress` string for the backend payload.

**For Ticket 1.4.2.1 (and Story 1.4.2):**
- Add: Credit Card form must include Name on Card, 16-digit Card Number, Exp Date (MM/YY), and 3-digit CVV.
- Add: PayPal method simply renders a mock "Log in to PayPal" button that, when clicked, generates a success token and advances the flow.

**For Ticket 1.4.3.1 (and Story 1.4.3):**
- Add: Cart items display matches the cart interface visually (Product image, price, quantity, row amount) but must be entirely **read-only**.
- Add: Include an "Edit Cart" link that redirects the user back to the main `/cart` page to make changes.
- Add: The "Place Order" button must be disabled if the cart is empty.

# Output Format
Output the fully updated markdown sections for the affected tickets and user stories for all three files in distinct markdown code blocks. Do not alter other tickets.
