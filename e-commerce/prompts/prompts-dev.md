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