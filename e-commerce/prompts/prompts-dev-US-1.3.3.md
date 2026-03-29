# PROMPTS

E-commerce website LPA Ecomms - User story 1.3.3

## USER PROMPT 1

@workspace #file:doc/tickets.md #file:doc/sprints/sprint-1.md #file:doc/phase-1-user-stories.md

# The Task
Update the Acceptance Criteria for **Story 1.3.3** and **Ticket 1.3.3.1 ([Frontend] Cart Item Editing Controls)** to match our completed, streamlined implementation.

# Updates to Apply:
Please replace the existing Acceptance Criteria for 1.3.3.1 (and Story 1.3.3) across all files with the following:
1. Use a native HTML number input field for quantity adjustment (built-in up/down arrows).
2. Input validation enforces `min="1"` (preventing 0 or negative inputs) and `max={stockLimit}`.
3. Clicking the dedicated "Remove" (Trash) button deletes the item from the cart.
4. Cart totals update immediately via React Context without a page reload.
5. Context logic and UI notifications (Toasts) prevent users from exceeding available `onhand` stock limits.

# Output Format
Output the fully updated tables for each file in distinct markdown code blocks so I can apply the changes directly in the editor using the "Apply in Editor" button. Do not alter any other tickets or statuses.
