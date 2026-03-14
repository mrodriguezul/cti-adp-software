# PROMPTS

E-commerce website LPA Ecomms - Dev

## USER PROMPT 1

# Role & Context
You are an Expert Full-Stack TypeScript Engineer and Systems Architect. Your task is to initialize the project scaffolding for the "CTI" e-commerce platform.

# Tech Stack Requirements
- **Architecture:** Monorepo using npm workspaces.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM. Must strictly follow Domain-Driven Design (DDD) principles.
- **Frontend:** React (using Vite), TypeScript, Tailwind CSS.
- **Database:** PostgreSQL (containerized via Docker).

# The Task
Please provide the terminal commands and initial configuration files to set up the following structure inside the current directory:

1. **Root Setup:** - Initialize a root `package.json` configured for npm workspaces containing two workspaces: `"backend"` and `"frontend"`.
   - Create a `docker-compose.yml` file at the root to run a PostgreSQL 15 database (include standard env variables for user, password, and db name).

2. **Backend Scaffolding (`/backend`):**
   - Provide the commands to initialize a Node/Express/TypeScript project.
   - Output a script or tree structure to create a basic DDD folder layout (e.g., `src/domain`, `src/application`, `src/infrastructure`, `src/presentation`).
   - Provide commands to initialize Prisma (`npx prisma init`).

3. **Frontend Scaffolding (`/frontend`):**
   - Provide the commands to scaffold a Vite + React + TypeScript project.
   - Provide the commands to install Tailwind CSS and its dependencies, along with the initial `tailwind.config.js` and `postcss.config.js` files.

Output the steps logically. Provide the necessary terminal commands first (using bash/zsh), followed by the contents for the critical configuration files. Do not generate feature code yet; focus strictly on a production-ready architectural foundation.

## USER PROMPT 2

@workspace #file:assets/db/lpa_ecomms_schema.sql

# Role & Context
You are a Database Administrator and Backend Engineer. We are initializing a PostgreSQL database for the "CTI" electronics e-commerce platform.

# The Task
Read the attached schema file and generate a new file named `mock_data.sql` to be placed in the `assets/db/` directory. 

# Requirements for the Mock Data:
1. **Realistic Electronics:** Generate at least 10 realistic electronics products (e.g., Laptops, Headphones, Monitors) with sensible prices, SKUs, and descriptions.
2. **Stock/Inventory:** Ensure these products have active status and realistic `onhand` stock quantities so they appear in our Phase 1 MVP catalog.
3. **Categories:** Create relevant categories for these products if your schema includes a categories table.
4. **Test User:** Generate at least one test user/client account. Since we haven't built the Bcrypt hashing yet, provide a placeholder hashed string for the password (e.g., `$2b$12$SomeFakeHashedPasswordString1234567890`) and note the plain-text equivalent in a SQL comment so I can log in later.
5. **Foreign Keys:** Ensure all INSERT statements are ordered correctly to respect foreign key constraints (e.g., insert categories before products).

Output the pure SQL commands intended for PostgreSQL.

## USER PROMPT 3

## USER PROMPT 4

## USER PROMPT 5

## USER PROMPT 6

## USER PROMPT 7

## USER PROMPT 8

## USER PROMPT 9

## USER PROMPT 10

## USER PROMPT 11

## USER PROMPT 12

## USER PROMPT 13

## USER PROMPT 14

## USER PROMPT 15