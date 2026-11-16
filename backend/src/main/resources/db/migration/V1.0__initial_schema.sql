-- ABHA Enterprise Database Schema
-- Version 1.0 - Initial Schema
-- Date: November 14, 2026

-- Enable UUID extension for PostgreSQL
-- For H2, this is handled automatically

-- ============================================
-- BRANDS TABLE
-- ============================================
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    description TEXT,
    website VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_is_active ON brands(is_active);

-- ============================================
-- PRODUCT CATEGORIES TABLE
-- ============================================
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    parent_id UUID,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    icon VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES product_categories(id) ON DELETE SET NULL
);

CREATE INDEX idx_categories_parent_id ON product_categories(parent_id);
CREATE INDEX idx_categories_slug ON product_categories(slug);
CREATE INDEX idx_categories_is_active ON product_categories(is_active);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    brand_id UUID,
    category_id UUID NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(200) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    short_description TEXT,
    description TEXT,
    product_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    is_featured BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE RESTRICT
);

CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);

-- ============================================
-- PRODUCT VARIANTS TABLE
-- ============================================
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    product_id UUID NOT NULL,
    variant_name VARCHAR(100),
    sku VARCHAR(100) NOT NULL UNIQUE,
    colour VARCHAR(50),
    battery_option VARCHAR(100),
    price DECIMAL(12, 2) NOT NULL,
    compare_at_price DECIMAL(12, 2),
    cost_price DECIMAL(12, 2),
    weight_kg DECIMAL(8, 2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_is_active ON product_variants(is_active);

-- ============================================
-- PRODUCT SPECS TABLE
-- ============================================
CREATE TABLE product_specs (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    product_id UUID NOT NULL,
    spec_key VARCHAR(100) NOT NULL,
    spec_value TEXT NOT NULL,
    unit VARCHAR(50),
    spec_group VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_specs_product_id ON product_specs(product_id);
CREATE INDEX idx_specs_spec_key ON product_specs(spec_key);

-- ============================================
-- PRODUCT MEDIA TABLE
-- ============================================
CREATE TABLE product_media (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    product_id UUID NOT NULL,
    media_type VARCHAR(20) NOT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    alt_text VARCHAR(255),
    title VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_media_product_id ON product_media(product_id);

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    user_id UUID,
    customer_number VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    country VARCHAR(50) DEFAULT 'India',
    consent_marketing BOOLEAN DEFAULT FALSE,
    consent_at TIMESTAMP,
    lead_source VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_customer_number ON customers(customer_number);
CREATE INDEX idx_customers_email ON customers(LOWER(email));
CREATE INDEX idx_customers_phone ON customers(phone);

-- ============================================
-- FINANCE PARTNERS TABLE
-- ============================================
CREATE TABLE finance_partners (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    partner_type VARCHAR(50) NOT NULL DEFAULT 'bank',
    logo_url VARCHAR(500),
    website VARCHAR(255),
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    agreement_start DATE,
    agreement_end DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_finance_partners_code ON finance_partners(code);
CREATE INDEX idx_finance_partners_is_active ON finance_partners(is_active);

-- ============================================
-- LOAN APPLICATIONS TABLE
-- ============================================
CREATE TABLE loan_applications (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    application_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID NOT NULL,
    product_variant_id UUID,
    partner_id UUID,
    vehicle_price DECIMAL(12, 2) NOT NULL,
    down_payment DECIMAL(12, 2) NOT NULL,
    requested_amount DECIMAL(12, 2) NOT NULL,
    tenure_months INTEGER NOT NULL,
    estimated_emi DECIMAL(12, 2),
    estimated_rate DECIMAL(5, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'submitted',
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255),
    applicant_phone VARCHAR(20) NOT NULL,
    applicant_city VARCHAR(100),
    applicant_pincode VARCHAR(10),
    employment_type VARCHAR(50),
    monthly_income DECIMAL(12, 2),
    consent_at TIMESTAMP NOT NULL,
    consent_text TEXT,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_amount DECIMAL(12, 2),
    approved_tenure INTEGER,
    approved_rate DECIMAL(5, 2),
    rejected_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    FOREIGN KEY (partner_id) REFERENCES finance_partners(id) ON DELETE SET NULL
);

CREATE INDEX idx_loan_apps_application_number ON loan_applications(application_number);
CREATE INDEX idx_loan_apps_customer_id ON loan_applications(customer_id);
CREATE INDEX idx_loan_apps_status ON loan_applications(status);
CREATE INDEX idx_loan_apps_partner_id ON loan_applications(partner_id);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID NOT NULL,
    order_type VARCHAR(50) NOT NULL DEFAULT 'purchase',
    status VARCHAR(50) NOT NULL DEFAULT 'pending_confirmation',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    fulfilment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    delivery_charge DECIMAL(12, 2) DEFAULT 0,
    grand_total DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    customer_note TEXT,
    internal_note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);

CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
