-- ABHA Enterprise - Initial Data
-- Version: 1.2
-- Description: Insert initial/seed data for roles, permissions, categories

-- ============================================================================
-- ROLES
-- ============================================================================

INSERT INTO roles (id, name, code, description, is_system, created_at, updated_at) VALUES
(gen_random_uuid(), 'Super Admin', 'SUPER_ADMIN', 'Full system access with all permissions', true, NOW(), NOW()),
(gen_random_uuid(), 'Business Manager', 'BUSINESS_MANAGER', 'Manages products, inventory, orders and operations', true, NOW(), NOW()),
(gen_random_uuid(), 'Sales Executive', 'SALES_EXECUTIVE', 'Manages assigned customers, enquiries and bookings', true, NOW(), NOW()),
(gen_random_uuid(), 'Inventory Manager', 'INVENTORY_MANAGER', 'Manages inventory and stock movements', true, NOW(), NOW()),
(gen_random_uuid(), 'Finance Officer', 'FINANCE_OFFICER', 'Manages finance applications and loan processing', true, NOW(), NOW()),
(gen_random_uuid(), 'Customer', 'CUSTOMER', 'Regular customer with access to own data', true, NOW(), NOW());

-- ============================================================================
-- PERMISSIONS
-- ============================================================================

-- Product permissions
INSERT INTO permissions (id, code, module, action, description, created_at, updated_at) VALUES
(gen_random_uuid(), 'products.read', 'products', 'read', 'View product catalogue', NOW(), NOW()),
(gen_random_uuid(), 'products.write', 'products', 'write', 'Create and edit products', NOW(), NOW()),
(gen_random_uuid(), 'products.delete', 'products', 'delete', 'Archive products', NOW(), NOW());

-- Inventory permissions
INSERT INTO permissions (id, code, module, action, description, created_at, updated_at) VALUES
(gen_random_uuid(), 'inventory.read', 'inventory', 'read', 'View inventory', NOW(), NOW()),
(gen_random_uuid(), 'inventory.write', 'inventory', 'write', 'Manage stock levels', NOW(), NOW());

-- Order permissions
INSERT INTO permissions (id, code, module, action, description, created_at, updated_at) VALUES
(gen_random_uuid(), 'orders.read', 'orders', 'read', 'View orders', NOW(), NOW()),
(gen_random_uuid(), 'orders.write', 'orders', 'write', 'Update order status', NOW(), NOW()),
(gen_random_uuid(), 'orders.cancel', 'orders', 'cancel', 'Cancel orders', NOW(), NOW());

-- Finance permissions
INSERT INTO permissions (id, code, module, action, description, created_at, updated_at) VALUES
(gen_random_uuid(), 'loans.read', 'loans', 'read', 'View finance applications', NOW(), NOW()),
(gen_random_uuid(), 'loans.write', 'loans', 'write', 'Update finance applications', NOW(), NOW()),
(gen_random_uuid(), 'loans.documents.read', 'loans', 'read', 'Access finance application documents', NOW(), NOW()),
(gen_random_uuid(), 'loans.documents.write', 'loans', 'write', 'Upload and manage loan documents', NOW(), NOW());

-- Customer permissions
INSERT INTO permissions (id, code, module, action, description, created_at, updated_at) VALUES
(gen_random_uuid(), 'customers.read', 'customers', 'read', 'View customer information', NOW(), NOW()),
(gen_random_uuid(), 'customers.write', 'customers', 'write', 'Update customer records', NOW(), NOW());

-- CRM permissions
INSERT INTO permissions (id, code, module, action, description, created_at, updated_at) VALUES
(gen_random_uuid(), 'crm.read', 'crm', 'read', 'View enquiries and tasks', NOW(), NOW()),
(gen_random_uuid(), 'crm.write', 'crm', 'write', 'Manage enquiries and tasks', NOW(), NOW());

-- Report permissions
INSERT INTO permissions (id, code, module, action, description, created_at, updated_at) VALUES
(gen_random_uuid(), 'reports.read', 'reports', 'read', 'Access business reports', NOW(), NOW());

-- Settings permissions
INSERT INTO permissions (id, code, module, action, description, created_at, updated_at) VALUES
(gen_random_uuid(), 'settings.write', 'settings', 'write', 'Modify system settings', NOW(), NOW());

-- User management permissions
INSERT INTO permissions (id, code, module, action, description, created_at, updated_at) VALUES
(gen_random_uuid(), 'users.manage', 'users', 'manage', 'Manage users and roles', NOW(), NOW());

-- ============================================================================
-- ROLE-PERMISSION MAPPINGS
-- ============================================================================

-- Super Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id, granted_at, created_at)
SELECT r.id, p.id, NOW(), NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'SUPER_ADMIN';

-- Business Manager permissions
INSERT INTO role_permissions (role_id, permission_id, granted_at, created_at)
SELECT r.id, p.id, NOW(), NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'BUSINESS_MANAGER'
AND p.code IN (
    'products.read', 'products.write',
    'inventory.read', 'inventory.write',
    'orders.read', 'orders.write',
    'customers.read', 'customers.write',
    'crm.read', 'crm.write',
    'reports.read'
);

-- Sales Executive permissions
INSERT INTO role_permissions (role_id, permission_id, granted_at, created_at)
SELECT r.id, p.id, NOW(), NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'SALES_EXECUTIVE'
AND p.code IN (
    'products.read',
    'customers.read', 'customers.write',
    'crm.read', 'crm.write',
    'orders.read'
);

-- Inventory Manager permissions
INSERT INTO role_permissions (role_id, permission_id, granted_at, created_at)
SELECT r.id, p.id, NOW(), NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'INVENTORY_MANAGER'
AND p.code IN (
    'products.read',
    'inventory.read', 'inventory.write',
    'orders.read'
);

-- Finance Officer permissions
INSERT INTO role_permissions (role_id, permission_id, granted_at, created_at)
SELECT r.id, p.id, NOW(), NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'FINANCE_OFFICER'
AND p.code IN (
    'loans.read', 'loans.write',
    'loans.documents.read', 'loans.documents.write',
    'customers.read',
    'reports.read'
);

-- Customer permissions (customers access their own data via application logic)
-- No explicit permissions needed as access control is based on customer_id matching

-- ============================================================================
-- PRODUCT CATEGORIES
-- ============================================================================

INSERT INTO product_categories (id, name, slug, description, is_active, display_order, created_at, updated_at) VALUES
(gen_random_uuid(), 'Electric Scooters', 'electric-scooters', 'Two-wheeler electric scooters for urban and city commuting', true, 1, NOW(), NOW()),
(gen_random_uuid(), 'Electric Motorcycles', 'electric-motorcycles', 'Electric bikes and motorcycles for longer commutes', true, 2, NOW(), NOW()),
(gen_random_uuid(), 'Electric Three-Wheelers', 'electric-three-wheelers', 'Commercial and passenger electric three-wheelers', true, 3, NOW(), NOW()),
(gen_random_uuid(), 'Batteries', 'batteries', 'EV batteries and power packs', true, 4, NOW(), NOW()),
(gen_random_uuid(), 'Chargers', 'chargers', 'EV charging equipment and accessories', true, 5, NOW(), NOW()),
(gen_random_uuid(), 'Accessories', 'accessories', 'EV accessories and upgrades', true, 6, NOW(), NOW()),
(gen_random_uuid(), 'Spare Parts', 'spare-parts', 'Genuine EV spare parts and components', true, 7, NOW(), NOW());

-- ============================================================================
-- DEFAULT LOCATION
-- ============================================================================

INSERT INTO locations (id, name, code, location_type, city, state, country, is_active, created_at, updated_at) VALUES
(gen_random_uuid(), 'Main Showroom', 'MAIN-SHW-001', 'showroom', 'Mumbai', 'Maharashtra', 'India', true, NOW(), NOW());

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE role_permissions IS 'Initial role-permission mappings configured. Super Admin has all permissions.';
COMMENT ON TABLE product_categories IS 'Default product categories for EV dealership: scooters, motorcycles, three-wheelers, batteries, chargers, accessories, spare parts.';
