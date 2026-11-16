# ABHA ENTERPRISE - DATABASE SCHEMA SPECIFICATION
## PostgreSQL Schema Design with Entity Relationships

**Document Version:** 1.0  
**Date:** November 14, 2026  
**Database:** PostgreSQL 15+ (Neon managed)  
**ORM:** Hibernate/JPA with Spring Data JPA

---

## TABLE OF CONTENTS
1. [Schema Overview](#1-schema-overview)
2. [Identity and Access Control](#2-identity-and-access-control)
3. [Catalogue and Inventory](#3-catalogue-and-inventory)
4. [Commerce and Orders](#4-commerce-and-orders)
5. [Finance Workflow](#5-finance-workflow)
6. [CRM and Operations](#6-crm-and-operations)
7. [Entity Relationship Diagram](#7-entity-relationship-diagram)
8. [Indexes and Constraints](#8-indexes-and-constraints)
9. [Migration Strategy](#9-migration-strategy)

---

## 1. SCHEMA OVERVIEW

### 1.1 Design Principles

- **Primary Keys:** UUID for all entities (better distribution, security, multi-region support)
- **Timestamps:** All tables include `created_at` and `updated_at` (UTC)
- **Soft Deletion:** Only where business requires; financial/audit records use retention policies
- **Normalization:** 3NF for operational data; denormalization for historical snapshots
- **Constraints:** Database-level enforcement for data integrity
- **Audit Trail:** Immutable logs for sensitive operations

### 1.2 Naming Conventions

- **Tables:** snake_case, plural nouns (e.g., `product_variants`)
- **Columns:** snake_case (e.g., `product_name`)
- **Foreign Keys:** `{referenced_table_singular}_id` (e.g., `product_id`)
- **Indexes:** `idx_{table}_{columns}` (e.g., `idx_products_sku`)
- **Unique Constraints:** `uq_{table}_{columns}` (e.g., `uq_users_email`)

### 1.3 Schema Statistics

| Category | Table Count | Key Relationships |
|----------|-------------|-------------------|
| Identity & Access | 7 | Many-to-many role permissions |
| Catalogue & Inventory | 9 | Hierarchical categories, location-based stock |
| Commerce | 10 | Order snapshots, payment tracking |
| Finance | 6 | Application workflow with history |
| CRM & Operations | 5 | Task management, audit trail |
| **TOTAL** | **37** | **50+ foreign keys** |

---

## 2. IDENTITY AND ACCESS CONTROL

### 2.1 users
**Purpose:** Central user identity mapping (both customers and staff)

```sql
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_uid            VARCHAR(255) NOT NULL UNIQUE,  -- Firebase UID
    email               VARCHAR(255),
    phone               VARCHAR(20),
    full_name           VARCHAR(255) NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    email_verified      BOOLEAN NOT NULL DEFAULT false,
    phone_verified      BOOLEAN NOT NULL DEFAULT false,
    last_login_at       TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX uq_users_email ON users(LOWER(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX uq_users_phone ON users(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_users_auth_uid ON users(auth_uid);
CREATE INDEX idx_users_is_active ON users(is_active);
```

**Key Fields:**
- `auth_uid`: Maps to Firebase Authentication UID (unique identifier)
- `email` / `phone`: Optional but at least one should be present
- `is_active`: Soft disable without deletion

---

### 2.2 roles
**Purpose:** Define system roles (RBAC)

```sql
CREATE TABLE roles (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(100) NOT NULL UNIQUE,
    code                VARCHAR(50) NOT NULL UNIQUE,  -- e.g., 'SUPER_ADMIN', 'CUSTOMER'
    description         TEXT,
    is_system           BOOLEAN NOT NULL DEFAULT false,  -- Prevent deletion of core roles
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Initial roles
INSERT INTO roles (name, code, is_system) VALUES
    ('Super Admin', 'SUPER_ADMIN', true),
    ('Business Manager', 'BUSINESS_MANAGER', true),
    ('Sales Executive', 'SALES_EXECUTIVE', true),
    ('Inventory Manager', 'INVENTORY_MANAGER', true),
    ('Finance Officer', 'FINANCE_OFFICER', true),
    ('Customer', 'CUSTOMER', true);
```

---

### 2.3 permissions
**Purpose:** Fine-grained permission catalogue

```sql
CREATE TABLE permissions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code                VARCHAR(100) NOT NULL UNIQUE,  -- e.g., 'products.edit'
    module              VARCHAR(50) NOT NULL,          -- e.g., 'products', 'orders'
    action              VARCHAR(50) NOT NULL,          -- e.g., 'read', 'write', 'delete'
    description         TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_permissions_module ON permissions(module);

-- Sample permissions (to be expanded)
INSERT INTO permissions (code, module, action, description) VALUES
    ('products.read', 'products', 'read', 'View product catalogue'),
    ('products.write', 'products', 'write', 'Create and edit products'),
    ('products.delete', 'products', 'delete', 'Archive products'),
    ('orders.read', 'orders', 'read', 'View orders'),
    ('orders.write', 'orders', 'write', 'Update order status'),
    ('loans.documents.read', 'loans', 'read', 'Access finance application documents'),
    ('loans.documents.write', 'loans', 'write', 'Upload and manage loan documents'),
    ('inventory.read', 'inventory', 'read', 'View inventory'),
    ('inventory.write', 'inventory', 'write', 'Manage stock levels'),
    ('customers.read', 'customers', 'read', 'View customer information'),
    ('customers.write', 'customers', 'write', 'Update customer records'),
    ('reports.read', 'reports', 'read', 'Access business reports'),
    ('settings.write', 'settings', 'write', 'Modify system settings'),
    ('users.manage', 'users', 'manage', 'Manage users and roles');
```

---

### 2.4 user_roles
**Purpose:** Many-to-many relationship between users and roles

```sql
CREATE TABLE user_roles (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id             UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMP WITH TIME ZONE,  -- Optional role expiration
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```

---

### 2.5 role_permissions
**Purpose:** Many-to-many relationship between roles and permissions

```sql
CREATE TABLE role_permissions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id             UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id       UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
```

---

### 2.6 customers
**Purpose:** Customer-specific profile information

```sql
CREATE TABLE customers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    customer_number     VARCHAR(50) UNIQUE,  -- Auto-generated customer ID
    name                VARCHAR(255) NOT NULL,
    email               VARCHAR(255),
    phone               VARCHAR(20),
    alternate_phone     VARCHAR(20),
    address_line1       VARCHAR(255),
    address_line2       VARCHAR(255),
    city                VARCHAR(100),
    state               VARCHAR(100),
    pincode             VARCHAR(10),
    country             VARCHAR(50) DEFAULT 'India',
    consent_marketing   BOOLEAN DEFAULT false,
    consent_at          TIMESTAMP WITH TIME ZONE,
    lead_source         VARCHAR(50),  -- e.g., 'website', 'walk-in', 'referral'
    assigned_to         UUID REFERENCES users(id) ON DELETE SET NULL,  -- Sales rep
    notes               TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_email ON customers(LOWER(email));
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX idx_customers_customer_number ON customers(customer_number);
```

**Key Fields:**
- `user_id`: Optional - customer may exist as lead before account creation
- `customer_number`: Business-friendly identifier (e.g., CUST-2026-00001)
- `consent_at`: Records GDPR/privacy consent timestamp

---

### 2.7 employees
**Purpose:** Staff-specific information

```sql
CREATE TABLE employees (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_code       VARCHAR(50) NOT NULL UNIQUE,
    department          VARCHAR(100),
    designation         VARCHAR(100),
    reporting_to        UUID REFERENCES employees(id) ON DELETE SET NULL,
    date_of_joining     DATE,
    date_of_exit        DATE,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_employee_code ON employees(employee_code);
CREATE INDEX idx_employees_is_active ON employees(is_active);
```

---

## 3. CATALOGUE AND INVENTORY

### 3.1 brands
**Purpose:** Vehicle manufacturers and brands

```sql
CREATE TABLE brands (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(100) NOT NULL,
    slug                VARCHAR(100) NOT NULL UNIQUE,
    logo_url            VARCHAR(500),
    description         TEXT,
    website             VARCHAR(255),
    is_active           BOOLEAN NOT NULL DEFAULT true,
    display_order       INTEGER DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_is_active ON brands(is_active);
```

---

### 3.2 product_categories
**Purpose:** Hierarchical product categorization

```sql
CREATE TABLE product_categories (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id           UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    name                VARCHAR(100) NOT NULL,
    slug                VARCHAR(100) NOT NULL UNIQUE,
    description         TEXT,
    image_url           VARCHAR(500),
    icon                VARCHAR(50),  -- Icon identifier for UI
    is_active           BOOLEAN NOT NULL DEFAULT true,
    display_order       INTEGER DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_parent_id ON product_categories(parent_id);
CREATE INDEX idx_categories_slug ON product_categories(slug);
CREATE INDEX idx_categories_is_active ON product_categories(is_active);

-- Sample categories
INSERT INTO product_categories (name, slug, description) VALUES
    ('Electric Scooters', 'electric-scooters', 'Two-wheeler electric scooters'),
    ('Electric Motorcycles', 'electric-motorcycles', 'Electric bikes and motorcycles'),
    ('Electric Three-Wheelers', 'electric-three-wheelers', 'Commercial and passenger EVs'),
    ('Batteries', 'batteries', 'EV batteries and power packs'),
    ('Chargers', 'chargers', 'EV charging equipment'),
    ('Accessories', 'accessories', 'EV accessories and upgrades'),
    ('Spare Parts', 'spare-parts', 'Genuine EV spare parts');
```

---

### 3.3 products
**Purpose:** Core product catalogue

```sql
CREATE TABLE products (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id            UUID REFERENCES brands(id) ON DELETE SET NULL,
    category_id         UUID NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
    sku                 VARCHAR(100) NOT NULL UNIQUE,
    slug                VARCHAR(200) NOT NULL UNIQUE,
    name                VARCHAR(255) NOT NULL,
    short_description   TEXT,
    description         TEXT,
    product_type        VARCHAR(50) NOT NULL,  -- 'vehicle', 'accessory', 'spare_part'
    status              VARCHAR(50) NOT NULL DEFAULT 'draft',  -- 'draft', 'active', 'archived'
    is_featured         BOOLEAN DEFAULT false,
    meta_title          VARCHAR(255),
    meta_description    TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (status IN ('draft', 'active', 'archived'))
);

CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_product_type ON products(product_type);
```

---

### 3.4 product_variants
**Purpose:** Product variations (color, battery, etc.)

```sql
CREATE TABLE product_variants (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id          UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_name        VARCHAR(100),  -- e.g., "Red - 2.5kWh Battery"
    sku                 VARCHAR(100) NOT NULL UNIQUE,
    colour              VARCHAR(50),
    battery_option      VARCHAR(100),
    price               NUMERIC(12, 2) NOT NULL,  -- Base price
    compare_at_price    NUMERIC(12, 2),  -- Original price for discount display
    cost_price          NUMERIC(12, 2),  -- Internal cost
    weight_kg           NUMERIC(8, 2),
    is_active           BOOLEAN NOT NULL DEFAULT true,
    display_order       INTEGER DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (price >= 0),
    CHECK (compare_at_price IS NULL OR compare_at_price >= price)
);

CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_is_active ON product_variants(is_active);
```

---

### 3.5 product_specs
**Purpose:** Flexible product specifications (key-value pairs)

```sql
CREATE TABLE product_specs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id          UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    spec_key            VARCHAR(100) NOT NULL,  -- e.g., 'claimed_range', 'motor_power'
    spec_value          TEXT NOT NULL,
    unit                VARCHAR(50),  -- e.g., 'km', 'kW', 'kg'
    spec_group          VARCHAR(50),  -- e.g., 'performance', 'battery', 'dimensions'
    display_order       INTEGER DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_specs_product_id ON product_specs(product_id);
CREATE INDEX idx_specs_spec_key ON product_specs(spec_key);
CREATE INDEX idx_specs_spec_group ON product_specs(spec_group);

-- Common spec keys for EVs:
-- claimed_range, top_speed, motor_power, battery_capacity, charging_time,
-- battery_type, brakes_front, brakes_rear, suspension, weight, dimensions, warranty
```

---

### 3.6 product_media
**Purpose:** Product images and videos

```sql
CREATE TABLE product_media (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id          UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    media_type          VARCHAR(20) NOT NULL,  -- 'image', 'video'
    url                 VARCHAR(500) NOT NULL,
    thumbnail_url       VARCHAR(500),
    alt_text            VARCHAR(255),
    title               VARCHAR(255),
    is_primary          BOOLEAN DEFAULT false,
    display_order       INTEGER DEFAULT 0,
    file_size_bytes     BIGINT,
    mime_type           VARCHAR(100),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (media_type IN ('image', 'video'))
);

CREATE INDEX idx_media_product_id ON product_media(product_id);
CREATE INDEX idx_media_is_primary ON product_media(is_primary) WHERE is_primary = true;
```

---

### 3.7 locations
**Purpose:** Warehouses, showrooms, service centers

```sql
CREATE TABLE locations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(100) NOT NULL,
    code                VARCHAR(50) NOT NULL UNIQUE,
    location_type       VARCHAR(50) NOT NULL,  -- 'warehouse', 'showroom', 'service_center'
    address_line1       VARCHAR(255),
    address_line2       VARCHAR(255),
    city                VARCHAR(100),
    state               VARCHAR(100),
    pincode             VARCHAR(10),
    phone               VARCHAR(20),
    email               VARCHAR(255),
    manager_id          UUID REFERENCES employees(id) ON DELETE SET NULL,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (location_type IN ('warehouse', 'showroom', 'service_center', 'other'))
);

CREATE INDEX idx_locations_code ON locations(code);
CREATE INDEX idx_locations_is_active ON locations(is_active);
CREATE INDEX idx_locations_location_type ON locations(location_type);
```

---

### 3.8 inventory
**Purpose:** Stock tracking per variant per location

```sql
CREATE TABLE inventory (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_variant_id  UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    location_id         UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    quantity_on_hand    INTEGER NOT NULL DEFAULT 0,
    quantity_reserved   INTEGER NOT NULL DEFAULT 0,
    quantity_available  INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
    reorder_level       INTEGER DEFAULT 0,
    reorder_quantity    INTEGER DEFAULT 0,
    last_stock_check    TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(product_variant_id, location_id),
    CHECK (quantity_on_hand >= 0),
    CHECK (quantity_reserved >= 0),
    CHECK (quantity_reserved <= quantity_on_hand)
);

CREATE INDEX idx_inventory_variant_id ON inventory(product_variant_id);
CREATE INDEX idx_inventory_location_id ON inventory(location_id);
CREATE INDEX idx_inventory_low_stock ON inventory(quantity_available) 
    WHERE quantity_available <= reorder_level AND reorder_level > 0;
```

**Key Fields:**
- `quantity_available`: Computed column = on_hand - reserved
- Database constraints prevent negative stock or over-reservation

---

### 3.9 inventory_transactions
**Purpose:** Immutable stock movement history

```sql
CREATE TABLE inventory_transactions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id        UUID NOT NULL REFERENCES inventory(id) ON DELETE RESTRICT,
    transaction_type    VARCHAR(50) NOT NULL,
    quantity_delta      INTEGER NOT NULL,
    reference_type      VARCHAR(50),  -- 'purchase_order', 'order', 'adjustment', 'transfer'
    reference_id        UUID,
    serial_number       VARCHAR(100),  -- VIN or serial for individual items
    note                TEXT,
    created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (transaction_type IN ('receive', 'reserve', 'release', 'dispatch', 'adjustment', 'transfer_in', 'transfer_out', 'return'))
);

CREATE INDEX idx_inv_txn_inventory_id ON inventory_transactions(inventory_id);
CREATE INDEX idx_inv_txn_reference ON inventory_transactions(reference_type, reference_id);
CREATE INDEX idx_inv_txn_created_at ON inventory_transactions(created_at DESC);
CREATE INDEX idx_inv_txn_serial_number ON inventory_transactions(serial_number) WHERE serial_number IS NOT NULL;
```

**Transaction Types:**
- `receive`: Stock arrival
- `reserve`: Stock allocated to order
- `release`: Reservation cancelled
- `dispatch`: Stock shipped
- `adjustment`: Manual correction
- `transfer_in/out`: Inter-location movement
- `return`: Customer return

---

## 4. COMMERCE AND ORDERS

### 4.1 carts
**Purpose:** Shopping cart management

```sql
CREATE TABLE carts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id         UUID REFERENCES customers(id) ON DELETE CASCADE,
    session_key         VARCHAR(255),  -- For guest carts
    status              VARCHAR(50) NOT NULL DEFAULT 'active',
    expires_at          TIMESTAMP WITH TIME ZONE,
    converted_to_order_id UUID,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (status IN ('active', 'abandoned', 'converted')),
    CHECK (customer_id IS NOT NULL OR session_key IS NOT NULL)
);

CREATE INDEX idx_carts_customer_id ON carts(customer_id);
CREATE INDEX idx_carts_session_key ON carts(session_key) WHERE session_key IS NOT NULL;
CREATE INDEX idx_carts_status ON carts(status);
CREATE INDEX idx_carts_expires_at ON carts(expires_at) WHERE status = 'active';
```

---

### 4.2 cart_items
**Purpose:** Items in cart

```sql
CREATE TABLE cart_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id             UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_variant_id  UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity            INTEGER NOT NULL DEFAULT 1,
    quoted_unit_price   NUMERIC(12, 2) NOT NULL,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(cart_id, product_variant_id),
    CHECK (quantity > 0),
    CHECK (quoted_unit_price >= 0)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_variant_id ON cart_items(product_variant_id);
```

---

### 4.3 addresses
**Purpose:** Customer delivery addresses

```sql
CREATE TABLE addresses (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id         UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    address_type        VARCHAR(50) NOT NULL,  -- 'billing', 'delivery', 'both'
    full_name           VARCHAR(255) NOT NULL,
    phone               VARCHAR(20) NOT NULL,
    address_line1       VARCHAR(255) NOT NULL,
    address_line2       VARCHAR(255),
    landmark            VARCHAR(255),
    city                VARCHAR(100) NOT NULL,
    state               VARCHAR(100) NOT NULL,
    pincode             VARCHAR(10) NOT NULL,
    country             VARCHAR(50) DEFAULT 'India',
    is_default          BOOLEAN DEFAULT false,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (address_type IN ('billing', 'delivery', 'both'))
);

CREATE INDEX idx_addresses_customer_id ON addresses(customer_id);
CREATE INDEX idx_addresses_is_default ON addresses(is_default) WHERE is_default = true;
```

---

### 4.4 orders
**Purpose:** Customer orders (header)

```sql
CREATE TABLE orders (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number        VARCHAR(50) NOT NULL UNIQUE,
    customer_id         UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    billing_address_id  UUID REFERENCES addresses(id) ON DELETE SET NULL,
    delivery_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    order_type          VARCHAR(50) NOT NULL DEFAULT 'purchase',  -- 'purchase', 'booking'
    status              VARCHAR(50) NOT NULL DEFAULT 'pending_confirmation',
    payment_status      VARCHAR(50) NOT NULL DEFAULT 'pending',
    fulfilment_status   VARCHAR(50) NOT NULL DEFAULT 'pending',
    subtotal            NUMERIC(12, 2) NOT NULL,
    discount_amount     NUMERIC(12, 2) DEFAULT 0,
    tax_amount          NUMERIC(12, 2) NOT NULL DEFAULT 0,
    delivery_charge     NUMERIC(12, 2) DEFAULT 0,
    grand_total         NUMERIC(12, 2) NOT NULL,
    currency            VARCHAR(3) DEFAULT 'INR',
    customer_note       TEXT,
    internal_note       TEXT,
    cancelled_at        TIMESTAMP WITH TIME ZONE,
    cancelled_by        UUID REFERENCES users(id) ON DELETE SET NULL,
    cancellation_reason TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (status IN ('pending_confirmation', 'confirmed', 'processing', 'ready_for_delivery', 'delivered', 'cancelled', 'refunded')),
    CHECK (payment_status IN ('pending', 'partially_paid', 'paid', 'refunded', 'failed')),
    CHECK (fulfilment_status IN ('pending', 'processing', 'ready', 'dispatched', 'delivered', 'cancelled')),
    CHECK (subtotal >= 0),
    CHECK (grand_total >= 0)
);

CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

---

### 4.5 order_items
**Purpose:** Line items with product snapshots

```sql
CREATE TABLE order_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_variant_id  UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name        VARCHAR(255) NOT NULL,  -- Snapshot
    sku                 VARCHAR(100) NOT NULL,  -- Snapshot
    variant_name        VARCHAR(100),           -- Snapshot
    quantity            INTEGER NOT NULL,
    unit_price          NUMERIC(12, 2) NOT NULL,
    tax_rate            NUMERIC(5, 2) DEFAULT 0,
    tax_amount          NUMERIC(12, 2) DEFAULT 0,
    discount_amount     NUMERIC(12, 2) DEFAULT 0,
    line_total          NUMERIC(12, 2) NOT NULL,
    serial_number       VARCHAR(100),  -- VIN or serial if applicable
    warranty_start_date DATE,
    warranty_end_date   DATE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (quantity > 0),
    CHECK (unit_price >= 0),
    CHECK (line_total >= 0)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_variant_id ON order_items(product_variant_id);
```

**Important:** Product details are snapshotted at order time to preserve historical accuracy.

---

### 4.6 bookings
**Purpose:** Vehicle reservations before full order

```sql
CREATE TABLE bookings (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number      VARCHAR(50) NOT NULL UNIQUE,
    customer_id         UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    product_variant_id  UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    status              VARCHAR(50) NOT NULL DEFAULT 'requested',
    booking_amount      NUMERIC(12, 2) DEFAULT 0,
    payment_status      VARCHAR(50) NOT NULL DEFAULT 'pending',
    preferred_delivery_date DATE,
    expires_at          TIMESTAMP WITH TIME ZONE,
    converted_to_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    notes               TEXT,
    customer_note       TEXT,
    cancelled_at        TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (status IN ('requested', 'confirmed', 'expired', 'cancelled', 'converted_to_order')),
    CHECK (payment_status IN ('pending', 'paid', 'refunded'))
);

CREATE INDEX idx_bookings_booking_number ON bookings(booking_number);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_expires_at ON bookings(expires_at) WHERE status = 'confirmed';
```

---

### 4.7 payments
**Purpose:** Payment transaction records

```sql
CREATE TABLE payments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID REFERENCES orders(id) ON DELETE SET NULL,
    booking_id          UUID REFERENCES bookings(id) ON DELETE SET NULL,
    customer_id         UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    payment_method      VARCHAR(50) NOT NULL,  -- 'card', 'upi', 'net_banking', 'cash', 'bank_transfer'
    provider            VARCHAR(50),  -- 'razorpay', 'stripe', 'manual'
    provider_payment_id VARCHAR(255),
    provider_order_id   VARCHAR(255),
    amount              NUMERIC(12, 2) NOT NULL,
    currency            VARCHAR(3) DEFAULT 'INR',
    status              VARCHAR(50) NOT NULL DEFAULT 'initiated',
    paid_at             TIMESTAMP WITH TIME ZONE,
    failure_reason      TEXT,
    provider_response   JSONB,  -- Store webhook data
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (status IN ('initiated', 'pending', 'processing', 'paid', 'failed', 'refunded', 'cancelled')),
    CHECK (amount > 0),
    CHECK (order_id IS NOT NULL OR booking_id IS NOT NULL)
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_provider_payment_id ON payments(provider_payment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
```

---

### 4.8 invoices
**Purpose:** Tax invoices for completed orders

```sql
CREATE TABLE invoices (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number      VARCHAR(50) NOT NULL UNIQUE,
    order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    customer_id         UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    invoice_date        DATE NOT NULL,
    due_date            DATE,
    subtotal            NUMERIC(12, 2) NOT NULL,
    tax_amount          NUMERIC(12, 2) NOT NULL,
    discount_amount     NUMERIC(12, 2) DEFAULT 0,
    grand_total         NUMERIC(12, 2) NOT NULL,
    currency            VARCHAR(3) DEFAULT 'INR',
    tax_details         JSONB,  -- GST breakdown: CGST, SGST, IGST
    payment_terms       TEXT,
    file_url            VARCHAR(500),  -- PDF invoice
    status              VARCHAR(50) NOT NULL DEFAULT 'draft',
    issued_by           UUID REFERENCES users(id) ON DELETE SET NULL,
    notes               TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (status IN ('draft', 'issued', 'paid', 'cancelled')),
    CHECK (grand_total >= 0)
);

CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_order_id ON invoices(order_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_invoice_date ON invoices(invoice_date DESC);
CREATE INDEX idx_invoices_status ON invoices(status);
```

---

### 4.9 delivery_records
**Purpose:** Order fulfilment tracking

```sql
CREATE TABLE delivery_records (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    delivery_type       VARCHAR(50) NOT NULL,  -- 'showroom_pickup', 'home_delivery', 'courier'
    tracking_number     VARCHAR(100),
    carrier             VARCHAR(100),
    delivery_address    TEXT,  -- Snapshot of delivery address
    scheduled_date      DATE,
    delivered_at        TIMESTAMP WITH TIME ZONE,
    delivered_by        UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_name      VARCHAR(255),
    recipient_signature VARCHAR(500),  -- URL to signature image
    delivery_notes      TEXT,
    proof_of_delivery   VARCHAR(500),  -- URL to delivery photo
    status              VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (status IN ('pending', 'scheduled', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned')),
    CHECK (delivery_type IN ('showroom_pickup', 'home_delivery', 'courier'))
);

CREATE INDEX idx_delivery_order_id ON delivery_records(order_id);
CREATE INDEX idx_delivery_status ON delivery_records(status);
CREATE INDEX idx_delivery_scheduled_date ON delivery_records(scheduled_date);
```

---

## 5. FINANCE WORKFLOW

### 5.1 finance_partners
**Purpose:** Banks and NBFCs offering EV loans

```sql
CREATE TABLE finance_partners (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(255) NOT NULL,
    code                VARCHAR(50) NOT NULL UNIQUE,
    partner_type        VARCHAR(50) NOT NULL,  -- 'bank', 'nbfc', 'other'
    logo_url            VARCHAR(500),
    website             VARCHAR(255),
    contact_person      VARCHAR(255),
    contact_email       VARCHAR(255),
    contact_phone       VARCHAR(20),
    agreement_start     DATE,
    agreement_end       DATE,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    display_order       INTEGER DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (partner_type IN ('bank', 'nbfc', 'other'))
);

CREATE INDEX idx_finance_partners_code ON finance_partners(code);
CREATE INDEX idx_finance_partners_is_active ON finance_partners(is_active);
```

---

### 5.2 finance_products
**Purpose:** Loan schemes offered by partners

```sql
CREATE TABLE finance_products (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id          UUID NOT NULL REFERENCES finance_partners(id) ON DELETE CASCADE,
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    min_loan_amount     NUMERIC(12, 2),
    max_loan_amount     NUMERIC(12, 2),
    min_interest_rate   NUMERIC(5, 2),  -- Annual %
    max_interest_rate   NUMERIC(5, 2),
    min_tenure_months   INTEGER,
    max_tenure_months   INTEGER,
    processing_fee_pct  NUMERIC(5, 2),
    disclaimer          TEXT,
    eligibility_criteria TEXT,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_finance_products_partner_id ON finance_products(partner_id);
CREATE INDEX idx_finance_products_is_active ON finance_products(is_active);
```

---

### 5.3 loan_applications
**Purpose:** Customer finance enquiries and applications

```sql
CREATE TABLE loan_applications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number  VARCHAR(50) NOT NULL UNIQUE,
    customer_id         UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    product_variant_id  UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    partner_id          UUID REFERENCES finance_partners(id) ON DELETE SET NULL,
    vehicle_price       NUMERIC(12, 2) NOT NULL,
    down_payment        NUMERIC(12, 2) NOT NULL,
    requested_amount    NUMERIC(12, 2) NOT NULL,
    tenure_months       INTEGER NOT NULL,
    estimated_emi       NUMERIC(12, 2),
    estimated_rate      NUMERIC(5, 2),
    status              VARCHAR(50) NOT NULL DEFAULT 'submitted',
    assigned_to         UUID REFERENCES users(id) ON DELETE SET NULL,
    applicant_name      VARCHAR(255) NOT NULL,
    applicant_email     VARCHAR(255),
    applicant_phone     VARCHAR(20) NOT NULL,
    applicant_city      VARCHAR(100),
    applicant_pincode   VARCHAR(10),
    employment_type     VARCHAR(50),  -- 'salaried', 'self_employed', 'business', 'other'
    monthly_income      NUMERIC(12, 2),
    consent_at          TIMESTAMP WITH TIME ZONE NOT NULL,
    consent_text        TEXT,
    submitted_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    approved_at         TIMESTAMP WITH TIME ZONE,
    approved_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_amount     NUMERIC(12, 2),
    approved_tenure     INTEGER,
    approved_rate       NUMERIC(5, 2),
    disbursed_at        TIMESTAMP WITH TIME ZONE,
    rejected_at         TIMESTAMP WITH TIME ZONE,
    rejection_reason    TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (status IN ('submitted', 'under_review', 'documents_pending', 'documents_verified', 
                      'referred_to_partner', 'partner_decision_pending', 'approved', 
                      'rejected', 'withdrawn', 'disbursed')),
    CHECK (requested_amount > 0),
    CHECK (down_payment >= 0),
    CHECK (requested_amount <= vehicle_price - down_payment),
    CHECK (tenure_months > 0)
);

CREATE INDEX idx_loan_apps_application_number ON loan_applications(application_number);
CREATE INDEX idx_loan_apps_customer_id ON loan_applications(customer_id);
CREATE INDEX idx_loan_apps_status ON loan_applications(status);
CREATE INDEX idx_loan_apps_assigned_to ON loan_applications(assigned_to);
CREATE INDEX idx_loan_apps_partner_id ON loan_applications(partner_id);
CREATE INDEX idx_loan_apps_submitted_at ON loan_applications(submitted_at DESC);
```

---

### 5.4 loan_documents
**Purpose:** Secure document storage metadata

```sql
CREATE TABLE loan_documents (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id      UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
    document_type       VARCHAR(100) NOT NULL,  -- 'identity', 'address', 'income', 'bank_statement', 'other'
    document_name       VARCHAR(255) NOT NULL,
    private_file_key    VARCHAR(500) NOT NULL,  -- S3/storage key, NOT public URL
    file_size_bytes     BIGINT,
    mime_type           VARCHAR(100),
    uploaded_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    review_status       VARCHAR(50) DEFAULT 'pending',
    reviewed_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at         TIMESTAMP WITH TIME ZONE,
    review_notes        TEXT,
    is_verified         BOOLEAN DEFAULT false,
    expires_at          TIMESTAMP WITH TIME ZONE,  -- Document validity expiration
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (review_status IN ('pending', 'approved', 'rejected', 'expired'))
);

CREATE INDEX idx_loan_docs_application_id ON loan_documents(application_id);
CREATE INDEX idx_loan_docs_review_status ON loan_documents(review_status);
CREATE INDEX idx_loan_docs_uploaded_at ON loan_documents(uploaded_at DESC);

-- Security: private_file_key should never be exposed to frontend
-- Generate time-limited signed URLs server-side for authorized users only
```

---

### 5.5 loan_status_history
**Purpose:** Immutable audit trail of application status changes

```sql
CREATE TABLE loan_status_history (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id      UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
    old_status          VARCHAR(50),
    new_status          VARCHAR(50) NOT NULL,
    changed_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    reason              TEXT,
    notes               TEXT,
    metadata            JSONB,  -- Additional context
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_loan_history_application_id ON loan_status_history(application_id);
CREATE INDEX idx_loan_history_created_at ON loan_status_history(created_at DESC);
```

---

### 5.6 loan_followups
**Purpose:** Track sales/finance team follow-ups

```sql
CREATE TABLE loan_followups (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id      UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
    assigned_to         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followup_type       VARCHAR(50) NOT NULL,  -- 'call', 'email', 'whatsapp', 'meeting'
    due_at              TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at        TIMESTAMP WITH TIME ZONE,
    outcome             VARCHAR(50),  -- 'contacted', 'not_reachable', 'callback_requested', 'resolved'
    notes               TEXT,
    next_followup_at    TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (followup_type IN ('call', 'email', 'whatsapp', 'sms', 'meeting', 'other'))
);

CREATE INDEX idx_loan_followups_application_id ON loan_followups(application_id);
CREATE INDEX idx_loan_followups_assigned_to ON loan_followups(assigned_to);
CREATE INDEX idx_loan_followups_due_at ON loan_followups(due_at);
CREATE INDEX idx_loan_followups_completed ON loan_followups(completed_at) WHERE completed_at IS NOT NULL;
```

---

## 6. CRM AND OPERATIONS

### 6.1 enquiries
**Purpose:** General customer enquiries (pre-sales)

```sql
CREATE TABLE enquiries (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_number      VARCHAR(50) NOT NULL UNIQUE,
    customer_id         UUID REFERENCES customers(id) ON DELETE SET NULL,
    source              VARCHAR(50) NOT NULL,  -- 'website', 'phone', 'walk_in', 'social_media', 'referral'
    enquiry_type        VARCHAR(50) NOT NULL,  -- 'product', 'booking', 'service', 'finance', 'general'
    product_id          UUID REFERENCES products(id) ON DELETE SET NULL,
    name                VARCHAR(255) NOT NULL,
    email               VARCHAR(255),
    phone               VARCHAR(20) NOT NULL,
    city                VARCHAR(100),
    message             TEXT,
    status              VARCHAR(50) NOT NULL DEFAULT 'new',
    priority            VARCHAR(20) DEFAULT 'medium',
    assigned_to         UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_at         TIMESTAMP WITH TIME ZONE,
    resolved_at         TIMESTAMP WITH TIME ZONE,
    resolution_notes    TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (status IN ('new', 'contacted', 'in_progress', 'resolved', 'closed', 'spam')),
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CHECK (enquiry_type IN ('product', 'booking', 'service', 'finance', 'general', 'complaint'))
);

CREATE INDEX idx_enquiries_enquiry_number ON enquiries(enquiry_number);
CREATE INDEX idx_enquiries_customer_id ON enquiries(customer_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_assigned_to ON enquiries(assigned_to);
CREATE INDEX idx_enquiries_source ON enquiries(source);
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at DESC);
```

---

### 6.2 call_logs
**Purpose:** Customer interaction history

```sql
CREATE TABLE call_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id         UUID REFERENCES customers(id) ON DELETE SET NULL,
    enquiry_id          UUID REFERENCES enquiries(id) ON DELETE SET NULL,
    employee_id         UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    call_type           VARCHAR(50) NOT NULL,  -- 'inbound', 'outbound'
    call_duration_sec   INTEGER,
    call_at             TIMESTAMP WITH TIME ZONE NOT NULL,
    outcome             VARCHAR(50),  -- 'connected', 'no_answer', 'busy', 'callback_requested'
    notes               TEXT,
    next_followup_at    TIMESTAMP WITH TIME ZONE,
    recording_url       VARCHAR(500),  -- If call recording is implemented
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (call_type IN ('inbound', 'outbound'))
);

CREATE INDEX idx_call_logs_customer_id ON call_logs(customer_id);
CREATE INDEX idx_call_logs_enquiry_id ON call_logs(enquiry_id);
CREATE INDEX idx_call_logs_employee_id ON call_logs(employee_id);
CREATE INDEX idx_call_logs_call_at ON call_logs(call_at DESC);
```

---

### 6.3 tasks
**Purpose:** Generic task/work queue for staff

```sql
CREATE TABLE tasks (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(255) NOT NULL,
    description         TEXT,
    task_type           VARCHAR(50),  -- 'followup', 'documentation', 'verification', 'escalation'
    priority            VARCHAR(20) DEFAULT 'medium',
    status              VARCHAR(50) NOT NULL DEFAULT 'pending',
    assigned_to         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    due_at              TIMESTAMP WITH TIME ZONE,
    completed_at        TIMESTAMP WITH TIME ZONE,
    related_type        VARCHAR(50),  -- 'order', 'loan_application', 'enquiry', 'customer'
    related_id          UUID,
    notes               TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'))
);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_at ON tasks(due_at);
CREATE INDEX idx_tasks_related ON tasks(related_type, related_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

---

### 6.4 audit_logs
**Purpose:** Security and compliance audit trail

```sql
CREATE TABLE audit_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    action              VARCHAR(100) NOT NULL,  -- 'create', 'update', 'delete', 'view'
    entity_type         VARCHAR(100) NOT NULL,  -- Table name
    entity_id           UUID NOT NULL,
    before_json         JSONB,  -- State before change
    after_json          JSONB,  -- State after change
    ip_address          INET,
    user_agent          TEXT,
    request_id          VARCHAR(100),  -- For request tracing
    severity            VARCHAR(20) DEFAULT 'info',  -- 'info', 'warning', 'critical'
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (severity IN ('info', 'warning', 'critical'))
);

CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity) WHERE severity IN ('warning', 'critical');

-- Partition by month for better performance
-- ALTER TABLE audit_logs PARTITION BY RANGE (created_at);
```

**Critical Actions to Audit:**
- Price changes
- Order status changes
- Payment processing
- Loan application status changes
- Document access
- User role changes
- Inventory adjustments

---

### 6.5 notifications
**Purpose:** Email/SMS/WhatsApp notification queue

```sql
CREATE TABLE notifications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
    channel             VARCHAR(50) NOT NULL,  -- 'email', 'sms', 'whatsapp', 'push'
    recipient           VARCHAR(255) NOT NULL,  -- Email or phone number
    template_key        VARCHAR(100) NOT NULL,  -- Reference to template
    subject             VARCHAR(255),
    payload_json        JSONB NOT NULL,  -- Template variables
    status              VARCHAR(50) NOT NULL DEFAULT 'pending',
    sent_at             TIMESTAMP WITH TIME ZONE,
    delivered_at        TIMESTAMP WITH TIME ZONE,
    opened_at           TIMESTAMP WITH TIME ZONE,
    provider_id         VARCHAR(255),  -- Provider's message ID
    provider_response   JSONB,
    error_message       TEXT,
    retry_count         INTEGER DEFAULT 0,
    max_retries         INTEGER DEFAULT 3,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CHECK (channel IN ('email', 'sms', 'whatsapp', 'push', 'in_app')),
    CHECK (status IN ('pending', 'queued', 'sent', 'delivered', 'failed', 'bounced'))
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_channel ON notifications(channel);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_pending ON notifications(status, retry_count) 
    WHERE status = 'pending' OR (status = 'failed' AND retry_count < max_retries);
```

---

## 7. ENTITY RELATIONSHIP DIAGRAM

### 7.1 High-Level ER Diagram (Text Representation)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      IDENTITY & ACCESS CONTROL                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────┐        ┌──────────────┐        ┌─────────────┐        │
│  │  users  │◄───────│  user_roles  │───────►│    roles    │        │
│  └─────────┘        └──────────────┘        └─────────────┘        │
│       │                                              │               │
│       │                                              │               │
│       ▼                                              ▼               │
│  ┌─────────┐                              ┌──────────────────┐     │
│  │customers│                              │role_permissions   │     │
│  └─────────┘                              └──────────────────┘     │
│       │                                              │               │
│  ┌─────────┐                              ┌─────────────┐          │
│  │employees│                              │ permissions │          │
│  └─────────┘                              └─────────────┘          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    CATALOGUE & INVENTORY                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────┐         ┌──────────┐         ┌────────────────────┐   │
│  │ brands │         │ products │◄────────│product_categories  │   │
│  └────────┘         └──────────┘         └────────────────────┘   │
│      │                   │ │                       │                 │
│      └───────────────────┘ │                       │ (self-ref)     │
│                            │                       │                 │
│              ┌─────────────┼───────────────┐       │                 │
│              ▼             ▼               ▼       ▼                 │
│    ┌─────────────────┐ ┌───────────┐ ┌──────────────┐              │
│    │product_variants │ │product_   │ │product_media │              │
│    └─────────────────┘ │  specs    │ └──────────────┘              │
│              │          └───────────┘                                │
│              │                                                        │
│              ▼                                                        │
│    ┌───────────────┐                                                 │
│    │   inventory   │◄────────┐                                      │
│    └───────────────┘         │                                      │
│              │               │                                       │
│              │          ┌────────────┐                               │
│              ▼          │ locations  │                               │
│    ┌──────────────────────┐└────────────┘                           │
│    │inventory_transactions│                                          │
│    └──────────────────────┘                                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     COMMERCE & ORDERS                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────┐         ┌──────────┐         ┌────────────┐         │
│  │ customers │────────►│  carts   │────────►│ cart_items │         │
│  └───────────┘         └──────────┘         └────────────┘         │
│       │                     │                                        │
│       │                     │ (converts to)                          │
│       │                     ▼                                        │
│       │                ┌─────────┐                                   │
│       ├───────────────►│ orders  │◄────────┐                        │
│       │                └─────────┘         │                        │
│       │                     │               │                        │
│       │      ┌──────────────┼──────────┐   │                        │
│       │      ▼              ▼          ▼   │                        │
│       │ ┌────────────┐ ┌─────────┐ ┌──────────┐                    │
│       │ │order_items │ │payments │ │ invoices │                    │
│       │ └────────────┘ └─────────┘ └──────────┘                    │
│       │                     ▲                                        │
│       │                     │                                        │
│       │                ┌──────────────┐                              │
│       └───────────────►│delivery_     │                              │
│                        │  records     │                              │
│                        └──────────────┘                              │
│  ┌───────────┐         ┌──────────┐                                 │
│  │ customers │────────►│ bookings │                                 │
│  └───────────┘         └──────────┘                                 │
│                             │                                        │
│                             └──(converts to)──►orders                │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     FINANCE WORKFLOW                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────┐         ┌──────────────────┐                         │
│  │ customers │────────►│loan_applications │                         │
│  └───────────┘         └──────────────────┘                         │
│                                 │                                    │
│                    ┌────────────┼────────────┐                      │
│                    ▼            ▼            ▼                       │
│          ┌────────────────┐ ┌────────────┐ ┌───────────────┐       │
│          │loan_documents  │ │loan_status_│ │loan_followups │       │
│          └────────────────┘ │  history   │ └───────────────┘       │
│                             └────────────┘                           │
│                                                                       │
│  ┌────────────────┐         ┌────────────────┐                      │
│  │finance_partners│────────►│finance_products│                      │
│  └────────────────┘         └────────────────┘                      │
│          │                                                            │
│          └──────────────────►loan_applications                       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    CRM & OPERATIONS                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────┐         ┌───────────┐         ┌───────────┐         │
│  │ customers │────────►│ enquiries │────────►│call_logs  │         │
│  └───────────┘         └───────────┘         └───────────┘         │
│                                                                       │
│  ┌─────┐               ┌─────────────┐                              │
│  │users│──────────────►│    tasks    │                              │
│  └─────┘               └─────────────┘                              │
│                                                                       │
│  ┌─────┐               ┌──────────────┐                             │
│  │users│──────────────►│ audit_logs   │                             │
│  └─────┘               └──────────────┘                             │
│                                                                       │
│  ┌─────┐               ┌──────────────┐                             │
│  │users│──────────────►│notifications │                             │
│  └─────┘               └──────────────┘                             │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Cardinality Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| users ↔ roles | Many-to-Many | Via user_roles |
| roles ↔ permissions | Many-to-Many | Via role_permissions |
| users → customers | One-to-One | Optional customer profile |
| users → employees | One-to-One | Staff profile |
| brands → products | One-to-Many | Products by brand |
| categories → products | One-to-Many | Products in category |
| products → variants | One-to-Many | Product variations |
| variants → inventory | One-to-Many | Stock per location |
| customers → orders | One-to-Many | Purchase history |
| orders → order_items | One-to-Many | Line items |
| orders → payments | One-to-Many | Payment records |
| customers → loan_applications | One-to-Many | Finance enquiries |
| loan_applications → documents | One-to-Many | Supporting documents |

---

## 8. INDEXES AND CONSTRAINTS

### 8.1 Primary Keys
All tables use UUID primary keys via `gen_random_uuid()`.

### 8.2 Unique Constraints
- `users.auth_uid`
- `users.email` (case-insensitive, nulls allowed)
- `roles.name`, `roles.code`
- `permissions.code`
- `customers.customer_number`
- `employees.employee_code`
- `brands.slug`
- `product_categories.slug`
- `products.sku`, `products.slug`
- `product_variants.sku`
- `locations.code`
- `orders.order_number`
- `bookings.booking_number`
- `invoices.invoice_number`
- `finance_partners.code`
- `loan_applications.application_number`
- `enquiries.enquiry_number`

### 8.3 Foreign Key Constraints
All foreign keys use appropriate ON DELETE actions:
- `CASCADE`: Child records deleted when parent deleted (e.g., cart_items → carts)
- `RESTRICT`: Prevent deletion if children exist (e.g., orders → customers)
- `SET NULL`: Preserve record but clear reference (e.g., products → brands)

### 8.4 Check Constraints
- Numeric ranges (prices >= 0, quantities > 0)
- Status enum validation
- Logical constraints (reserved <= on_hand)
- Required field combinations

### 8.5 Performance Indexes
Critical indexes for common queries:
- User lookups by auth_uid, email, phone
- Product searches by SKU, slug, category
- Order queries by customer, status, date
- Inventory availability checks
- Finance application status filtering
- Audit log queries by entity and date

---

## 9. MIGRATION STRATEGY

### 9.1 Flyway Migration Structure

```
backend/src/main/resources/db/migration/
├── V1.0__initial_schema.sql
├── V1.1__identity_and_access.sql
├── V1.2__catalogue_and_inventory.sql
├── V1.3__commerce_and_orders.sql
├── V1.4__finance_workflow.sql
├── V1.5__crm_and_operations.sql
├── V1.6__indexes_and_constraints.sql
├── V1.7__initial_data.sql
└── V2.0__[future_changes].sql
```

### 9.2 Migration Principles
1. **Never modify existing migrations** after deployment
2. **Always add new migrations** for schema changes
3. **Test migrations** on dev/staging before production
4. **Backup database** before running migrations
5. **Make migrations reversible** where possible
6. **Include rollback scripts** for critical changes

### 9.3 Initial Data Requirements
- System roles and permissions
- Default product categories
- Initial location (main showroom)
- Admin user account

### 9.4 Environment-Specific Data
- Development: Seed data for testing
- Staging: Anonymized production-like data
- Production: Minimal bootstrap data only

---

## SUMMARY

### Schema Statistics
- **Total Tables:** 37
- **Total Indexes:** 100+
- **Foreign Keys:** 50+
- **Check Constraints:** 50+
- **Unique Constraints:** 25+

### Design Highlights
✅ UUID primary keys for security and scalability  
✅ Audit trails for sensitive operations  
✅ Immutable historical records (transactions, status history)  
✅ Flexible specifications system  
✅ Hierarchical categories  
✅ Multi-location inventory tracking  
✅ Secure document storage metadata  
✅ Order/payment state separation  
✅ Comprehensive RBAC support  
✅ Database-level data integrity

### Next Steps
1. ✅ Database schema designed
2. ⏭️ Map to JPA entities with annotations
3. ⏭️ Define DTOs and mappers
4. ⏭️ Create Flyway migration scripts
5. ⏭️ Design REST API endpoints

---

**Document Status:** Complete  
**Next Deliverable:** JPA Entity Specifications
