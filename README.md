# CTI ADP Software - Complete LPA System

A comprehensive, multi-platform enterprise management and e-commerce system developed for the CTI Course - Advanced Programming. The LPA (Logistics and Product Administration) system provides complete solutions for business administration, inventory management, and customer-facing e-commerce.

## 🎯 Project Overview

This is an **integrated suite of four applications** working together to manage both admin operations and customer-facing commerce:

1. **E-Commerce Web Storefront** (React + Node.js) - Customer shopping platform
2. **Admin Web Portal** (PHP + PostgreSQL) - Web-based staff administration
3. **Admin Desktop App** (JavaFX) - Desktop inventory management
4. **Admin Mobile App** (Kotlin/Android) - Mobile access to admin portal

All applications share a common PostgreSQL database and follow enterprise architecture principles including Domain-Driven Design (DDD), SOLID principles, and role-based access control.

## 📱 System Components

### 1. **E-Commerce Application** (`/e-commerce`)
**Purpose**: Customer-facing online shopping platform for electronics

**Technology**: React 18 + TypeScript + Vite (Frontend) | Node.js + Express + Prisma (Backend) | PostgreSQL 15

**Key Features**:
- User authentication with JWT
- Product browsing and search with filtering/sorting
- Shopping cart with session persistence
- Multi-step checkout (shipping, payment, review)
- Order management and history
- User profiles and wishlist management
- Product reviews and recommendations
- Responsive design (desktop & mobile)

**Setup**: See [e-commerce/README.md](e-commerce/README.md) for detailed instructions

---

### 2. **Admin Web Portal** (`/webapp`)
**Purpose**: Web-based administration interface for staff

**Technology**: PHP 7.4+ | PostgreSQL 10+ | Bootstrap 4 | jQuery

**Key Features**:
- Role-based access control (RBAC)
- User authentication
- Inventory/Stock management (CRUD operations)
- Sales management and reporting
- Action logging and audit trails
- Responsive interface for desktop and tablets
- Real-time search and filtering

**Setup**: See [webapp/README.md](webapp/README.md) for installation instructions

---

### 3. **Admin Desktop Application** (`/desktop`)
**Purpose**: Desktop-based inventory and stock management for desktop users

**Technology**: JavaFX | PostgreSQL | Domain-Driven Design (DDD) Architecture

**Key Features**:
- Comprehensive stock management (CRUD)
- Real-time search and sorting
- Modern desktop UI with JavaFX
- Database connection management
- Input validation and error handling
- Follows SOLID principles and DDD architecture

**Build**: Maven-based project. See [desktop/README.md](desktop/README.md)

---

### 4. **Admin Mobile Application** (`/mobile`)
**Purpose**: Mobile access to the admin web portal

**Technology**: Kotlin | Android (API 24-34) | Jetpack Compose | WebView

**Key Features**:
- Native Android app with WebView wrapper
- Connects to admin web portal (login.php)
- 4-second splash screen with loading indicator
- JavaScript-enabled for dynamic web content
- Material Design 3 UI
- Support for Android 7.0 (API 24) to Android 14 (API 34)

**Setup**: See [mobile/README.md](mobile/README.md)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client Applications                          │
├─────────────────────────────────────────────────────────────────┤
│  Browser (React SPA)  │  Web Browser  │  JavaFX Desktop │  Android
│  E-Commerce Store    │  Admin Portal  │  Admin Desktop  │  Mobile Admin
└──────────┬────────────┴────────────┬───┴────────────┬───┴──────┬───
           │                        │                │          │
           │ HTTP/REST             │ HTTP           │ WebView  │
           │ (Axios)               │ (Browser)      │ (JS)     │
           │                       │                │          │
├──────────┴────────────┬───────────┴────────────┬───┴──────────┴──┐
│                   Backend Services                               │
├──────────────────────────────────────────────────────────────────┤
│  Node.js Express API                    │  PHP Admin Portal      │
│  (TypeScript, Prisma ORM)               │  (Role-Based Access)   │
│  ├── Auth Service (JWT)                 │  ├── User Management   │
│  ├── Product Service                    │  ├── Stock Management  │
│  ├── Cart Service                       │  ├── Sales Management  │
│  ├── Order Service                      │  └── Audit Logging     │
│  └── User Service                       │                        │
└──────────────────┬───────────────────────┴────────────┬──────────┘
                   │                                    │
                   └────────────┬──────────────────────┘
                                │
                    ┌───────────┴──────────┐
                    │  PostgreSQL 15       │
                    │  Shared Database     │
                    │  (Docker Container)  │
                    └──────────────────────┘
```

## 🗄️ Shared Database

All applications connect to a single PostgreSQL 15 database containing:
- **Users & Authentication**: User accounts, roles, permissions
- **Products**: Product catalog, pricing, inventory
- **Stock**: Inventory levels across warehouses
- **Orders**: Customer orders from e-commerce
- **Sales**: Staff-recorded sales transactions
- **Audit Logs**: All system actions logged for compliance

**Database Setup**: See `assets/db/` directory for SQL schema files

---

## 🚀 Getting Started

### Quick Start (All Components)

#### Prerequisites
- **Node.js** 18+ (for e-commerce backend)
- **PHP** 7.4+ (for admin web portal)
- **Java** 8+ & Maven (for desktop app)
- **Android Studio** (for mobile app)
- **PostgreSQL** 15 (or Docker)
- **Docker & Docker Compose** (optional but recommended)

#### 1. Setup Database
```bash
# Using Docker
cd e-commerce
docker-compose up -d

# Or manually: Import SQL files from assets/db/
# lpa_ecomms_schema.sql - Main schema
# synthetic_test_fixtures.sql - Test data
```

#### 2. Start E-Commerce Backend
```bash
cd e-commerce/backend
npm install
npm run dev  # Development server on http://localhost:3001
```

#### 3. Start E-Commerce Frontend
```bash
cd e-commerce/frontend
npm install
npm run dev  # Development server on http://localhost:5173
```

#### 4. Setup Admin Web Portal
```bash
cd webapp

# Update database credentials in database_credentials.php
# Configure your PHP server (XAMPP, Apache, etc.)
# Access at http://localhost/cti-adp-software/webapp/login.php
```

#### 5. Build Desktop Admin App
```bash
cd desktop
mvn clean install
mvn javafx:run  # Run the application
```

#### 6. Build Mobile Admin App
```bash
cd mobile
# Open in Android Studio and run on emulator or device
```

---

## 📁 Project Structure

```
cti-adp-software/
│
├── e-commerce/                     # Customer-Facing E-Commerce Platform
│   ├── frontend/                   # React SPA with Vite
│   ├── backend/                    # Node.js Express API
│   ├── docker-compose.yml          # Database container
│   └── assets/db/                  # Database schemas and test data
│
├── webapp/                         # Web-Based Admin Portal
│   ├── login.php                   # Authentication
│   ├── index.php                   # Dashboard
│   ├── stock.php                   # Inventory Management
│   ├── sales.php                   # Sales Management
│   ├── css/ & js/                  # Frontend assets
│   └── templates/                  # Page templates
│
├── desktop/                        # Desktop Admin Application
│   ├── src/main/java/             # JavaFX application
│   ├── pom.xml                    # Maven configuration
│   └── architecture-diagram.mermaid
│
├── mobile/                         # Android Admin App
│   ├── app/src/                   # Kotlin source code
│   ├── build.gradle               # Gradle configuration
│   └── AndroidManifest.xml        # App manifest
│
├── assets/                         # Shared Resources
│   ├── db/                        # Database files
│   │   ├── lpa_ecomms_schema.sql
│   │   ├── synthetic_test_fixtures.sql
│   │   └── mock_data.sql
│   └── test-reports/              # Test coverage reports
│
├── doc/                            # Project Documentation
│   ├── architecture-diagram.md
│   ├── epics.md
│   ├── product-backlog.md
│   └── phase-1/2/3-user-stories.md
│
└── README.md                       # This file
```

---

## 🛠️ Development Setup by Role

### Frontend Developer (E-Commerce UI)
1. Navigate to `e-commerce/frontend`
2. See [e-commerce/README.md](e-commerce/README.md) for setup
3. Uses React 18, TypeScript, Vite, Tailwind CSS

### Backend Developer (Node.js API)
1. Navigate to `e-commerce/backend`
2. See [e-commerce/README.md](e-commerce/README.md) for setup
3. Uses Express, Prisma ORM, PostgreSQL

### Web Admin Developer (PHP)
1. Navigate to `webapp`
2. See [webapp/README.md](webapp/README.md) for setup
3. Configure PHP server and PostgreSQL connection

### Desktop Developer (JavaFX)
1. Navigate to `desktop`
2. See [desktop/README.md](desktop/README.md) for setup
3. Uses Maven, JavaFX, DDD architecture

### Mobile Developer (Android)
1. Navigate to `mobile`
2. See [mobile/README.md](mobile/README.md) for setup
3. Uses Android Studio, Kotlin, Jetpack Compose

---

## 📊 Testing

Each component has its own testing strategy:

- **E-Commerce Frontend**: Vitest + React Testing Library
  ```bash
  cd e-commerce/frontend && npm run test
  ```

- **E-Commerce Backend**: Jest
  ```bash
  cd e-commerce/backend && npm run test
  ```

- **Desktop App**: JUnit tests with Maven
  ```bash
  cd desktop && mvn test
  ```

- **Mobile App**: Espresso & Compose UI tests
  ```bash
  cd mobile && ./gradlew connectedAndroidTest
  ```

See individual component READMEs for detailed testing instructions.

---

## 🔐 Security Features

- **Authentication**: JWT tokens (e-commerce), Session-based (web portal)
- **Authorization**: Role-based access control (RBAC)
- **Password Security**: Bcrypt hashing
- **Database Security**: SQL prepared statements, connection pooling
- **Input Validation**: Server-side validation across all components
- **Audit Logging**: All critical actions logged
- **HTTPS Ready**: All backends support TLS/SSL configuration

---

## 🎓 Educational Focus

This project demonstrates:
- **Software Architecture**: DDD, Layered Architecture, Microservices concepts
- **Design Patterns**: Singleton, Factory, Repository, Strategy patterns
- **SOLID Principles**: Applied across all components
- **Testing**: Unit testing, Integration testing, E2E testing
- **Database Design**: Normalized schema, transactions, constraints
- **Full-Stack Development**: Frontend, backend, database, deployment
- **Version Control**: Git workflow with feature branches
- **Documentation**: Comprehensive API and component documentation

---

## 📚 Documentation

See the `/doc` directory for:
- **Architecture Diagrams**: System design and component relationships
- **User Stories**: Phase 1, 2, and 3 feature specifications
- **Product Backlog**: Complete feature list and priority
- **Epics**: High-level feature groupings
- **Test Reports**: Coverage and execution reports
- **Code Review Logs**: Development decisions and reviews
- **Risk Assessment**: Known issues and mitigation strategies

---

## 🔄 Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/component-name/feature-description
   ```

2. **Make Changes** in your component directory

3. **Run Tests** for your component
   ```bash
   # See component-specific README for test commands
   ```

4. **Commit Changes**
   ```bash
   git commit -m "feat(component): description of changes"
   ```

5. **Submit Pull Request** with description and test results

6. **Code Review** by team members

7. **Merge to Main** after approval

---

## 🚢 Deployment

### Development Environment
- Use Docker Compose for database and services
- Local development servers for each component
- Hot reload enabled for all components

### Production Environment
- Containerize all services with Docker
- Use PostgreSQL managed service (AWS RDS, Azure Database, etc.)
- Deploy backends to cloud platforms
- Static frontend assets to CDN
- Database backups and monitoring

See individual component READMEs for deployment-specific instructions.

---

## 📞 Support & Collaboration

For questions or issues:
1. Check the component-specific README in each directory
2. Review documentation in `/doc`
3. Check the project's issue tracker
4. Contact the development team or course instructor

---

## 📄 License

Educational Use Only - This project is part of the CTI Course (Advanced Programming) and is intended for educational purposes.

**Free for:**
- Students enrolled in CTI courses
- Educational institutions
- Learning and studying purposes

**Restrictions:**
- Not for commercial use without written permission
- Must retain attribution and copyright notices

For commercial use or licensing inquiries, contact the course instructor.

---

## 🙏 Acknowledgments

- **CTI Course Instructors** - Project oversight and guidance
- **All Contributors** - Students and team members who developed components
- **Open Source Community** - Libraries and tools used in this project

---

**Last Updated**: May 13, 2026
**Course**: CTI - Advanced Programming
**Version**: 1.0