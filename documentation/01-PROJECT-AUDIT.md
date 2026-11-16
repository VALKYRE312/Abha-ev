# ABHA ENTERPRISE - PROJECT AUDIT
## Phase 0: Existing Project Assessment

**Document Version:** 1.0  
**Date:** November 14, 2026  
**Status:** Initial Assessment

---

## 1. EXECUTIVE SUMMARY

This document provides a comprehensive audit of the ABHA Enterprise project workspace and analysis of the business requirements from the Platform Blueprint document.

### Current State
- **Workspace Status:** Empty/New Project
- **Existing Codebase:** None detected
- **Database:** Not yet configured
- **Infrastructure:** Not yet provisioned

### Business Context
ABHA Enterprise is an electric vehicle dealership requiring a unified digital platform for:
- Customer-facing EV ecommerce website
- EV financing enquiry and application management
- Comprehensive enterprise administration portal
- Inventory and warehouse management
- CRM and business operations

---

## 2. WORKSPACE AUDIT RESULTS

### 2.1 Repository Structure
**Current State:** Empty directory at `C:\Users\ADMIN\Downloads\abha`

**Finding:** This is a greenfield project with no existing code, configuration, or infrastructure.

### 2.2 Existing Components Analysis

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend Application | Not Present | No Next.js or React code detected |
| Backend API | Not Present | No Spring Boot or Java code detected |
| Database Schema | Not Present | No SQL migrations or schema files |
| Authentication | Not Present | Firebase not configured |
| File Storage | Not Present | Cloudinary not configured |
| Deployment Config | Not Present | No Vercel, Railway, or Neon configuration |
| Documentation | Not Present | No technical docs (creating now) |
| Tests | Not Present | No test suites |
| CI/CD | Not Present | No pipeline configuration |

### 2.3 Technology Stack Discrepancy Analysis

**CRITICAL FINDING: Blueprint vs Master Prompt Mismatch**

| Layer | Blueprint Recommendation | Master Prompt Requirement | Decision |
|-------|-------------------------|---------------------------|----------|
| Backend | Node.js + Express + TypeScript | **Java 24 + Spring Boot** | **Use Java 24** |
| Database | PostgreSQL (Neon) | PostgreSQL (Neon) | ✓ Aligned |
| Frontend | Next.js + TypeScript | Next.js + TypeScript | ✓ Aligned |
| Auth | Firebase or OIDC | Firebase (with Admin SDK) | Use Firebase |
| File Storage | Cloudinary + Private storage | Cloudinary + Private storage | ✓ Aligned |

**Resolution:** The master prompt explicitly requires Java 24 + Spring Boot for the backend. This takes precedence over the blueprint's Node.js recommendation. All architecture decisions will use Java/Spring Boot.

---

## 3. REQUIREMENTS ANALYSIS FROM BLUEPRINT

### 3.1 Business Model
<cite index="1-3">The platform assumes a dealership/retailer model, not an open multi-vendor marketplace.</cite>

<cite index="1-4">Loan applications are treated as referrals or assisted applications to authorised banks/NBFCs unless Abha Enterprise confirms it has the required lending authorisation.</cite>

### 3.2 Core Business Journeys

#### EV Purchase Journey
<cite index="1-13">Browse catalogue → view vehicle → enquire / reserve / order → staff confirms availability → payment / delivery coordination → invoice and fulfilment.</cite>

#### Finance Enquiry Journey
<cite index="1-14">Select vehicle → use EMI estimate → submit contact and consent → staff reviews → refer / coordinate with lender → update customer on status.</cite>

#### Inventory Update Journey
<cite index="1-15">Authorised staff receives stock → records quantity / serial or VIN → stock is reserved for confirmed order → dispatch / delivery → audit history.</cite>

#### Customer Support Journey
<cite index="1-16">Customer submits enquiry → CRM task is assigned → call / WhatsApp / email follow-up → outcome and next action are recorded.</cite>

### 3.3 Scope Boundaries

<cite index="1-17,1-18">Phase 1 should not attempt automated loan underwriting, credit scoring, e-KYC, lender API integrations or payment settlement unless partner contracts, compliance requirements and technical access are confirmed. Start with a secure enquiry and document-status workflow; add integrations only after lender approval.</cite>

---

## 4. ROLES AND ACCESS CONTROL

### 4.1 Defined Roles

<cite index="1-39,1-40,1-41,1-42,1-43,1-44">
| Role | Typical Access |
|------|----------------|
| Owner / Super Admin | All modules, user and role management, settings, reports and audit logs |
| Business Manager | Products, inventory, orders, bookings, customers, enquiries and operational reports |
| Sales Executive | Assigned customers, enquiries, call logs, bookings and order updates within allowed stages |
| Inventory Staff | Product stock, stock movements, serial/VIN records and fulfilment; no loan-document access by default |
| Finance / Loan Officer | Finance enquiries, restricted documents, lender status and payment records as authorised |
| Customer | Own profile, own orders/bookings, own finance enquiries and own uploaded documents |
</cite>

### 4.2 Required Modules

<cite index="1-45,1-46,1-47,1-48,1-49,1-50,1-51,1-52,1-53">
1. **Dashboard** - Revenue summary, orders by status, booking pipeline, open enquiries, low-stock alerts, recent activity
2. **Catalogue** - Categories, brands, products, variants, media, specifications, pricing, visibility and featured status
3. **Inventory** - Stock by location, stock adjustments, receipts, reservations, serial/VIN capture, reorder threshold
4. **Orders & Bookings** - Cart / enquiry conversion, order lines, booking deposits if used, payment status, fulfilment and cancellation
5. **Customers & CRM** - Customer profile, consent, contact history, lead source, assigned employee, tasks and follow-up reminders
6. **Finance Enquiries** - Application intake, consent, document checklist, assignment, lender referral, status history and customer updates
7. **Finance & Invoices** - Payment records, refunds, invoice numbering, tax configuration and exports; accounting review required
8. **Reports** - Sales, stock valuation, product performance, lead conversion, loan enquiry pipeline and staff activity
9. **Settings** - Business profile, branches, tax settings, shipping/delivery settings, notification templates and access control
</cite>

---

## 5. DATABASE MODEL REQUIREMENTS

### 5.1 Core Entities (35+ Tables)

<cite index="1-55,1-56">Use UUID primary keys, created_at and updated_at timestamps on core entities. Add deleted_at only where soft deletion is appropriate; financial and audit records should generally be retained according to a documented retention policy.</cite>

#### Identity and Access (7 tables)
1. users
2. roles
3. permissions
4. user_roles
5. role_permissions
6. customers
7. employees

#### Catalogue and Inventory (9 tables)
8. brands
9. product_categories
10. products
11. product_variants
12. product_specs
13. product_media
14. locations
15. inventory
16. inventory_transactions

#### Commerce (9 tables)
17. carts
18. cart_items
19. orders
20. order_items
21. bookings
22. payments
23. invoices
24. delivery_records
25. (additional address tables as needed)

#### Finance Workflow (6 tables)
26. finance_partners
27. finance_products
28. loan_applications
29. loan_documents
30. loan_status_history
31. loan_followups

#### CRM and Operations (4+ tables)
32. enquiries
33. call_logs
34. tasks
35. audit_logs
36. notifications

### 5.2 Key Relationships

<cite index="1-96,1-97,1-98,1-99,1-100,1-101,1-102">
- A customer can have many orders, bookings, enquiries and finance applications
- A product belongs to a category and optionally a brand; a product can have variants, specifications and media
- Inventory is tracked per variant and location; transactions explain every stock change
- An order has many order items and may have one or more payment records and an invoice
- A finance application belongs to a customer and may be referred to a partner; documents and status history belong to that application
- Users receive roles; roles receive permissions. Admin API access must be checked against permissions, not merely whether a user is logged in
</cite>

---

## 6. SECURITY AND COMPLIANCE REQUIREMENTS

### 6.1 Authentication
<cite index="1-159">Use a proven identity provider; verify tokens on the API; enforce MFA for privileged accounts where possible.</cite>

### 6.2 Authorization
<cite index="1-160">RBAC + permission checks at API level; deny by default; separate finance-document permissions.</cite>

### 6.3 Sensitive Documents
<cite index="1-161">Private storage, encryption in transit/at rest, short-lived signed access, malware scanning, access logs and deletion/retention policy.</cite>

### 6.4 Personal Data
<cite index="1-162">Collect minimum necessary data; provide privacy notice and consent; define purpose, retention and access/correction process.</cite>

### 6.5 Payments
<cite index="1-163">Use a PCI-compliant payment gateway; never store card details or UPI PINs; verify signed webhooks.</cite>

### 6.6 Financial Claims
<cite index="1-164">Show lender, rate assumptions, fees, eligibility caveats and disclaimers; never guarantee approval or advertise unapproved schemes.</cite>

### 6.7 Compliance Note
<cite index="1-168,1-169,1-170">This is a software planning document, not legal, lending, tax or regulatory advice. Before launch, Abha Enterprise should confirm the exact lending arrangement with its bank/NBFC partners and obtain professional advice on applicable Indian data-protection, consumer, advertising, tax, GST, vehicle-sale and payment requirements. Do not collect Aadhaar, PAN, bank statements or other sensitive documents in a general contact form.</cite>

---

## 7. IMPLEMENTATION RULES

### 7.1 Critical Rules from Blueprint

<cite index="1-32,1-33,1-34,1-35,1-36,1-37">
- Use database transactions for checkout, stock reservation, payment state changes and order cancellation
- Never trust prices, discounts, role names or loan statuses submitted by the browser; validate them server-side
- Store timestamps in UTC and display local time in the UI
- Keep secrets in environment variables, never in frontend code or Git
- Separate development, staging and production databases
- Add backups, structured logs, rate limits, input validation and audit logs before launch
</cite>

### 7.2 Workflow State Management

<cite index="1-156,1-157">Never let a generic status update bypass workflow rules. For example, an order should not be marked delivered without required fulfilment data, and a finance application should not be marked approved by a sales user unless that role is explicitly authorised and the approval source is recorded.</cite>

---

## 8. UI/UX REQUIREMENTS

### 8.1 Website Prototype Pages
<cite index="1-124,1-125">These are layout prototypes to communicate page structure and user journeys. They are not production screenshots and do not represent a finished interactive website.</cite>

Customer Website:
- Homepage with hero, featured vehicles, categories
- EV catalogue with search and filters
- Product detail pages
- Finance/EMI calculator
- Cart and checkout
- Customer account dashboard

Admin Portal:
- Business overview dashboard
- Product management
- Inventory management
- Order management
- Loan application queue
- CRM and customer management

### 8.2 Design Principles
<cite index="1-129,1-130">Clear value proposition; primary action to browse vehicles; secondary route to finance; visible categories; featured vehicles; trust signals; contact and dealership details. Header should work on mobile with a compact menu.</cite>

---

## 9. DECISIONS REQUIRED BEFORE IMPLEMENTATION

<cite index="1-197,1-198,1-199,1-200,1-201,1-202,1-203,1-204,1-205,1-206,1-207,1-208,1-209,1-210,1-211,1-212,1-213,1-214">

| Decision | Options / Information Needed | Why It Matters |
|----------|------------------------------|----------------|
| Business model | Retail dealership, own inventory, order-on-demand, or marketplace? | Determines product, seller, inventory and order model |
| Vehicle catalogue | Brands, models, variants, supplier price sheets, verified specs, photos and warranty documents | Prevents invented or inaccurate listings |
| Purchase flow | Full online checkout, booking deposit, or enquiry-first assisted sale? | Determines cart, payment and order lifecycle |
| Finance model | Partner referrals, authorised in-house lending, or both? Name the partners and permitted process | Determines disclosures, documents, roles and integrations |
| Branches / stock | One showroom or multiple locations? | Determines inventory location and fulfilment |
| Payments | Cash/UPI at showroom, payment gateway, booking deposits or instalments? | Determines payment provider and reconciliation |
| Existing software | Confirm the current Abha Enterprise inventory/invoice codebase, database and features to reuse | Avoids duplicate systems and migration mistakes |
| Brand assets | Logo, colours, business address, phone, email, social links and approved copy | Needed for production design and contact details |

</cite>

---

## 10. RECOMMENDATIONS

### 10.1 Immediate Actions Required

1. **Business Decision Meeting** - Schedule stakeholder meeting to resolve all decisions in Section 9
2. **Brand Assets Collection** - Gather logo, colors, business information
3. **Vehicle Data Preparation** - Obtain real product specifications from suppliers
4. **Finance Partner Agreements** - Confirm lending model and partner relationships
5. **Infrastructure Setup** - Provision Neon PostgreSQL, Firebase project, Cloudinary account

### 10.2 Technical Approach

Given this is a greenfield project:
- Use **Java 24 + Spring Boot** for backend (as per master prompt requirement)
- Use **Next.js 14+** with App Router for frontend
- Use **PostgreSQL on Neon** with Flyway migrations
- Use **Firebase Authentication** with Admin SDK for token verification
- Implement **modular monolithic architecture** (not microservices)
- Follow **phase-by-phase development** approach

### 10.3 Risk Mitigation

**High Risk:**
- Regulatory compliance for lending operations
- Data privacy requirements for sensitive documents
- Accurate product specifications from suppliers

**Medium Risk:**
- Java 24 compatibility with Spring Boot ecosystem
- Payment gateway integration complexity
- Multi-location inventory management

**Low Risk:**
- Frontend technology stack (well-established)
- Firebase authentication integration
- Basic CRUD operations

---

## 11. NEXT STEPS

1. ✅ Complete project audit (this document)
2. ⏭️ Design complete PostgreSQL database schema with ER diagram
3. ⏭️ Define JPA entity specifications and relationship mappings
4. ⏭️ Create REST API specification and endpoint documentation
5. ⏭️ Design RBAC permission matrix and security model
6. ⏭️ Create system architecture diagrams
7. ⏭️ Define user journeys and workflows
8. ⏭️ Create UI page structure and component hierarchy
9. ⏭️ Develop phase-by-phase implementation roadmap
10. ⏭️ Document risks, business decisions, and compliance requirements

---

**Status:** Phase 0 - Task 1 Complete  
**Next Deliverable:** Database Schema and ER Diagram
