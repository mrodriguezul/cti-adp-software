# LPA eComms - Web Storefront Documentation Guide

**Last Updated:** March 9, 2026  
**Scope:** Customer-Facing Web Storefront Application

---

## 📋 Overview

This documentation guide provides a complete reference for the **LPA eComms Web Storefront** - the customer-facing e-commerce web application for electronics retail.

**Important Note:** Admin operations (inventory management, order fulfillment, staff management) are handled in **separate applications**:
- **Desktop Admin Application (Java)** - Located in `/desktop` directory of the project root
- **Admin Web Application** - Planned future development (separate repository)

---

## 📚 Documentation Structure

### 1. **Project Documentation** (`/doc` directory)

#### Core Documents:
| Document | Purpose | Content |
|----------|---------|---------|
| **[epics.md](./doc/epics.md)** | Epic descriptions and scope | 7 Customer-Facing Epics (Epic-01 through Epic-07) with business value, key scope, and technical details |
| **[phase-1-user-stories.md](./doc/phase-1-user-stories.md)** | MVP stories (13 stories, 61 pts) | Core shopping experience: Registration → Browse → Cart → Checkout → Confirmation |
| **[phase-2-user-stories.md](./doc/phase-2-user-stories.md)** | V1 stories (8 stories, 35 pts) | Search, filtering, customer account management, order history |
| **[phase-3-user-stories.md](./doc/phase-3-user-stories.md)** | V2 stories (9 stories, 50 pts) | Engagement features: Wishlists, reviews, recommendations, notifications |
| **[product-backlog.md](./doc/product-backlog.md)** | Prioritized backlog (30 validated stories) | All 30 customer stories ranked by strategic value and dependency chain |
| **[README.md](./doc/README.md)** | Comprehensive project documentation | Architecture, database schema, security, endpoints, references |
| **[roadmap.md](./doc/roadmap.md)** | Implementation timeline | Phase timelines, sprint estimates, scope for each phase |

#### Supporting Documents:
| Document | Purpose |
|----------|---------|
| **[architecture-diagram.md](./doc/architecture-diagram.md)** | System architecture and data flow |
| **[use-case-diagram.md](./doc/use-case-diagram.md)** | User interaction flows and use cases |
| **[tickets.md](./doc/tickets.md)** | Implementation work tickets and tasks |

### 2. **Root Documentation**

| Document | Purpose | Content |
|----------|---------|---------|
| **[README.md](./README.md)** | Application overview | Features, tech stack, getting started, installation |
| **[REORGANIZATION_SUMMARY.md](./REORGANIZATION_SUMMARY.md)** | Change history | Scope reorganization rationale and statistics |
| **[DOCUMENTATION_GUIDE.md](./DOCUMENTATION_GUIDE.md)** | **This file** | Navigation guide for all documentation |

### 3. **Prompts Directory** (`/prompts`)

| File | Usage |
|------|-------|
| **prompts.md** | General prompts for development and design decisions |
| **prompts-dev.md** | Developer-specific prompts and technical guidelines |

---

## 🎯 Quick Navigation by Use Case

### **For Product Managers / Business Stakeholders:**
1. Start with: [README.md (root)](./README.md)
2. Review: [product-backlog.md](./doc/product-backlog.md) - See prioritized features
3. Review: [roadmap.md](./doc/roadmap.md) - See release timeline
4. Reference: [epics.md](./doc/epics.md) - See business value of each initiative

### **For Developers / Implementation:**
1. Start with: [README.md (doc)](./doc/README.md) - Architecture and database schema
2. Reference: [phase-1-user-stories.md](./doc/phase-1-user-stories.md) - MVP requirements
3. Refer to: [tickets.md](./doc/tickets.md) - Specific implementation work
4. Reference: [architecture-diagram.md](./doc/architecture-diagram.md) - System design

### **For QA / Testing:**
1. Start with: [product-backlog.md](./doc/product-backlog.md) - All 30 customer features
2. Reference: Phase files (1, 2, 3) - Acceptance criteria for each story
3. Use: [tickets.md](./doc/tickets.md) - Test cases and validation steps

### **For New Team Members:**
1. Start with: [README.md (root)](./README.md) - Overview and features
2. Read: [DOCUMENTATION_GUIDE.md](./DOCUMENTATION_GUIDE.md) - **This file**
3. Review: [REORGANIZATION_SUMMARY.md](./REORGANIZATION_SUMMARY.md) - Understand scope decisions
4. Study: [doc/README.md](./doc/README.md) - Deep dive on architecture and database

---

## 📊 Story Distribution

### Total: 30 Validated Customer Stories
- **130 Story Points** total complexity
- **8-11 Sprints** estimated implementation (5 points per day)

### By Phase:

#### **Phase 1: MVP (Minimum Viable Product)**
- **13 Stories | 61 Points | Sprints 1-4**
- **Epic Coverage:** Epic-01 (IAM), Epic-02 (Catalog), Epic-03 (Cart), Epic-04 (Checkout)
- **Focus:** Core revenue-generating shopping experience
- **File:** [phase-1-user-stories.md](./doc/phase-1-user-stories.md)

#### **Phase 2: V1 (Enhanced UX & Optimization)**
- **8 Stories | 35 Points | Sprints 5-6**
- **Epic Coverage:** Epic-05 (Discovery), Epic-06 (Account Management)
- **Focus:** Discoverability and customer retention
- **File:** [phase-2-user-stories.md](./doc/phase-2-user-stories.md)

#### **Phase 3: V2 (Growth & Engagement)**
- **9 Stories | 50 Points | Sprints 7-8**
- **Epic Coverage:** Epic-07 (Engagement), Epic-08 (Recommendations), Epic-10 (Convenience)
- **Focus:** Personalization, social proof, and repeat purchases
- **File:** [phase-3-user-stories.md](./doc/phase-3-user-stories.md)

---

## 🏛️ Epic Overview

| Epic | Phase | Stories | Points | Business Focus |
|------|-------|---------|--------|-----------------|
| **Epic-01: IAM** | MVP | 4 | 14 | Secure authentication and guest checkout |
| **Epic-02: Catalog** | MVP | 2 | 8 | Product browsing and details |
| **Epic-03: Cart** | MVP | 3 | 8 | Shopping cart and session management |
| **Epic-04: Checkout** | MVP | 4 | 11 | Order processing and confirmation |
| **Epic-05: Discovery** | V1 | 3 | 10 | Keyword search, price filters, sorting |
| **Epic-06: Account** | V1 | 4 | 12 | Profile, order history, order details |
| **Epic-07: Search (Advanced)** | V1 | 1 | 3 | Category filtering and advanced navigation |
| **Epic-08: Recommendations** | V2 | 2 | 13 | Related products and personalized suggestions |
| **Epic-09: Community** | V2 | 5 | 19 | Wishlists, reviews, ratings, and notifications |
| **Epic-10: Convenience** | V2 | 2 | 6 | Quick reorder and spending dashboards |

**Total: 10 Epic Initiatives | 30 Stories | 146 Points**

---

## 🔒 Important: Admin Applications are Separate

### Web Storefront (This Application)
✅ Customer account management  
✅ Product browsing and search  
✅ Shopping cart and checkout  
✅ Order tracking and history  
✅ Reviews and wishlists  
✅ Notifications and recommendations  

### NOT in This Application - Separate Admin Apps:
❌ Inventory management (stock CRUD)  
❌ Order fulfillment  
❌ Staff user management  
❌ Analytics dashboards  
❌ Admin reporting  

**These are built in:**
- **Desktop Admin App (Java)** → See `/desktop` directory
- **Admin Web App (Future)** → Separate repository

---

## 📖 How Stories Are Referenced

All 30 customer stories follow a consistent ID format:

```
[Phase].[Epic].[Story]

Example: 2.5.1 = Phase 2, Epic-05, Story 1 (Keyword Search)
```

### Story IDs by Phase:
- **Phase 1 (1.x.x):** 1.1.1 - 1.4.4 (13 stories in epics 01-04)
- **Phase 2 (2.x.x):** 2.5.1 - 2.7.1 (8 stories in epics 05-07)
- **Phase 3 (3.x.x):** 3.8.1 - 3.10.2 (9 stories in epics 08, 09, 10)

---

## 📋 Documentation Cross-References

### Every Story References:
- **Phase File** (e.g., phase-1-user-stories.md) - Full user story with acceptance criteria
- **Product Backlog** (product-backlog.md) - Strategic ranking and business rationale
- **Epic File** (epics.md) - Business value and technical scope

### Phase Files Reference:
- **Epics** - Each phase groups stories by epic
- **Product Backlog** - All 30 stories ranked by priority
- **Architecture** - Database tables and API endpoints

### All Files Mention:
**Admin Applications are Separate** - Consistent note across all documentation

---

## ✅ Validation Checklist

- ✅ All 30 customer stories exist in phase files
- ✅ All 30 stories listed in product backlog
- ✅ All 7 epics described in epics.md
- ✅ Story 1.1.4 clarified: Guest shopping with forced checkout login
- ✅ All phase files mention admin separation
- ✅ All .md files reference related documentation
- ✅ No orphaned story references in backlog
- ✅ Database schema (PostgreSQL) documented
- ✅ Architecture diagrams included
- ✅ Admin applications clearly separated into different codebases

---

## 🚀 Getting Started with This Documentation

### First Time Reading?
1. Read this DOCUMENTATION_GUIDE.md (you are here!)
2. Read [README.md](./README.md) for feature overview
3. Skim [REORGANIZATION_SUMMARY.md](./REORGANIZATION_SUMMARY.md) for context
4. Pick your role above and follow the recommended reading path

### Contributing to the Project?
1. Read [doc/README.md](./doc/README.md) - Architecture and database
2. Review relevant phase file based on your sprint
3. Check [epics.md](./doc/epics.md) for business context
4. Reference [tickets.md](./doc/tickets.md) for task breakdown

### Making Documentation Changes?
- **User stories:** Update phase-X-user-stories.md files
- **Priorities:** Update product-backlog.md
- **Epic scope:** Update epics.md
- **Summary:** Update REORGANIZATION_SUMMARY.md
- **This guide:** Update DOCUMENTATION_GUIDE.md
- **Always reference admin separation** in new documentation

---

## 📞 Questions?

Refer to the appropriate documentation:
- **"What features are in Phase 1?"** → [phase-1-user-stories.md](./doc/phase-1-user-stories.md)
- **"What's the business value of each epic?"** → [epics.md](./doc/epics.md)
- **"What's the system architecture?"** → [doc/README.md](./doc/README.md)
- **"What stories are there in total?"** → [product-backlog.md](./doc/product-backlog.md)
- **"What are the tech requirements?"** → [README.md](./README.md)
- **"Why did we reorganize the scope?"** → [REORGANIZATION_SUMMARY.md](./REORGANIZATION_SUMMARY.md)

---

**Last Updated:** March 9, 2026  
**Status:** All documentation validated and cross-referenced  
**Admin Applications:** Separate repositories (Desktop Java + Future Admin Web)
