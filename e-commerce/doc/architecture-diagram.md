# LPA eComms - Software Architecture Document (Web Implementation)

## 1. System Architecture

### Architectural Pattern: Headless E-Commerce (Decoupled)
The project utilizes a **Headless Architecture**, separating the frontend presentation layer from the backend business logic. This allows the E-Commerce Web Application to be agile and modern while sharing a centralized database with the legacy Desktop system.

* **Scope:** This specific project implements the **Web Storefront** and **Backend API**.
* **External Context:** The system is designed to coexist with a Java Desktop Application (Admin) and Android Application (Mobile) as defined in the broader business requirements[cite: 41, 245].

### Architecture Diagram

```mermaid
graph TD
    subgraph "Project Scope: E-Commerce Web System"
        Web["Web Storefront (React.js)"]
        API["Backend API (Node.js/Express)"]
    end

    subgraph "External / Legacy Systems"
        DB["MySQL Centralized Database"]
        Desktop["Desktop Admin App (Java)"]
        Mobile["Mobile App (Android)"]
    end

    Web -->|HTTPS and JSON| API
    API -->|SQL with ORM| DB
    Desktop -.->|Legacy JDBC| DB
    Mobile -.->|HTTPS and JSON| API
```
