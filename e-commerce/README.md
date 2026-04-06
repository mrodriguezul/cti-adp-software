# E-Commerce Application

## Overview

This is the **Customer-Facing Web Storefront** for LPA eComms, an electronics e-commerce platform developed as part of the CTI Advanced Programming course. The web application provides a complete online shopping experience with product browsing, cart management, order processing, and payment simulation.

**Note:** Admin operations are handled in separate applications:
- **Desktop Admin App (Java)** - For staff inventory and order management (see `/desktop` directory)
- **Admin Web App** - Planned for future development (separate repository)

## Application Scope

**This directory contains the Customer-Facing Web Storefront application.** Admin features (inventory management, order fulfillment, staff operations) are implemented in separate applications:
- **Admin Web Application**: Coming soon (separate repository)
- **Admin Desktop Application (Java)**: See parent `desktop/` directory in the project root

## Features (Customer-Facing Web Storefront)

### ✅ Phase 1: MVP (Implemented)
- **User Authentication**: Register account, login with JWT
- **Product Catalog**: Browse products in responsive grid (4 cols desktop, 2 mobile)
- **Product Details**: View detailed product information, specs, price, stock status
- **Shopping Cart**: Add/remove items, update quantities, persist across sessions
- **Guest Shopping**: Browse and cart without registration; login required at checkout
- **Multi-Step Checkout**:
  - Step 1: Shipping address collection
  - Step 2: Mock payment (Credit Card / PayPal)
  - Step 3: Order review before final submission
- **Order Processing**: Secure transactional order creation with atomic database updates
- **Order Confirmation**: Thank you page with invoice number and order summary
- **Security**: Bcrypt password hashing, JWT authentication, server-side price validation

### 🔄 Phase 2: Enhanced UX & Optimization (In Progress)
- **Product Search**: Keyword search across name, description, SKU
- **Price Filtering**: Filter products by price range
- **Product Sorting**: Sort by price (asc/desc), name, newest
- **User Profile**: Edit account information, phone, address
- **Order History**: View past orders with status badges
- **Order Details**: View line items with historical prices and shipping info
- **Change Password**: Secure password update functionality
- **Category Filtering**: Filter products by category

### 📋 Phase 3: Growth & Customer Engagement (Planned)
- **Product Reviews**: Read reviews, write verified buyer reviews with 1-5 star ratings
- **Wishlist**: Save favorite products for later
- **Wishlist Management**: View, manage, and add wishlisted items to cart
- **Related Products**: "You Might Also Like" recommendations on product detail
- **Personalized Recommendations**: Recommendations based on browsing/purchase history
- **Quick Reorder**: Fast reorder of previous purchases
- **Purchase Summary**: Dashboard showing total spent, orders, favorite categories
- **Order Notifications**: Email notifications for order status updates (Paid, Shipped, Delivered)
- **Notification Preferences**: Opt-in/out of notifications in account settings

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (fast development server and optimized builds)
- **State Management**: Context API (AuthContext, CartContext)
- **Component Library**: Shadcn/UI + Tailwind CSS
- **HTTP Client**: Axios
- **Form Validation**: React Hook Form
- **Testing**: Vitest, React Testing Library

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma (type-safe database access)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **Architecture**: Domain-Driven Design (DDD)

### Database & Infrastructure
- **Database**: PostgreSQL 15 (Docker container)
- **Containerization**: Docker & Docker Compose
- **Persistence**: Named volumes for database data

### Additional Tools
- **Testing**: Jest (Backend), Vitest (Frontend)
- **Linting**: ESLint, Prettier
- **Package Manager**: npm
- **API Documentation**: OpenAPI/Swagger ready
- **Email Service**: SendGrid or Nodemailer (integration ready)

## Project Structure

```
e-commerce/
│
├── frontend/                       # React + Vite + TypeScript SPA
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── pages/                 # Route pages (Index, Products, ProductDetail, Cart, Checkout, etc.)
│   │   ├── components/
│   │   │   ├── layout/            # Header, Footer, Layout
│   │   │   ├── ui/                # Shadcn/UI components (Button, Card, Dialog, etc.)
│   │   │   └── [custom components]
│   │   ├── context/               # AuthContext, CartContext (global state)
│   │   ├── services/              # API communication (ProductService, AuthService, OrderService)
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── lib/                   # Utility functions
│   │   ├── assets/                # Images, icons
│   │   ├── App.tsx                # Main app component with routing
│   │   └── main.tsx               # React entry point
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                        # Node.js Express API (DDD Architecture)
│   ├── src/
│   │   ├── domain/                # Pure business logic (no external dependencies)
│   │   │   ├── entities/          # Client, Product, Invoice (domain models)
│   │   │   ├── repositories/      # Repository interfaces (contracts)
│   │   │   └── value-objects/     # Business value objects
│   │   │
│   │   ├── application/           # Use cases & orchestration
│   │   │   ├── use-cases/         # RegisterClientUseCase, LoginClientUseCase, GetProductsUseCase, CreateOrderUseCase
│   │   │   ├── services/          # Business services (OrderService, etc.)
│   │   │   └── dto/               # Data Transfer Objects
│   │   │
│   │   ├── infrastructure/        # External integrations & implementations
│   │   │   ├── config/            # Database & app config
│   │   │   ├── persistence/       # Prisma repository implementations
│   │   │   ├── security/          # PasswordService, JwtService
│   │   │   └── external-services/ # Email, payment gateways
│   │   │
│   │   ├── presentation/          # HTTP layer (Controllers, Routes, Middleware)
│   │   │   ├── controllers/       # AuthController, ProductController, OrderController
│   │   │   ├── routes/            # auth.routes.ts, product.routes.ts, order.routes.ts
│   │   │   └── middleware/        # authMiddleware, error handling
│   │   │
│   │   ├── shared/                # Cross-cutting concerns
│   │   │   ├── exceptions/        # Custom error classes
│   │   │   ├── types/             # Shared interfaces
│   │   │   └── utils/             # Helper utilities
│   │   │
│   │   └── index.ts               # App entry point (Express setup)
│   │
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/            # Version-controlled schema changes
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env (environment variables)
│
├── assets/
│   └── db/
│       ├── lpa_ecomms_schema.sql   # Database initialization script
│       └── mock_data.sql           # Seed data
│
├── doc/                           # Project documentation
│   ├── README.md                  # Main project documentation
│   ├── phase-1-user-stories.md    # MVP user stories (13 stories)
│   ├── phase-2-user-stories.md    # Phase 2 user stories (8 stories)
│   ├── phase-3-user-stories.md    # Phase 3 user stories (9 stories)
│   ├── tickets.md                 # Technical work tickets (52 total)
│   ├── epics.md                   # Epic descriptions
│   └── product-backlog.md         # Product backlog
│
├── docker-compose.yml             # Docker services configuration
└── .env                           # Root environment file
```

## Getting Started

### Prerequisites
- **Node.js** >= 18.0.0 and **npm** >= 9.0.0
- **Docker** and **Docker Compose** (for PostgreSQL database container)
- **Git**
- A terminal/bash shell

### Quick Start (1-5 minutes)

1. **Clone and Navigate to Project**
   ```bash
   git clone https://github.com/mrodriguezul/cti-adp-software.git
   cd cti-adp-software/e-commerce
   ```

2. **Start Database (PostgreSQL via Docker)**
   ```bash
   docker-compose up -d
   ```
   - PostgreSQL 15-alpine container starts automatically
   - Database schema initializes from `assets/db/lpa_ecomms_schema.sql`
   - Mock data loads from `assets/db/mock_data.sql`
   - Verify with: `docker ps | grep cti-postgres-db`

3. **Install Backend Dependencies & Start**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   - Backend API runs on `http://localhost:3000`

4. **Install Frontend Dependencies & Start** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - Frontend runs on `http://localhost:5173` (Vite default)

5. **Access the Application**
   - Open browser to `http://localhost:5173`
   - Create test account: `test@example.com` / `password123`
   - Browse products → Add to cart → Checkout

### Detailed Installation

#### Step 1: Database Setup (PostgreSQL via Docker)

```bash
cd e-commerce
docker-compose up -d
```

**Verify Database:**
```bash
docker ps | grep cti-postgres-db
```

**Access Database (optional):**
```bash
docker exec -it cti-postgres-db psql -U cti_user -d cti_ecommerce
```

**Stop Database:**
```bash
docker-compose down
```

**Stop & Remove Data:**
```bash
docker-compose down -v
```

#### Step 2: Backend Setup (Node.js API)

```bash
cd backend
npm install
```

**Configure Environment Variables:**
```bash
cp .env.example .env
```

**Key Environment Variables (.env):**
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

**Generate Prisma Client:**
```bash
npm run prisma:generate
```

**Run Database Migrations (if applicable):**
```bash
npm run prisma:migrate
```

**Start Backend:**
```bash
# Development (with hot reload)
npm run dev

# Production Build
npm run build
npm start
```

Backend API: `http://localhost:3000`

#### Step 3: Frontend Setup (React + Vite)

```bash
cd frontend
npm install
```

**Configure Environment Variables:**
```bash
# Create .env file in frontend directory
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENV=development
```

**Start Frontend:**
```bash
# Development Server
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

Frontend: `http://localhost:5173` (default Vite port)

### Running All Services

**Terminal 1 - Database:**
```bash
cd e-commerce
docker-compose up -d
```

**Terminal 2 - Backend:**
```bash
cd e-commerce/backend
npm install    # First time only
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd e-commerce/frontend
npm install    # First time only
npm run dev
```

### Testing the Application

1. **Open Browser:** `http://localhost:5173`
2. **Create Test Account:**
   - Email: `test@example.com`
   - Password: `password123`
3. **Test Features:**
   - Browse products (seeded from mock data)
   - Add items to cart
   - Proceed to checkout
   - Complete mock transaction

### Database Connection Details

| Parameter | Value |
| :--- | :--- |
| Host | localhost |
| Port | 5432 |
| Database | cti_ecommerce |
| User | cti_user |
| Password | cti_password_dev |

### Useful Commands

| Command | Purpose | Location |
| :--- | :--- | :--- |
| `docker-compose up -d` | Start database | e-commerce/ |
| `docker-compose down` | Stop all containers | e-commerce/ |
| `docker-compose down -v` | Stop and remove volumes | e-commerce/ |
| `npm run dev` | Start dev server | backend/ or frontend/ |
| `npm run build` | Build for production | backend/ or frontend/ |
| `npm test` | Run tests | backend/ or frontend/ |
| `npm run lint` | Check code style | backend/ or frontend/ |
| `npm run lint:fix` | Auto-fix code | backend/ or frontend/ |
| `npm run prisma:studio` | Open Prisma Studio GUI | backend/ |

### Troubleshooting

**Port Already in Use:**
```bash
# Backend (3000)
lsof -i :3000 && kill -9 <PID>

# Frontend (5173)
lsof -i :5173 && kill -9 <PID>

# Database (5432)
lsof -i :5432 && kill -9 <PID>
```

**Database Connection Errors:**
- Verify Docker container is running: `docker ps`
- Check `.env` variables in `backend/.env`
- View logs: `docker logs cti-postgres-db`

**Module Not Found:**
```bash
rm -rf node_modules
npm install
```

**Frontend Not Connecting to API:**
- Check `VITE_API_BASE_URL` in `frontend/.env`
- Verify backend is running: `http://localhost:3000/api`
- Check CORS settings in backend

## API Endpoints

### Base URL: `http://localhost:3000/api`

### Authentication
- `POST /auth/register` - Register new customer account
  - Body: `{ firstname, lastname, email, password, phone?, address? }`
  - Returns: 201 Created with client ID

- `POST /auth/login` - Login with credentials
  - Body: `{ email, password }`
  - Returns: JWT token (24h expiration)

### Products
- `GET /products` - Get all products (paginated)
  - Query: `?page=1&limit=12`
  - Returns: Array of active products

- `GET /products/:id` - Get single product details
  - Returns: Full product object with specifications

- `GET /products/search?q=query` - Search products by keyword (Phase 2)
  - Searches: name, description, SKU
  - Returns: Matching products with pagination

### Shopping Cart
- **Client-side only** (LocalStorage via React Context)
- Cart managed through `CartContext` with `useCart()` hook
- No backend cart endpoints (guest-friendly approach)

### Orders
- `POST /orders` - Create new order (requires JWT)
  - Body: Cart items with shipping address
  - Returns: 201 Created with invoice ID

- `GET /profile/orders` - Get user's order history (requires JWT)
  - Query: `?page=1&limit=10`
  - Returns: List of invoices

- `GET /profile/orders/:invoiceId` - Get order details (requires JWT)
  - Returns: Invoice header + line items with historical prices

### User Profile (Phase 2)
- `PUT /profile` - Update user profile (requires JWT)
  - Body: `{ firstname, lastname, phone, address }`
  - Returns: 200 OK with updated profile

- `POST /profile/password` - Change password (requires JWT)
  - Body: `{ current_password, new_password, confirm_password }`
  - Returns: 200 OK

### Reviews (Phase 3)
- `GET /products/:id/reviews` - Get product reviews
  - Query: `?page=1&limit=5`
  - Returns: Array of approved reviews with ratings

- `POST /products/:id/reviews` - Submit product review (requires JWT)
  - Body: `{ rating (1-5), title, text }`
  - Returns: 201 Created

### Wishlist (Phase 3)
- `POST /wishlist` - Add product to wishlist (requires JWT)
  - Body: `{ stock_id }`
  - Returns: 201 Created

- `DELETE /wishlist/:id` - Remove from wishlist (requires JWT)
  - Returns: 204 No Content

- `GET /wishlist` - Get user's wishlist (requires JWT)
  - Returns: Array of wishlisted products

### Recommendations (Phase 3)
- `GET /recommendations` - Get personalized recommendations (requires JWT)
  - Returns: 4-6 products based on browsing/purchase history

## Testing

### Backend Tests (Jest)

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- GetProductByIdUseCase.test.ts
```

**Test Coverage:**
- Use cases: Input validation, business logic, error handling
- Controllers: Request handling, error scenarios, edge cases
- Services: Security (PasswordService, JwtService), validation
- Repositories: Database operations via Prisma

### Frontend Tests (Vitest)

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- ProductCard.test.tsx
```

**Test Coverage:**
- Components: Rendering, user interactions, state changes
- Hooks: Context hooks, custom hooks
- Forms: Validation, error display
- Integration: API calls, navigation

### Linting & Code Quality

```bash
cd backend  # or frontend

# Check code style
npm run lint

# Auto-fix code issues
npm run lint:fix

# Format code
npm run format
```

## Deployment

### Local Development Deployment

All three services run locally for testing:
- **Frontend**: `http://localhost:5173` (Vite dev server)
- **Backend**: `http://localhost:3000` (Express dev server)
- **Database**: `localhost:5432` (PostgreSQL Docker container)

See [Getting Started](#getting-started) for local setup.

### Frontend Deployment (Vercel / Netlify)

**Vercel (Recommended for Vite + React):**
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

**Environment Variables (Vercel):**
- `VITE_API_BASE_URL` - Backend API URL (e.g., `https://api.example.com`)

**Build Output:** Static HTML/CSS/JS in `dist/` directory

### Backend Deployment (AWS ECS / Railway / Heroku)

**Build & Run:**
```bash
cd backend

# Production build
npm run build

# Start production server
npm start
```

**Environment Variables (Production):**
```env
DATABASE_URL=postgresql://user:password@prod-db-host:5432/lpa_ecommerce
PORT=3000
JWT_SECRET=generate-secure-random-string
CORS_ORIGIN=https://yourdomain.com
NODE_ENV=production
```

**Docker Deployment (Optional):**
```bash
# Build Docker image
docker build -t ecommerce-api:latest .

# Run container
docker run -p 3000:3000 --env-file .env ecommerce-api:latest
```

### Database Deployment (Managed PostgreSQL)

**Cloud Providers:**
- **Railway**: Managed PostgreSQL with automatic backups
- **AWS RDS**: Fully managed relational database
- **DigitalOcean**: Managed databases with high availability
- **Neon**: Serverless PostgreSQL with branching

**Migration Steps:**
1. Create managed PostgreSQL instance
2. Update `DATABASE_URL` connection string
3. Run migrations: `npm run prisma:migrate deploy`
4. Optional: Seed with production data

**Backup Strategy:**
- Enable automated backups (daily minimum)
- Point-in-time recovery capability
- Regular testing of restore procedures

### Deployment Checklist

- [ ] Frontend built and optimized (`npm run build`)
- [ ] Backend environment variables configured
- [ ] Database migrations applied
- [ ] CORS origins whitelist updated (production domain)
- [ ] JWT_SECRET rotated for production
- [ ] SSL certificates configured
- [ ] API rate limiting enabled
- [ ] Logging and monitoring configured
- [ ] Email service credentials configured (SendGrid)
- [ ] Smoke tests passed on staging
- [ ] Performance baseline established

## Key Features & Architecture

### Backend Architecture: Domain-Driven Design (DDD)
- **Domain Layer:** Pure business logic without external dependencies
- **Application Layer:** Use cases and business rule orchestration
- **Infrastructure Layer:** Database access, external services, configuration
- **Presentation Layer:** HTTP controllers, routes, middleware

**Benefits:**
- Clear separation of concerns
- Testable business logic
- Easy to swap implementations (database, email service, etc.)
- Scalable and maintainable

### Frontend Architecture: Component-Based & Hooks
- **Pages:** Full-screen views corresponding to routes
- **Components:** Reusable, isolated UI building blocks
- **Context API:** Global state (Authentication, Cart)
- **Custom Hooks:** `useCart()`, `useAuth()` for state management
- **Services:** Axios API communication abstraction

**Benefits:**
- Single Page Application (SPA) with client-side routing
- Fast navigation without page reloads
- Real-time cart and auth state updates
- Responsive design with Tailwind CSS

### Security Best Practices Implemented
- **Password Security:** Bcrypt hashing with 12 rounds
- **Authentication:** JWT tokens with 24-hour expiration
- **Price Tampering Prevention:** Backend fetches authoritative prices (no trusting frontend)
- **Input Validation:** Server-side validation on all endpoints
- **CORS:** Whitelist frontend origin only
- **JWT Middleware:** Protected routes require valid tokens
- **Error Messages:** Generic messages prevent information leakage

### Database Design
- **Normalized Schema:** Separate tables for stock, clients, invoices, items, users
- **Snapshot Pattern:** Invoice data captured at purchase time (price, address)
- **Indexes:** Optimized queries for products, orders, and searches
- **Constraints:** Referential integrity with foreign keys

## Key Learning Objectives

This project demonstrates proficiency in:
- **Full-Stack Development:** React (frontend) → Node.js/Express (backend) → PostgreSQL (database)
- **Modern Technologies:** TypeScript, Vite, Tailwind CSS, Prisma ORM, Docker
- **Software Architecture:** Domain-Driven Design pattern
- **RESTful API Design:** Standardized HTTP verbs, proper status codes, error handling
- **Database Design:** Schema design, migrations, relationships, data integrity
- **Authentication & Security:** JWT tokens, password hashing, CORS, input validation
- **State Management:** Context API for global state (auth, cart)
- **Component-Based UI:** Reusable components, props drilling alternatives
- **Testing:** Unit tests for use cases, services, and React components
- **Version Control:** Git workflows, feature branches, pull requests
- **Problem Solving:** Multi-step checkout, order transactions, inventory management
- **Documentation:** User stories, tickets, technical specs, API documentation
- **DevOps:** Docker containers, environment configuration, deployment strategies

## Project Phases & Delivery

| Phase | Status | Stories | Tickets | Features |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: MVP** | ✅ In Progress | 13 | 18 | Core shopping, auth, checkout |
| **Phase 2: Enhanced UX** | 🔄 Planned | 8 | 14 | Search, filters, account, history |
| **Phase 3: Engagement** | 📋 Planned | 9 | 20 | Reviews, wishlist, recommendations |

**Total:** 30 user stories, 52 implementation tickets

For complete details, see [Project Documentation](./doc/README.md)

## Project Documentation

Complete project documentation is available in the `doc/` directory:

- **[doc/README.md](./doc/README.md)** - Main project specification with architecture, data model, and user stories
- **[doc/phase-1-user-stories.md](./doc/phase-1-user-stories.md)** - MVP user stories (13 stories, 61 story points)
- **[doc/phase-2-user-stories.md](./doc/phase-2-user-stories.md)** - Phase 2 user stories (8 stories, 35 story points)
- **[doc/phase-3-user-stories.md](./doc/phase-3-user-stories.md)** - Phase 3 user stories (9 stories, 50 story points)
- **[doc/tickets.md](./doc/tickets.md)** - Technical work tickets (52 total across all phases)
- **[doc/epics.md](./doc/epics.md)** - Epic descriptions and scope
- **[doc/product-backlog.md](./doc/product-backlog.md)** - Complete backlog with priorities

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Write tests for new functionality
3. Commit with descriptive messages
4. Push to your branch
5. Open a Pull Request with detailed description

**Code Standards:**
- Follow TypeScript strict mode
- Use ESLint and Prettier
- Write tests for all logic (>80% coverage)
- Add JSDoc comments for complex functions
- Update documentation in doc/ folder

## Development Workflow

1. **Read Documentation:** Understand requirements in `doc/README.md`
2. **Pick a Ticket:** Choose from `doc/tickets.md`
3. **Create Branch:** `git checkout -b e-comm/feat/feature-name`
4. **Write Tests First:** TDD approach for reliability
5. **Implement Feature:** Write implementation code
6. **Run Tests:** `npm test` in both frontend & backend
7. **Submit PR:** Link to related user story/ticket
8. **Code Review:** Get approval before merge

## Performance & Optimization

### Frontend
- **Bundle Size:** <200KB gzipped (Vite optimizations)
- **Lazy Loading:** Route-based code splitting
- **Caching:** Static assets cached via HTTP headers
- **Optimization:** Image optimization, CSS purging with Tailwind

### Backend
- **Query Optimization:** Indexed queries for products, orders
- **Pagination:** 12 items per page (configurable)
- **Caching:** Response caching for product lists
- **Database:** Connection pooling via Prisma

### Database
- **Indexes:** Created on frequently queried columns
- **Query Plans:** Optimized for search and filtering
- **Migrations:** Version-controlled schema changes
- **Backups:** Critical for data integrity

## Status & Roadmap

| Period | Focus | Status |
| :--- | :--- | :--- |
| **Q1 2026** | MVP Implementation | ✅ In Progress |
| **Q2 2026** | Phase 2 - Search & Optimization | 🔄 Planned |
| **Q3 2026** | Phase 3 - Engagement Features | 📋 Planned |
| **Q4 2026** | Production Release & Optimization | 🎯 Target |

---

## Contact & Support

**Project Author:** Miguel Angel Rodríguez Ullilén
**Course:** CTI - Advanced Programming
**Academic Year:** 2025-2026
**Repository:** https://github.com/mrodriguezul/cti-adp-software

For questions or issues, please open a GitHub issue or contact the course instructor.

---

**Project Status:** MVP Phase - In Development
**Last Updated:** April 6, 2026
