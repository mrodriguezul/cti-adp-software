# PROMPTS

E-commerce website LPA Ecomms

## USER PROMPT 1

You are an expert in product with experience in e-commerce.
I have the challenge of creating an e-commerce website for a case in a technical school, which is part of a software implementation for the case.
The trainer sent us a document with more details about the whole project; however, as far as I saw, it is very poor, and it's not completed (I attached the document, watch the e-commerce description).

I need you to define a list of basic functionalities that an e-commerce system has, and order them from highest to lowest priority.
Describe step by step how the customer journey works using an e-commerce.
What are the most important reasons to use an e-commerce?
Which alternatives to the e-commerce system exist, and when could they be relevant?
List me some e-commerce System examples (open source or private) with the most important characteristics.

Show me the information using charts or lists.

I am planning to create an e-commerce site for this case and also add some characteristics for future projects. Before starting the project, I need to know more details about e-commerce systems to create a new one that includes the basic functionalities and new features.

Do you understand?
Before you do that, ask me all the questions that you need to know to clarify the idea.

## USER PROMPT 2

Got it, I will take the prioritised e-commerce functionalities table to create my own e-commerce for my case study.

Also, based on the previous information about this project, I need:

- Project Description
- Objective, characteristics
- Main Functions (take the prioritised e-commerce functionalities table, remove the "school req?" column)

Show me in markdown format to export to a text file.

## USER PROMPT 3

Now you are a specialised software architect with experience in e-commerce applications.

Based on the project we discussed before, I need you make the following:

- Architecture Diagram
Use the format you deem most appropriate to represent the application's main components and the technologies used. Explain whether it follows any predefined pattern, justify why this architecture was chosen, and highlight the main benefits it brings to the project and justify its use, as well as any trade-offs or limitations it entails.

- Description of Main Components
Describe the most important components, including the technology used.

- High-Level Description of the Project and File Structure
Represent the project structure and briefly explain the purpose of the main folders, as well as whether it follows any specific pattern or architecture.

- Infrastructure and Deployment
Detail the project infrastructure, including a diagram in the format you consider appropriate, and explain the deployment process followed.

- Security
List and describe the main security practices implemented in the project, adding examples where applicable.

- Tests
Briefly describe some of the tests performed.

Show me in markdown (.md) format to export it a text file.

## USER PROMPT 4

Now, You are a database expert with experience using, designing, normalising, and optimising MySQL databases for e-commerces.
Based on the e-commerces project, I need you to complete the following:

- Data Model Diagram
Use Mermaid for the data model, and utilize all the parameters the syntax allows to provide maximum detail, such as primary and foreign keys.
Use the syntax described in the requirements document.
Add additional fields if necessary, and relate each table as required.
- Description of Main Entities:
Remember to include as much detail as possible for each entity, such as the name and type of each attribute, a brief description if applicable, primary and foreign keys, relationships and relationship type, constraints (unique, not null, etc.), etc.

## USER PROMPT 5

You are an expert System Analyst with experience using UML.
Based on the prioritised functionalities (12 functionalities to ensure the Core Value), create a Use Case diagram in markdown format using PlanUML.

## USER PROMPT 6

Excellent!

- Rank them by priority and importance, and show me in a table.
- Describe all of them and give the following information: Goal, Actors, Pre-conditions, Main flow, and Post-conditions in a table.

Show me in markdown (.md) style to save in a text file.

## USER PROMPT 7

Now, you are an experienced product manager with experience using agile methodologies and the Scrum framework.

Using the use cases list, make a Product Roadmap for this project, and next, write a list of epics to complete according to the previous roadmap. Use basic formats for both of them and show me the information using markdown format (.md) to save in plain text.

Later on, we will create the user stories and work tickets (not now). Make sure the epics have enough information and details to use later.

Do you understand?

If you have any questions, let me know before you start.

## USER PROMPT 8

Let's focus on Phase 1 and write all the user stories for each epic, add an ID column to each user story, similar to the epic list (1.1.1, 1.1.2, etc).
To get effective User Stories, make sure to follow the following criteria:
- Informal and Story-Driven: Use natural, simple language. Link the story to an Avatar/Persona (e.g., "As a Frequent Customer...").
- User-Centric: Describe what the user wants to achieve, not the system's internal features.
- Classic Structure (Simple and Concise): Follow the format: "As a [type of user], I want to [perform an action] so that [I receive a benefit]." Avoid technical details.
- Prioritizable and Estimable: Include a priority (Business Value) and an estimated effort (e.g., story points).
- Encourage Conversation and Acceptance Criteria: Stories must be a starting point for dialogue (3 C's) and include clear Acceptance Criteria that define "Done."
- Evolutionary: Keep them small, deliverable within a sprint, and ready to be refined as the project progresses.

Show me the information using markdown format (.md) to save in plain text.

## USER PROMPT 9

Do the same for phase number 2

## USER PROMPT 10

Do the same for phase number 3

## USER PROMPT 11

Now, create a product backlog using the user stories list (all phases).
Create, prioritise and order applying a strategic analysis that weighs User Stories and enhancements based on the following key criteria, ensuring the backlog is consistently listed:

1. User Impact and Business Value:
    Identify stories that deliver the highest value to the business or end-users (retention, revenue, new users). Prioritize maximum impact.
2. Urgency and Feedback
    Determine Urgency based on market trends, stakeholder commitments, and User Feedback (especially concerning UX/UI).
3. Complexity and Estimated Effort
    Consider the effort, resources, and time required for implementation (Cost). Prioritize tasks with the best cost-benefit ratio.
4. Risks and Dependencies
    Evaluate Potential Risks and Obstacles and acknowledge Dependencies between tasks to ensure a logical and viable workflow (also considering technological maturity).

Goal: Ensure the team works first on stories that offer the highest value (Criteria 1 & 2), with managed risk and cost (Criteria 3 & 4). 
The ordering of the backlog must directly reflect the outcome of this strategic weighting.

Show me in markdown style (.md) to save in plain text

## USER PROMPT 12

Are you sure the product backlog has all the user stories from all the phases??

Previously, I counted 29 user stories, and you listed only 27. Review the list again and make sure everything is correct.

## USER PROMPT 13

Excellent!
Based on the User Stories list (from all phases) and their Acceptance Criteria, generate one or more broken-down technical Work Tickets (Tasks/Sub-tasks).

Each generated ticket must be an actionable task and must include all the following fields:

- Title: Concise summary reflecting the essence of the task (e.g., Implement email validation on Form X).
- Detailed Description: Explain the Purpose (why the task is needed) and Specific Details (requirements, constraints).
- Acceptance Criteria (Checklist): Detailed list of conditions and/or validation tests that confirm the task is "Done".
- Priority: Level of urgency (e.g., High, Medium, Low).
- Effort Estimate: Story Points (e.g., 3, 5) or estimated time.
- Assignment: Responsible party (e.g., Frontend Team, Jane Doe).
- Labels/Tags: Categorisation by type (Task, Improvement, Bug) and component (UI, Backend, Database).
- References: Links to the original User Story or relevant documentation (e.g., Designs, APIs).
- Tool Note: The ticket must be designed for management on a platform that supports:
- Comments and Notes: For team collaboration and progress updates.
- Change History: For automatic tracking of modifications and status updates.

Show me the generated tickets in a table using markdown format (.md) to save in plain text.

## USER PROMPT 14

The previous table is not complete; you missed two user stories from phase 1.
Repeat this process by reading each user story (from all phases, 29 user stories) and creating detailed Technical Work Tickets, using the same criteria mentioned earlier.
List the tickets associated with their user story; don't mix the user stories.

Show me the generated tickets in a table using markdown format (.md) to save in plain text.
¿Do you understand?

## USER PROMPT 15

Now, I need you to reorganise the tickets (all of them).
Show me the list of tickets linked to their user story.
Present each generated ticket using a Markdown (.md) list or table structure, ready for direct input into a project management tool.

Example:
* **Title:** Implement `Job` Model, Schema, and REST Endpoint for Creation
* **Priority:** High
* **Effort Estimate:** 5 Points
* **Assignment:** Backend Team (Job & Pipeline Service)
* **Labels/Tags:** Task, Backend, API, Database, P1 Core Functionality
* **References:** US: 1.1.1, Conceptual Database Model
* **Detailed Description:** Establish the foundational data structure and API endpoint (POST `/jobs`) to store job details. Must define the fields necessary to satisfy AC 1 (title, department, location) and AC 2 (linking to a Scorecard ID).
* **Acceptance Criteria (Checklist):**
    1.  The `Job` model is defined in the RDB with required FK fields: `title`, `department_id`, `location_id`, and `job_scorecard_id`.
    2.  POST `/jobs` successfully saves the record and returns a 201 status code.

Don't forget to show me the results in markdown format (.md) to save the results in plain text.

