# Índice

0. [Ficha del proyecto](#0-ficha-del-proyecto)
1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

---

## 0. Ficha del proyecto

### **0.1. Tu nombre completo:**

Miguel Angel Rodríguez Ullilén

### **0.2. Nombre del proyecto:**

LPA eComms - E-commerce for the retail of physical electronics

### **0.3. Descripción breve del proyecto:**

**LPA eComms** is a comprehensive e-commerce software solution designed for the retail of physical electronics. The project aims to modernize the retail experience by integrating a customer-facing web and mobile storefront with a centralized, robust administrative backend.

The system is architected to handle the specific complexities of electronic hardware retail, utilizing a custom-built architecture to ensure scalability, security, and seamless data synchronization between the consumer mobile/web interface and the internal desktop management system.

### **0.4. URL del proyecto:**

[https://github.com/mrodriguezul/cti-adp-software](https://github.com/mrodriguezul/cti-adp-software)

## 1. Descripción general del producto

**LPA eComms** is a comprehensive e-commerce software solution designed for the retail of physical electronics. The project is structured with a clear separation of concerns:

- **Web Storefront (This Application):** Customer-facing online shopping experience for browsing products, managing carts, and placing orders
- **Desktop Admin Application (Future):** Java-based application for internal staff to manage inventory, process orders, and handle fulfillment
- **Admin Web Application (Future):** Planned web-based admin panel for additional administrative functions

The system is architected to handle the specific complexities of electronic hardware retail, utilizing a custom-built architecture to ensure scalability, security, and seamless data synchronization across all applications through a centralized PostgreSQL database.

### **1.1. Objetivo:**

* **Centralized Data Management:** Implement a unified PostgreSQL database structure to synchronize data across the Web/Mobile storefronts and the Admin applications, ensuring real-time consistency in stock levels and pricing.
* **Secure Customer Transaction Processing:** Develop a secure checkout flow that captures customer details, shipping information, and simulates payment processing while generating accurate invoice records.
* **Customer-Only Web Experience:** Deliver a responsive, user-friendly shopping experience including product discovery, persistent shopping carts, and intuitive navigation exclusively for customers.
* **Separate Admin Operations:** All administrative functions (inventory management, order fulfillment, user management) are handled in dedicated admin applications with appropriate access controls and workflows.

### **1.2. Características y funcionalidades principales:**

#### **Web Storefront (This Application):**
* **Product Catalog & Discovery:** Full product browsing with search, filtering by price and category, and sorting capabilities
* **Product Details:** Rich product information including specifications, images, availability status, and customer reviews
* **Shopping Experience:** Persistent shopping cart, quantity management, and visual stock indicators
* **User Accounts:** Registration, login, profile management, password security, and order history
* **Checkout & Orders:** Multi-step checkout with address collection, mock payment processing, order review, confirmation, and invoicing
* **Customer Features:** Wishlists, product reviews, personalized recommendations, order notifications, and quick reorder functionality
* **Database:** Centralized PostgreSQL database with `lpa_stock` (products), `lpa_clients` (customers), `lpa_invoices` (orders)

#### **Admin Services (Separate Applications):**
* **Desktop Admin Application (Java):** Staff interface for inventory management, stock CRUD operations, order fulfillment, and customer data handling
* **Admin Web Application (Planned Future):** Additional admin capabilities for analytics, reporting, and management
* **Database:** Same centralized PostgreSQL database with role-based access control

#### **Architecture:**
* **Frontend (Web Storefront):** Modern mobile-first web interface (React/Next.js) for customer interaction
* **Backend API:** Node.js/Express REST API serving both customer-facing and admin applications
* **Database:** Centralized PostgreSQL database acting as single source of truth
* **Security:** JWT-based authentication, Bcrypt password hashing, access control (customers and staff)
* **Scalability:** Modular structure supporting future expansion (real-time shipping, API integrations, mobile apps)

| Priority | Functionality | Description & Implementation |
| :--- | :--- | :--- |
| **High (P1)** | **Product Catalog (PIM)** | Centralized storage of products with rich metadata (Name, SKU, Price, Description, Stock Level). RESTful API endpoints for web storefront to retrieve product data. |
| **High (P1)** | **Cart & Session Management** | Functionality for customers to add/remove items and adjust quantities. Uses modern session storage to persist cart data during shopping. |
| **High (P1)** | **Checkout & Invoicing** | Multi-step flow collecting shipping information and processing mock payments. Automatically generates invoice records in database upon completion. |
| **High (P1)** | **User Authentication & Authorization** | Secure Login/Register system for customers. Differentiates between "Customers" (web) and "Staff" (admin apps) with appropriate access controls. |
| **Medium (P2)** | **Search & Filtering** | Robust search functionality and filtering options (by Price, Category, etc.) to help customers find specific products. |
| **Medium (P2)** | **Customer Profile & Order History** | Self-service portal where registered customers can view/update account information, view past orders, and reorder. |
| **Medium (P2)** | **Payment Gateway Simulation** | Mock payment processing (using Stripe, Paypal or Credit Card) to validate inputs and handle transaction states. |
| **Low (P3)** | **Reviews & Ratings** | Verified purchasers can rate and review products to build social proof and help other customers make decisions. |
| **Low (P3)** | **Wishlist** | Feature allowing customers to save items for future consideration without purchasing. |
| **Low (P3)** | **Personalized Recommendations** | ML-based recommendation engine displaying "You might also like" items to increase Average Order Value. |
| **Low (P3)** | **Notifications** | Email notifications for order status updates (Paid, Shipped, Delivered). |

**Note:** Admin features (inventory management, order fulfillment, staff management) are implemented in separate admin applications with their own feature priorities and backlogs.

### **1.3. Diseño y experiencia de usuario:**

> Proporciona imágenes y/o videotutorial mostrando la experiencia del usuario desde que aterriza en la aplicación, pasando por todas las funcionalidades principales.

### **1.4. Instrucciones de instalación:**

#### **Prerequisites**

Before starting, ensure you have the following installed:
- **Node.js** >= 18.0.0 and **npm** >= 9.0.0
- **Docker** and **Docker Compose** (for database container)
- **Git**
- A terminal/bash shell

#### **1. Clone the Repository**

```bash
git clone https://github.com/mrodriguezul/cti-adp-software.git
cd cti-adp-software
```

#### **2. Database Setup (PostgreSQL via Docker)**

The database runs in a Docker container with automatic initialization scripts.

##### **Start the Database Container**

From the `e-commerce` directory:

```bash
cd e-commerce
docker-compose up -d
```

This will:
- Start a PostgreSQL 15-alpine container (named `cti-postgres-db`)
- Initialize the schema from `assets/db/lpa_ecomms_schema.sql`
- Load mock data from `assets/db/mock_data.sql`
- Create a network called `cti-network`
- Mount persistent storage at `D:/db-containers/cti-e-comm-db`

**Verify Database is Running:**

```bash
docker ps | grep cti-postgres-db
```

**Access the Database (optional):**

```bash
docker exec -it cti-postgres-db psql -U cti_user -d cti_ecommerce
```

**Stop the Database:**

```bash
docker-compose down
```

**Stop and Remove All Data:**

```bash
docker-compose down -v
```

#### **3. Backend Setup (Node.js API)**

##### **Install Dependencies**

From the `e-commerce/backend` directory:

```bash
cd backend
npm install
```

##### **Configure Environment Variables**

Copy the `.env` file (or create one based on `.env.example`):

```bash
cp .env.example .env
```

**Key Environment Variables:**

```env
# Database Connection
DATABASE_URL=postgresql://cti_user:cti_password_dev@localhost:5432/cti_ecommerce

# Server Port
PORT=3000

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h

# CORS Settings
CORS_ORIGIN=http://localhost:5173

# Node Environment
NODE_ENV=development
```

##### **Generate Prisma Client**

```bash
npm run prisma:generate
```

##### **Run Database Migrations (if applicable)**

```bash
npm run prisma:migrate
```

##### **Start the Backend Server**

**For Development (with hot reload):**

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

**For Production Build:**

```bash
npm run build
npm start
```

#### **4. Frontend Setup (React + Vite)**

##### **Install Dependencies**

From the `e-commerce/frontend` directory:

```bash
cd ../frontend
npm install
```

##### **Configure Environment Variables**

Create a `.env` file in the frontend directory:

```env
# API Endpoint
VITE_API_BASE_URL=http://localhost:3000/api

# Environment
VITE_ENV=development
```

##### **Start the Development Server**

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port)

**Build for Production:**

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

**Preview Production Build:**

```bash
npm run preview
```

#### **5. Complete Deployment Flow (Local Development)**

Run all services together:

**Terminal 1 - Database:**

```bash
cd e-commerce
docker-compose up -d
```

**Terminal 2 - Backend:**

```bash
cd e-commerce/backend
npm run dev
```

**Terminal 3 - Frontend:**

```bash
cd e-commerce/frontend
npm run dev
```

#### **6. Testing the Application**

Once all services are running:

1. **Open the Browser:**
   - Navigate to `http://localhost:5173`

2. **Create a Test Account:**
   - Register with email and password
   - Example: `test@example.com` / `password123`

3. **Test Core Features:**
   - Browse products (seeded from mock data)
   - Add items to cart
   - Proceed to checkout
   - Complete a mock transaction

**Backend API Available at:**
- `http://localhost:3000/api`

**Database Available at:**
- Host: `localhost`
- Port: `5432`
- Database: `cti_ecommerce`
- User: `cti_user`
- Password: `cti_password_dev`

#### **7. Useful Commands**

| Command | Purpose |
| :--- | :--- |
| `docker-compose up -d` | Start database container |
| `docker-compose down` | Stop all containers |
| `npm run dev` | Start dev server (Backend or Frontend) |
| `npm run build` | Build for production |
| `npm test` | Run unit tests |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Auto-fix code style issues |
| `npm run prisma:studio` | Open Prisma Studio (database GUI) |

#### **8. Troubleshooting**

**Port Already in Use:**

- Backend (3000): `lsof -i :3000` and `kill -9 <PID>`
- Frontend (5173): `lsof -i :5173` and `kill -9 <PID>`
- Database (5432): `lsof -i :5432` and `kill -9 <PID>`

**Database Connection Errors:**

- Verify Docker container is running: `docker ps`
- Check env variables in `backend/.env`
- Verify PostgreSQL is listening: `docker logs cti-postgres-db`

**Module Not Found:**

- Clear `node_modules`: `rm -rf node_modules` and `npm install` again
- Clear build cache: `npm run clean`

**Frontend Not Connecting to API:**

- Check `VITE_API_BASE_URL` in `frontend/.env`
- Verify backend is running: `http://localhost:3000/api`
- Check CORS settings in backend

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

The project utilizes a **Headless Architecture**, separating the frontend presentation layer from the backend business logic. This allows the E-Commerce Web Application to be agile and modern while sharing a centralized database with the legacy Desktop system.

* **Scope:** This specific project implements the **Web Storefront** and **Backend API**.
* **External Context:** The system is designed to coexist with a Java Desktop Application (Admin) and Android Application (Mobile) as defined in the broader business requirements

```mermaid
graph TD
    subgraph "Project Scope: E-Commerce Web System"
        Web["Web Storefront (React.js)"]
        API["Backend API (Node.js/Express)"]
    end

    subgraph "External / Legacy Systems"
        DB[("PostgreSQL Centralized Database")]
        Desktop["Desktop Admin App (Java)"]
        Mobile["Mobile App (Android)"]
    end

    %% Connections
    Web <-->|"HTTPS / JSON"| API
    API <-->|"SQL / ORM"| DB
    Desktop -.->|"JDBC (Direct Access)"| DB
    Mobile -.->|"HTTPS / JSON"| API
```

### **2.2. Descripción de componentes principales:**

### A. Web Storefront (Frontend)

The customer-facing Single Page Application (SPA) designed to provide a modern, responsive user experience.
  
* **Technology:** React.js, Tailwind CSS, Axios.
* **Responsibility:**
  * **Presentation:** Renders the Product Catalog, Product Details, and Shopping Cart interfaces.
  * **State Management:** Manages "Client-Side State" (e.g., keeping the cart active across different pages without reloading).
  * **API Consumption:** Acts as a client that consumes the Backend API to fetch products and submit orders.

### B. Backend API (Service Layer)

The bridge between the user interface and the data, handling all business logic and security.

* **Technology:** Node.js, Express framework, Prisma (ORM).
* **Responsibility:**
  * **Endpoints:** Exposes RESTful endpoints (e.g., `GET /products`, `POST /orders`, `POST /auth`).
  * **Security:** Handles Password Hashing (using Blowfish/Bcrypt)  and verifies user sessions via Tokens.
  * **Validation:** Validates business rules, such as ensuring stock quantity is sufficient before processing an order.

### C. Centralized Database (Persistence)

The shared storage engine that acts as the single source of truth for both the Web Storefront and the external Desktop/Mobile applications.

* **Technology:** PostgreSQL.
* **Responsibility:**
  * Stores the `lpa_stock`, `lpa_clients`, `lpa_invoices`, and `lpa_users` tables as required by the schema definitions.
  * Maintains data consistency across all platforms.

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

The project follows a **Domain-Driven Design (DDD)** architecture for the backend and a component-based structure for the frontend, ensuring clean separation of concerns and scalability.

```
/e-commerce
│
├── /backend                        # Node.js Express API (DDD Architecture)
│   ├── /src
│   │   ├── /domain                 # Core business logic & entities
│   │   │   ├── /entities           # Client.ts, Product.ts (Domain models)
│   │   │   ├── /repositories       # IProductRepository, IClientRepository, IOrderRepository (Contracts)
│   │   │   └── /value-objects      # Business value objects
│   │   │
│   │   ├── /application            # Use cases & application logic
│   │   │   ├── /use-cases          # RegisterClientUseCase, LoginClientUseCase, GetProductsUseCase, CreateOrderUseCase
│   │   │   ├── /services           # Business services (e.g., OrderService)
│   │   │   └── /dto                # Data Transfer Objects for API requests/responses
│   │   │
│   │   ├── /infrastructure         # External integrations & implementations
│   │   │   ├── /config             # Database connection, configuration setup
│   │   │   ├── /persistence        # PrismaProductRepository, PrismaClientRepository, PrismaOrderRepository
│   │   │   ├── /security           # PasswordService, JwtService (Bcrypt hashing, JWT token generation)
│   │   │   └── /external-services  # Email service, payment gateway, third-party APIs
│   │   │
│   │   ├── /presentation           # HTTP requests/responses layer
│   │   │   ├── /controllers        # ProductController, AuthController, OrderController (Business logic orchestration)
│   │   │   ├── /routes             # auth.routes.ts, product.routes.ts, order.routes.ts (API endpoints)
│   │   │   └── /middleware         # authMiddleware.ts (JWT validation, CORS, error handling)
│   │   │
│   │   ├── /shared                 # Cross-cutting concerns
│   │   │   ├── /exceptions         # Custom error classes
│   │   │   ├── /types              # Shared TypeScript interfaces
│   │   │   └── /utils              # Helper utilities
│   │   │
│   │   └── index.ts                # App entry point (Express setup)
│   │
│   ├── /prisma                     # Database schema & migrations
│   │   ├── schema.prisma           # Database schema definitions
│   │   └── /migrations             # Version-controlled schema changes
│   │
│   ├── .env                        # Environment variables (DB credentials, JWT secret)
│   ├── .env.example                # Template for environment variables
│   ├── package.json                # Dependencies & scripts
│   └── tsconfig.json               # TypeScript configuration
│
├── /frontend                       # React + Vite + TypeScript
│   ├── /src
│   │   ├── /pages                  # Route pages (Index, Products, ProductDetail, Cart, Checkout, CheckoutComplete, Register, Profile, Orders, NotFound)
│   │   │
│   │   ├── /components             # Reusable UI components
│   │   │   ├── /layout             # Header.tsx, Footer.tsx, Layout.tsx (Page structure)
│   │   │   ├── /ui                 # Shadcn/UI components (Button, Card, Dialog, Input, etc.)
│   │   │   ├── ProductCard.tsx     # Product display component
│   │   │   ├── LoginDialog.tsx     # Authentication dialog
│   │   │   └── NavLink.tsx         # Navigation link component
│   │   │
│   │   ├── /context                # Global state management
│   │   │   ├── AuthContext.tsx     # User authentication state & hooks
│   │   │   └── CartContext.tsx     # Shopping cart state & hooks (useCart)
│   │   │
│   │   ├── /services               # API communication layer
│   │   │   ├── api.ts              # Axios instance configuration
│   │   │   └── *Service.ts         # Data fetching functions (ProductService, AuthService, OrderService)
│   │   │
│   │   ├── /hooks                  # Custom React hooks
│   │   │   └── useAuth, useCart, etc.
│   │   │
│   │   ├── /types                  # TypeScript type definitions
│   │   │   └── index.ts            # Shared types (Product, User, Order, CartItem)
│   │   │
│   │   ├── /lib                    # Utility functions
│   │   │   └── Helper functions (formatting, validation, calculations)
│   │   │
│   │   ├── /assets                 # Static files
│   │   │   ├── /images             # Product images, logos, banners
│   │   │   └── /icons              # SVG icons
│   │   │
│   │   ├── App.tsx                 # Main app component & routing
│   │   ├── main.tsx                # React entry point
│   │   └── index.css               # Global Tailwind styles
│   │
│   ├── /public                     # Static assets (favicon, manifest)
│   ├── .env                        # Frontend environment variables
│   ├── .env.example                # Template for environment variables
│   ├── package.json                # Dependencies & scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── vite.config.ts              # Vite build configuration
│   └── tailwind.config.ts          # Tailwind CSS configuration
│
├── /assets                         # Project-level assets
│   └── /db                         # Database scripts
│       ├── lpa_ecomms_schema.sql   # Database schema initialization
│       └── mock_data.sql           # Seed data for development
│
├── docker-compose.yml              # Docker services (PostgreSQL container)
└── .env                            # Root environment file
```

**Key Architectural Decisions:**

1. **Backend (DDD Pattern):**
   - **Domain Layer:** Contains pure business logic without any dependencies
   - **Application Layer:** Orchestrates use cases and business flow
   - **Infrastructure Layer:** Handles persistence, external services, and configuration
   - **Presentation Layer:** Manages HTTP requests/responses and routing

2. **Frontend (Component-Based):**
   - **Pages:** Full-screen views corresponding to routes
   - **Components:** Reusable, isolated UI building blocks
   - **Context:** Centralized state (Auth, Cart) available to entire app
   - **Services:** API communication abstracted away from components
   - **Tailwind CSS:** Utility-first CSS framework for responsive design

3. **Database:**
   - Prisma ORM for type-safe database access
   - Version-controlled migrations track schema changes
   - Mock data seeded at container startup for local development

### **2.4. Infraestructura y despliegue**

**Deployment Process** The deployment focuses on hosting the Web components.

* **Database Provisioning:**
  * A Managed PostgreSQL instance is provisioned on a cloud provider.
  * SQL schema scripts are executed to initialize the required tables (lpa_stock, lpa_invoices, etc.).

* **Backend Deployment:**
  * The Node.js API is containerized using Docker.
  * The container is deployed to a PaaS (Platform as a Service) like Railway or AWS ECS.
  * Environment variables are configured to securely connect to the Database.

* **Frontend Deployment:**
  * The React application is built (transpiled to static HTML/JS/CSS) using npm run build.
  * The artifacts are deployed to a global Content Delivery Network (CDN) such as Vercel or Netlify for high availability and speed.

```mermaid
graph LR
    subgraph "Cloud Hosting (e.g., AWS/Vercel/Railway)"
        CDN["Frontend Host (CDN)"]
        APIServer["API Container (Node.js)"]
        DBServer["Managed PostgreSQL Database"]
    end

    User["Customer Browser"] -->|Requests Website| CDN
    User -->|"API Calls (JSON)"| APIServer
    APIServer -->|Queries| DBServer
```

### **2.5. Seguridad**

### A. Secure Password Storage

* **Requirement:** Passwords must never be stored in plain text to protect user credentials in case of a data breach.
* **Implementation:** The system utilizes the **Blowfish/Bcrypt** hashing algorithm with salt. When a user registers, their password is immediately hashed before being written to the `lpa_users` table. During login, the input password is hashed and compared against the stored hash.

### B. API Authentication & Authorization

* **Requirement:** Restrict access to personal data and administrative functions.
* **Implementation:** The system implements **JSON Web Tokens (JWT)**.
  * **Login:** Upon successful authentication, the server issues a signed JWT.
  * **Protected Routes:** The client must attach this token to the header (`Authorization: Bearer <token>`) of every subsequent request (e.g., viewing order history). The backend verifies the token signature before processing the request.

### C. Input Validation & Sanitization

* **Requirement:** Prevent malicious data from corrupting the database or executing unauthorized commands.
* **Implementation:** The API implements strict validation layers (e.g., using libraries like Joi or Zod).
  * **Sanitization:** All incoming data is stripped of dangerous characters to prevent **SQL Injection** and **Cross-Site Scripting (XSS)**.
  * **Type Checking:** The system enforces strict data types (e.g., ensuring "Stock Quantity" is an integer) before interaction with the database.

### D. CORS Policies (Cross-Origin Resource Sharing)

* **Requirement:** Prevent unauthorized external websites from interacting with the backend API.
* **Implementation:** The backend is configured to accept requests **only** from the specific domain where the Web Storefront is hosted. All other origins are blocked by the browser's security policy.

### **2.6. Tests**

### A. Unit Testing

* **Frontend (Jest / Vitest):**
  * **Component Logic:** Tests to ensure individual UI components behave correctly (e.g., verifying that the "Add to Cart" button actually increments the cart count).
  * **Form Validation:** Tests to confirm that forms reject invalid inputs (e.g., invalid email formats or empty required fields) before sending data to the server.
* **Backend (Jest):**
  * **Business Logic:** Tests to verify calculation functions, such as ensuring the "Total Order Amount" accurately sums the prices of all items in the cart.

### B. Integration Testing

* **API Workflow:**
  * **Checkout Process:** Automated tests that simulate a complete user purchase flow via the API.
        1.  Send a `POST` request to `/api/checkout` with mock product data.
        2.  **Verify:** The server returns a 200 OK status.
        3.  **Verify:** A new invoice row is created in the `lpa_invoices` table.
        4.  **Verify:** The `lpa_stock.onhand` value for the purchased item decreases by the correct quantity in the database.

---

## 3. Modelo de Datos

### **3.1. Diagrama del modelo de datos:**

**Entity Relationship Diagram (ERD)**
The following diagram represents the normalized schema for the LPA eComms system. It illustrates the relationships between the Inventory (Stock), Customers (Clients), Sales (Invoices), and System Administrators (Users).

**Key Architectural Decisions:**

* **Historical Data Preservation:** The `lpa_invoices` and `lpa_invoice_items` tables are intentionally "denormalized" to store snapshots of data (like address and price) at the time of purchase. This prevents old invoices from changing if a product price or client address changes in the future.
* **Separation of Concerns:** `lpa_users` is strictly for internal staff (Admins/Stock Managers), while `lpa_clients` manages external customer data.
* **Data Integrity:** Arithmetic fields (Quantity, Price) use strict numeric types (`INTEGER`, `DECIMAL`) to ensure calculation accuracy, while Audit fields (`created_at`, `updated_at`) track record lifecycles.

```mermaid
erDiagram
    %% ENTITY DEFINITIONS
    lpa_stock {
        SERIAL id PK "Internal Primary Key"
        VARCHAR sku "Unique Stock ID (Barcode)"
        VARCHAR name "Product Name"
        TEXT description "Full Description"
        INTEGER onhand "Inventory Count"
        DECIMAL price "Unit Price"
        CHAR status "A=Active, D=Disabled"
        VARCHAR image_url "Product Image Path"
        TIMESTAMP created_at "Audit Timestamp"
        TIMESTAMP updated_at "Last Modified"
    }

    lpa_clients {
        SERIAL id PK "Internal Primary Key"
        VARCHAR firstname
        VARCHAR lastname
        VARCHAR address "Shipping Address"
        VARCHAR phone
        VARCHAR email "Unique, for Auth"
        VARCHAR password "Hashed Password (Bcrypt)"
        CHAR status "A=Active, D=Disabled"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    lpa_invoices {
        SERIAL id PK "Internal Primary Key"
        VARCHAR invoice_number "Unique Invoice # (e.g., INV-001)"
        INTEGER client_id FK "Link to Client"
        VARCHAR client_name "Snapshot: Name"
        VARCHAR client_address "Snapshot: Address"
        DECIMAL amount "Total Order Value"
        CHAR status "P=Paid, U=Unpaid, S=Shipped"
        TIMESTAMP created_at "Transaction Date"
        TIMESTAMP updated_at
    }

    lpa_invoice_items {
        SERIAL id PK "Internal Primary Key"
        INTEGER invoice_id FK "Link to Invoice"
        INTEGER stock_id FK "Link to Original Stock"
        VARCHAR stock_name "Snapshot: Item Name"
        INTEGER quantity "Quantity Purchased"
        DECIMAL price "Snapshot: Unit Price"
        DECIMAL subtotal "Line Total (Qty * Price)"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    lpa_users {
        SERIAL id PK "Internal Primary Key"
        VARCHAR username "Unique Login"
        VARCHAR password "Hashed String"
        VARCHAR firstname
        VARCHAR lastname
        VARCHAR role "admin or user"
        CHAR status "A=Active, D=Disabled"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    %% RELATIONSHIPS
    lpa_clients ||--o{ lpa_invoices : "places"
    lpa_invoices ||--|{ lpa_invoice_items : "contains"
    lpa_stock ||--o{ lpa_invoice_items : "listed_as"
```

### **3.2. Descripción de entidades principales:**

#### A. Table: `lpa_stock` (Product Catalog)

Represents the inventory of physical electronics available for sale.

* **Purpose:** Central repository for all product information displayed on the Web Storefront and managed via the Desktop Admin App.
* **Columns:**
  * `id` (**PK**, SERIAL): Internal auto-incrementing identifier.
  * `sku` (VARCHAR 50): Unique alphanumeric Stock Keeping Unit (Barcode).
  * `name` (VARCHAR 255): The display name of the product.
  * `description` (TEXT): Detailed HTML or text description of the product specs.
  * `onhand` (INTEGER): Current quantity in the warehouse. *Uses INTEGER to ensure mathematical accuracy.*
  * `price` (DECIMAL 10,2): Unit cost (e.g., 999.99).
  * `status` (CHAR 1): 'A' (Active) or 'D' (Disabled) to soft-delete items without removing data.
  * `image_url` (VARCHAR 255): Path to the product image for the gallery.
  * `created_at` / `updated_at`: Audit timestamps.
* **Constraints:** `sku` must be Unique. `price` and `onhand` must be >= 0.

#### B. Table: `lpa_clients` (Customers)

Represents the external users who register on the website to purchase items.

* **Purpose:** Stores customer shipping details and authentication credentials.
* **Columns:**
  * `id` (**PK**, SERIAL): Internal auto-incrementing identifier.
  * `firstname` / `lastname` (VARCHAR 50): Customer's legal name.
  * `address` (VARCHAR 255): Default shipping address.
  * `phone` (VARCHAR 30): Contact number for delivery.
  * `email` (VARCHAR 100): Unique email address used for login and notifications.
  * `password` (VARCHAR 255): Stores the secure hash (Bcrypt/Argon2) of the user's password.
  * `status` (CHAR 1): Account status ('A'ctive/'D'isabled).
  * `created_at` / `updated_at`: Audit timestamps.
* **Constraints:** `email` must be Unique.

#### C. Table: `lpa_invoices` (Orders)

Represents the header information of a completed sales transaction.

* **Purpose:** Tracks the financial transaction, date, and "Who bought what".
* **Columns:**
  * `id` (**PK**, SERIAL): Internal auto-incrementing identifier.
  * `invoice_number` (VARCHAR 50): Unique, human-readable Invoice Number (e.g., "INV-2026-001").
  * `client_id` (**FK**, INTEGER): References `lpa_clients.id`.
  * `client_name` / `client_address`: **Snapshot fields**. These store the name/address *as they were at the moment of purchase*, ensuring historical accuracy even if the client profile changes later.
  * `amount` (DECIMAL 12,2): Total sum of all items in the order.
  * `status` (CHAR 1): e.g., 'P' (Paid), 'U' (Unpaid), 'S' (Shipped).
  * `created_at` / `updated_at`: Transaction timestamps.
* **Relationships:** Many-to-One with `lpa_clients`.

#### D. Table: `lpa_invoice_items` (Order Line Items)

Represents the specific products included within a single invoice.

* **Purpose:** Acts as a bridge table between Invoices and Stock, allowing multiple items per order.
* **Columns:**
  * `id` (**PK**, SERIAL): Unique Line Item ID.
  * `invoice_id` (**FK**, INTEGER): References `lpa_invoices.id`.
  * `stock_id` (**FK**, INTEGER): References `lpa_stock.id`.
  * `stock_name` (VARCHAR 255): Snapshot of the product name at the time of sale.
  * `quantity` (INTEGER): Quantity purchased.
  * `price` (DECIMAL 10,2): Snapshot of price at the time of sale.
  * `subtotal` (DECIMAL 12,2): Calculated field (`quantity * price`).
  * `created_at` / `updated_at`: Audit timestamps.
* **Relationships:** Many-to-One with `lpa_invoices`; Many-to-One with `lpa_stock`.

#### E. Table: `lpa_users` (Internal Staff)

Represents the internal staff members who access the Desktop Application.

* **Purpose:** Controls access to the Admin Dashboard (RBAC).
* **Columns:**
  * `id` (**PK**, SERIAL): Internal auto-incrementing identifier.
  * `username` (VARCHAR 50): Login username.
  * `password` (VARCHAR 255): Hashed password.
  * `role` (VARCHAR 20): Defines permissions (e.g., 'admin', 'user').
  * `status` (CHAR 1): Account status.
  * `created_at` / `updated_at`: Audit timestamps.
* **Constraints:** `username` must be Unique.

---

## 4. Especificación de la API

The LPA eComms API is a RESTful web service built with **Node.js + Express** and uses **JWT authentication** for secure access to protected endpoints. All requests should include the `Content-Type: application/json` header.

### Base URL
```
http://localhost:3000/api
```

### Authentication
Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### POST /auth/register
Register a new customer account.

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "address": "123 Main St, New York, NY 10001"
}
```

| Field | Type | Required | Validation |
| :--- | :--- | :--- | :--- |
| `firstname` | string | ✅ | 1-50 characters, no special chars |
| `lastname` | string | ✅ | 1-50 characters, no special chars |
| `email` | string | ✅ | Valid RFC 5322 format, must be unique |
| `password` | string | ✅ | Minimum 8 characters |
| `phone` | string | ❌ | Optional, 7-20 characters |
| `address` | string | ❌ | Optional, max 255 characters |

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "clientId": 1,
    "email": "john@example.com",
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

**Error Responses:**

| Status | Code | Message | Reason |
| :--- | :--- | :--- | :--- |
| 400 | `VALIDATION_ERROR` | "Email format is invalid" | Invalid email format |
| 400 | `VALIDATION_ERROR` | "Password must be at least 8 characters" | Password too short |
| 409 | `DUPLICATE_EMAIL` | "Email already registered" | Email already exists in database |
| 500 | `INTERNAL_SERVER_ERROR` | "An unexpected error occurred" | Server error |

---

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

| Field | Type | Required |
| :--- | :--- | :--- |
| `email` | string | ✅ |
| `password` | string | ✅ |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "client": {
      "id": 1,
      "email": "john@example.com",
      "firstname": "John",
      "lastname": "Doe",
      "phone": "+610430011787",
      "address": "16 Merton rd.",
      "status": "A"
    }
  }
}
```

**Error Responses:**

| Status | Code | Message | Reason |
| :--- | :--- | :--- | :--- |
| 401 | `UNAUTHORIZED` | "Invalid email or password" | Email not found or password incorrect |
| 500 | `INTERNAL_SERVER_ERROR` | "An unexpected error occurred" | Server error |

**Token Details:**
- **Expiration:** 24 hours
- **Signing Algorithm:** HS256
- **Payload:** Contains `clientId`, `email`, `iat`, `exp`

---

## Product Endpoints

### GET /products
Retrieve paginated list of active products.

**Query Parameters:**

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 12 | Items per page (1-100) |

**Request Example:**
```
GET /products?page=1&limit=12
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sku": "SONY-WH1000XM4",
      "name": "Sony WH-1000XM4 Wireless Headphones",
      "description": "Premium noise-canceling Bluetooth headphones with 30-hour battery life",
      "price": 349.99,
      "onhand": 15,
      "image_url": "/images/sony-headphones.jpg",
      "status": "A"
    },
    {
      "id": 2,
      "sku": "APPLE-AIRPODS-PRO",
      "name": "Apple AirPods Pro",
      "description": "Active noise cancellation with spatial audio and MagSafe charging",
      "price": 249.00,
      "onhand": 0,
      "image_url": "/images/airpods-pro.jpg",
      "status": "A"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 12,
    "hasMore": true,
    "totalPages": 4
  }
}
```

**Response Fields:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | integer | Product unique identifier |
| `sku` | string | Stock Keeping Unit (barcode) |
| `name` | string | Product name |
| `description` | string | Full product description |
| `price` | decimal | Unit price (2 decimal places) |
| `onhand` | integer | Current stock quantity |
| `image_url` | string | URL to product image |
| `status` | string | 'A' (Active) or 'D' (Disabled) |
| `created_at` | datetime | Creation timestamp (ISO 8601) |
| `updated_at` | datetime | Last modification timestamp |

**Error Responses:**

| Status | Code | Message | Reason |
| :--- | :--- | :--- | :--- |
| 400 | `INVALID_PAGINATION` | "Page must be >= 1" | Invalid page number |
| 400 | `INVALID_PAGINATION` | "Limit must be 1-100" | Invalid limit value |
| 500 | `INTERNAL_SERVER_ERROR` | "An unexpected error occurred" | Server error |

---

### GET /products/:id
Retrieve detailed information for a single product.

**Path Parameters:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | integer | Product ID |

**Request Example:**
```
GET /products/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sku": "SONY-WH1000XM4",
    "name": "Sony WH-1000XM4 Wireless Headphones",
    "description": "Premium noise-canceling Bluetooth headphones with 30-hour battery life and Bluetooth 5.0 connectivity.",
    "price": 349.99,
    "onhand": 15,
    "image_url": "/images/sony-headphones.jpg",
    "status": "A",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-04-05T14:30:00Z"
  }
}
```

**Error Responses:**

| Status | Code | Message | Reason |
| :--- | :--- | :--- | :--- |
| 400 | `INVALID_INPUT` | "Product ID must be a valid integer" | Non-numeric ID provided |
| 404 | `NOT_FOUND` | "Product not found" | Product doesn't exist or is inactive |
| 500 | `INTERNAL_SERVER_ERROR` | "An unexpected error occurred" | Server error |

---

## Order Endpoints

### POST /orders
Create a new order (checkout). **Requires authentication.**

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "stock_id": 1,
      "quantity": 2
    },
    {
      "stock_id": 5,
      "quantity": 1
    }
  ],
  "clientAddress": "123 Main St, New York, NY 10001, USA",
  "paymentToken": "mock_cc_12345"
}
```

| Field | Type | Required | Validation |
| :--- | :--- | :--- | :--- |
| `items` | array | ✅ | Min 1 item, each item has stock_id (integer) and quantity (integer > 0) |
| `clientAddress` | string | ✅ | 10-255 characters, concatenated address string |
| `paymentToken` | string | ✅ | 10-100 characters, mock token (mock_cc_* or mock_paypal_*) |

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "invoiceId": 42,
    "invoiceNumber": "INV-20260405-042",
    "amount": 599.97
  }
}
```

**Security Details:**
- **Price Authority:** Backend fetches current prices from `lpa_stock` table
- **Stock Validation:** Backend verifies sufficient inventory before order creation
- **Atomic Transactions:** All-or-nothing operation (rollback on failure)
- **Inventory Update:** `lpa_stock.onhand` decremented for each item
- **Invoice Creation:** Snapshot of prices and customer address stored

**Error Responses:**

| Status | Code | Message | Reason |
| :--- | :--- | :--- | :--- |
| 400 | `VALIDATION_ERROR` | "Items array is required" | Missing items in request |
| 400 | `VALIDATION_ERROR` | "Each item must have stock_id and quantity" | Item format invalid |
| 400 | `VALIDATION_ERROR` | "Quantity must be > 0" | Invalid quantity |
| 401 | `UNAUTHORIZED` | "Invalid or expired JWT token" | Missing or invalid auth header |
| 404 | `NOT_FOUND` | "Product not found (stock_id: 999)" | Product doesn't exist |
| 409 | `INSUFFICIENT_STOCK` | "Insufficient stock for product: Sony Headphones (requested: 10, available: 3)" | Not enough inventory |
| 500 | `TRANSACTION_FAILED` | "Order creation failed, transaction rolled back" | Database error |

---

**Error Responses:**

| Status | Code | Message | Reason |
| :--- | :--- | :--- | :--- |
| 401 | `UNAUTHORIZED` | "Invalid or expired JWT token" | Missing or invalid token |
| 500 | `INTERNAL_SERVER_ERROR` | "An unexpected error occurred" | Server error |

---

## Common Response Patterns

### Success Response
```json
{
  "success": true,
  "data": { }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 12,
    "hasMore": true,
    "totalPages": 9
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descriptive error message"
  }
}
```

---

## Rate Limiting & Performance

- **Rate Limit:** 100 requests per minute per IP address (future implementation)
- **Response Time:** <200ms for product endpoints, <500ms for order operations
- **Pagination:** Default limit 12 (products) or 10 (orders), max 100
- **Timeout:** 30 seconds for all requests

---

## Authentication Flow

1. **Register:** `POST /auth/register` → Create user account
2. **Login:** `POST /auth/login` → Receive JWT token
3. **Store Token:** Frontend saves JWT in LocalStorage
4. **Authenticated Requests:** Include `Authorization: Bearer <token>` header
5. **Token Expiration:** 24 hours; user must login again

---

## CORS Configuration

Frontend origin: `http://localhost:5173` (development)

Production CORS will be configured to the actual frontend domain.

---

## 5. Historias de Usuario

This section provides sample user stories from the **30 customer-facing stories** organized into three delivery phases. **For complete details, refer to:**

- **Phase 1 (MVP - 13 stories):** [phase-1-user-stories.md](./phase-1-user-stories.md) - Core authentication, product browsing, shopping cart, and checkout
- **Phase 2 (V1 - 8 stories):** [phase-2-user-stories.md](./phase-2-user-stories.md) - Search, filtering, sorting, account management, order history
- **Phase 3 (V2 - 9 stories):** [phase-3-user-stories.md](./phase-3-user-stories.md) - Recommendations, wishlists, reviews, notifications, quick reorder
- **Product Backlog (30 stories):** [product-backlog.md](./product-backlog.md) - Complete prioritized list with estimates
- **Epics Documentation (10 epics):** [epics.md](./epics.md) - Epic scope, business value, and story mapping

**Sample Critical Stories (MVP Phase):**

| ID | User Story | Epic | Priority | Pts | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1.1.1** | **As a New Visitor**, I want to **register for an account** so that I can buy items and track my orders later. | Epic-01: IAM | High | 5 | 1. User can enter First Name, Last Name, Email, Password, Confirm Password, Phone (optional), and Address (optional).<br>2. System validates that first name and last name are provided (required fields).<br>3. System validates email format and prevents duplicate email registrations.<br>4. System validates password strength (minimum 8 characters).<br>5. System validates that Confirm Password matches Password.<br>6. Upon success, user is redirected to Login page with confirmation message and new account can log in immediately. |
| **1.1.4** | **As a Guest Shopper**, I want to **add items to my cart and browse without logging in** so that I can make a quick purchase. | Epic-01: IAM | High | 5 | 1. Guest users can view products and add items to cart without registration.<br>2. Cart persists and displays item count in navbar.<br>3. When guest clicks "Checkout" or "Proceed to Checkout", if not authenticated, the Login Dialog/Modal is triggered.<br>4. After successful login via the modal, the modal closes and the user remains on the checkout page.<br>5. Guest cart is preserved and accessible after login for checkout to continue. |
| **1.2.1** | **As a Shopper**, I want to **view a list of all available products** so that I can browse what the store has to offer. | Epic-02: Catalog | High | 5 | 1. Page displays product grid (4 cols desktop, 2 mobile).<br>2. Each product card displays: image at top, `sku` in small muted text, `name` as bold heading, `description` truncated to 2 lines.<br>3. Card footer shows: `price` (bolded) and `stock` count (e.g., "45 in stock") stacked on left; "Add to Cart" button with cart icon on right.<br>4. "Out of Stock" items are visually distinct (grayed out) but still visible.<br>5. Only "Active" products are displayed (Admin-disabled items are hidden).<br>6. Pagination or "Load More" is used for large lists. |
| **1.4.3** | **As a Customer**, I want to **review my order before final submission** so that I can verify all details are correct. | Epic-04: Checkout | High | 3 | 1. Checkout Step 3 displays Order Summary with cart items in a read-only visual format (Product image, price, quantity, row amount) matching the cart interface.<br>2. An "Edit Cart" link is provided to redirect the user back to the main `/cart` page to make changes.<br>3. User can see shipping address and total.<br>4. User can edit cart quantities or go back to address step via "Edit" links.<br>5. The "Place Order" button is disabled if the cart is empty.<br>6. "Place Order" button submits the purchase transaction.<br>7. **SECURITY: Backend independently fetches current prices from `lpa_stock` table (never trusts frontend prices) to prevent client-side tampering of order totals.** |

**Sample Phase 2 Story (Search & Discovery):**

| ID | User Story | Epic | Priority | Pts | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **2.5.1** | **As a Shopper with a specific need**, I want to **search for products by keyword** so that I can find exactly what I am looking for (e.g., "Sony Headphones"). | Epic-05: Discovery | High | 5 | 1. Search bar is visible in the global navigation (header).<br>2. Entering text matches against Product Name, Description, and SKU.<br>3. Results page displays matching items in a grid with pagination.<br>4. If no matches found, show a helpful "No results. Try different keywords" message.<br>5. Search is case-insensitive and ignores extra spaces. |

**Sample Phase 3 Story (Customer Engagement):**

| ID | User Story | Epic | Priority | Pts | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **3.9.4** | **As a Shopper**, I want to **read reviews from other customers** so that I can make confident purchasing decisions based on real user experiences. | Epic-09: Community | Low | 3 | 1. Product Detail page displays an "Average Rating" badge (e.g., "4.5 ⭐ out of 5 based on 42 reviews").<br>2. "Customer Reviews" tab/section lists individual reviews sorted by Helpful/Recent.<br>3. Each review shows: Star Rating, Title, Text excerpt, Author's First Name, Date, and "Helpful?" voting count.<br>4. Reviews are paginated (5 reviews per page with Load More option).<br>5. Only reviews with Status="Approved" are displayed (reviews awaiting moderation are hidden). |

**Admin User Stories:** Administrative functions (inventory management, order fulfillment, staff operations) are implemented in separate applications:
- **Desktop Admin Application (Java):** Stock management, order processing
- **Admin Web Application (Planned):** Future web-based admin panel

---

## 6. Tickets de Trabajo

**Ticket Organization:** Tickets are organized using a systematic ID format (`x.y.z.n`) that directly references story IDs for complete traceability. For example, story `1.1.3` may have tickets `1.1.3.1`, `1.1.3.2`, etc.

**For complete ticket specifications and the full list of 52 implementation tickets across all phases, refer to:**
- **Comprehensive Tickets Document:** [tickets.md](./tickets.md) - All 52 tickets ordered by backlog priority

**Sample Critical Path Tickets (MVP Phase):**

| Ticket ID | Story | Title | Domain | Est. (Pts) | Key AC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1.1.3.1** | 1.1.3 | **[Backend] Setup Password Hashing Service** | Backend | 3 | Bcrypt hashing with 12 rounds; `hashPassword()` and `comparePassword()` functions; unit tests validate both. |
| **1.1.1.1** | 1.1.1 | **[API] User Registration Endpoint** | Backend | 5 | `POST /api/auth/register` validates email (RFC 5322), prevents duplicates (409 error), hashes password, inserts into `lpa_clients`, returns 201 Created. |
| **1.1.1.2** | 1.1.1 | **[Frontend] Registration Form & Page** | Frontend | 5 | React form with client-side validation (password min 8 chars), email format check; submit calls API; success redirects to Login with confirmation. |
| **1.1.2.1** | 1.1.2 | **[API] Login & JWT Token Generation** | Backend | 5 | `POST /api/auth/login` verifies credentials, generates 24h JWT token on success, returns 401 Unauthorized on failure with generic message. |
| **1.1.2.2** | 1.1.2 | **[Frontend] Login Page & Auth Context** | Frontend | 3 | Login form with email/password; submit calls 1.1.2.1 API; stores JWT in LocalStorage; sets AuthContext; redirects to Home. |
| **1.2.1.1** | 1.2.1 | **[Backend] Public Product List Endpoint** | Backend | 3 | `GET /api/products` returns `lpa_stock` records (Active only); supports `?page=1&limit=12` pagination; returns count and hasMore flag. |
| **1.2.1.2** | 1.2.1 | **[Frontend] Product Grid UI** | Frontend | 5 | Responsive grid (4 cols desktop, 2 mobile); displays image, name, price, stock status; out-of-stock items grayed out; pagination controls. |
| **1.4.3.2** | 1.4.3 | **[API] Create Order Transaction** | Backend | 8 | `POST /api/orders` validates stock availability, creates atomic transaction: `lpa_invoices` + `lpa_invoice_items` records, updates `lpa_stock.onhand`, clears cart on success. |
| **1.4.4.2** | 1.4.4 | **[Backend] Order Confirmation Email** | Backend | 3 | Triggered after successful checkout (1.4.3.2); includes Invoice ID, items, total, tracking placeholder; uses SendGrid; error logging only (non-blocking). |

**Sample Phase 2 Tickets (Search & Account Mgmt):**

| Ticket ID | Story | Title | Domain | Est. (Pts) | Key AC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **2.5.1.1** | 2.5.1 | **[API] Keyword Search Endpoint** | Backend | 5 | `GET /api/products/search?q=query` searches `lpa_stock` (name, description, sku) with LIKE or full-text; returns paginated results; no results handling. |
| **2.5.1.2** | 2.5.1 | **[Frontend] Search Bar Component** | Frontend | 5 | Debounced search-as-you-type with 5 quick suggestions; Enter key navigates to `/search?q=...` with full results grid; search term highlighted. |
| **2.6.2.1** | 2.6.2 | **[API] Get User Orders Endpoint** | Backend | 3 | `GET /api/profile/orders` (auth required) returns user's invoices from `lpa_invoices` sorted by date descending; supports pagination. |
| **2.6.2.2** | 2.6.2 | **[Frontend] Order History Page** | Frontend | 3 | Table layout: Order ID, Date, Item Count, Status, Total; status badges (Paid/Shipped/Delivered); clicking row shows detail view; pagination controls. |

**Sample Phase 3 Tickets (Engagement):**

| Ticket ID | Story | Title | Domain | Est. (Pts) | Key AC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **3.9.4.1** | 3.9.4 | **[API] Get Product Reviews Endpoint** | Backend | 2 | `GET /api/products/:id/reviews` returns approved reviews; includes average rating calculation; sorted by helpful/recent; paginated. |
| **3.9.4.2** | 3.9.4 | **[Frontend] Product Reviews Display** | Frontend | 3 | Reviews section on product detail page; average rating badge (e.g., "4.5★ based on 42 reviews"); individual review cards; helpful voting buttons. |
| **3.10.1.1** | 3.10.1 | **[API] Reorder Helper Endpoint** | Backend | 2 | `POST /api/profile/orders/:invoiceId/reorder` (auth required) reads line items from prior invoice, checks current stock, returns items with current prices. |
| **3.10.1.2** | 3.10.1 | **[Frontend] Reorder Functionality** | Frontend | 3 | "Reorder" button on Order History; calls 3.10.1.1 API; adds items to cart with updated prices; warns on out-of-stock; redirects to cart with confirmation. |

**Administrative Tickets:** Implementation tickets for inventory management, order fulfillment, and staff operations are maintained separately in the Desktop Admin Application and planned Admin Web Application repositories.

**Ticket Statistics:**
- **Total Implementation Tickets:** 52
- **Phase 1 (MVP):** 18 tickets across 13 stories
- **Phase 2 (V1):** 14 tickets across 8 stories
- **Phase 3 (V2):** 20 tickets across 9 stories
- **Estimated Delivery:** 7-10 sprints at typical 5-7 tickets/sprint velocity

---

## 7. Pull Requests

This section documents three critical pull requests that delivered core e-commerce functionality during the project execution.

---

### **Pull Request 1: Product Details Feature**

**PR #11** | **Branch:** `e-comm/feat/product-details` | **Status:** ✅ Merged (March 26, 2026)
**Author:** mrodriguezul

#### Description
Implemented complete "Get Product By ID" feature for the e-commerce backend, enabling customers to view detailed product information. The implementation spans backend logic, API endpoints, and frontend components with comprehensive testing across all layers.

#### Key Changes
**Backend:**
- Implemented `GetProductByIdUseCase` with Zod input validation and custom `ProductNotFoundError` handling
- Extended repository interfaces with `findById()` method supporting null returns for inactive/missing products
- Updated `ProductController` with `getProductById` method handling multiple error scenarios

**Frontend:**
- Developed `useProduct` hook and `ProductDetail` component with loading, error, and success states
- Updated product detail page UI to align with finalized design specifications
- Implemented two-column layout (desktop) with product image, SKU, name, description, price, and stock information

**Testing:**
- Comprehensive unit tests for use case validation and error handling
- Extensive controller tests covering edge cases and Zod validation failures
- Frontend component tests for all state variations

**Commits:** 5 commits across use case, repository, controller, and component implementations
**Tickets Addressed:** [1.2.2.1](./tickets.md)

---

### **Pull Request 2: Login & JWT Authentication**

**PR #14** | **Branch:** `e-comm/feat/login-account` | **Status:** ✅ Merged (April 3, 2026)
**Author:** mrodriguezul

#### Description
Introduced complete login feature with JWT-based authentication, enabling secure client access to protected resources. This PR implements the authentication layer required for checkout and personal account management.

#### Key Changes
**Authentication & Security:**
- Implemented `LoginClientUseCase` with input validation and password verification via Bcrypt comparison
- Created `JwtService` generating 24-hour expiration JWT tokens
- Added `JWT_SECRET` environment variable configuration for secure token signing
- Integrated JWT middleware for route protection

**Backend API:**
- `POST /api/auth/login` endpoint for credential validation and token generation
- Returns JWT token and user data on successful authentication
- Returns 401 Unauthorized with generic error message on failure (prevents username enumeration)

**Dependencies:**
- Added `jsonwebtoken` and `@types/jsonwebtoken` packages for token management

**Testing:**
- Comprehensive `LoginClientUseCase` tests covering successful authentication and error scenarios
- Refactored `AuthController.test.ts` to support both registration and login workflows
- Edge case coverage for invalid credentials and missing user records

**Commits:** 7 commits merged addressing authentication implementation and Sprint 2 documentation

**Tickets Addressed:** [1.1.2.1](./tickets.md), [1.1.2.2](./tickets.md)

---

### **Pull Request 3: Checkout & Order Transaction**

**PR #15** | **Branch:** `e-comm/feat/checkout-transaction` | **Status:** ✅ Merged (April 5, 2026)
**Author:** mrodriguezul

#### Description
Implemented secure, transactional order creation flow that validates customer identity, checks stock availability, updates inventory, and generates invoices. This PR completes the core checkout workflow required for customers to complete purchases.

#### Key Changes
**Order Processing:**
- `CreateOrderUseCase` encapsulates order creation with payment token validation and business rule enforcement
- `PrismaOrderRepository` executes atomic database transactions ensuring data consistency
- `OrderController` handles HTTP order creation requests with comprehensive error handling

**API & Security:**
- `POST /api/orders` endpoint established with JWT authentication requirements (Auth middleware)
- Request validation ensures only authenticated users can create orders
- Backend independently fetches current product prices (prevents client-side price tampering)
- Atomic transactions: if any step fails, entire transaction rolls back

**Business Logic:**
- Validates client exists and is authenticated via JWT
- Checks stock availability for all cart items before order creation
- Updates `lpa_stock.onhand` to decrease available inventory
- Creates `lpa_invoices` header record with customer snapshot data
- Creates `lpa_invoice_items` line items with historical price snapshots
- Returns invoice ID and 201 Created status on success

**Testing:**
- Unit tests covering successful order creation flows
- Authorization and JWT validation test cases
- Stock validation and inventory update verification
- Error handling for insufficient inventory and payment failures
- Transaction rollback scenarios

**Documentation:**
- API endpoint specifications updated
- Acceptance criteria finalized for checkout stories (1.4.3, 1.4.4)
- Sprint 3 documentation reflecting implementation progress

**Commits:** 9 commits merged addressing order transaction implementation, acceptance criteria updates, and project documentation

**Tickets Addressed:** [1.4.3.1](./tickets.md), [1.4.3.2](./tickets.md), [1.4.4.1](./tickets.md), [1.4.4.2](./tickets.md)

---

### **Summary of PRs**

| PR | Feature | Domain | Status | Merged Date |
| :--- | :--- | :--- | :--- | :--- |
| **#11** | Product Details & View | Frontend/Backend | ✅ Merged | March 26, 2026 |
| **#14** | Login & JWT Authentication | Backend/Security | ✅ Merged | April 3, 2026 |
| **#15** | Checkout & Order Transaction | Backend/API | ✅ Merged | April 5, 2026 |

These three pull requests delivered the core MVP functionality: product discovery → user authentication → checkout & order completion.

