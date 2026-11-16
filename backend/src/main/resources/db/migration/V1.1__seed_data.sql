-- ABHA Enterprise Seed Data
-- Version 1.1 - Initial seed data for development
-- Date: November 14, 2026

-- ============================================
-- INSERT BRANDS
-- ============================================
INSERT INTO brands (id, name, slug, description, is_active, display_order) VALUES
(RANDOM_UUID(), 'Ather', 'ather', 'Premium electric scooters with smart connectivity', TRUE, 1),
(RANDOM_UUID(), 'Ola Electric', 'ola-electric', 'Affordable and feature-rich electric scooters', TRUE, 2),
(RANDOM_UUID(), 'TVS', 'tvs', 'Trusted brand with quality electric vehicles', TRUE, 3),
(RANDOM_UUID(), 'Bajaj', 'bajaj', 'Reliable electric three-wheelers and scooters', TRUE, 4);

-- ============================================
-- INSERT PRODUCT CATEGORIES
-- ============================================
INSERT INTO product_categories (id, name, slug, description, is_active, display_order) VALUES
(RANDOM_UUID(), 'Electric Scooters', 'electric-scooters', 'Two-wheeler electric scooters for urban commuting', TRUE, 1),
(RANDOM_UUID(), 'Electric Motorcycles', 'electric-motorcycles', 'High-performance electric bikes', TRUE, 2),
(RANDOM_UUID(), 'Electric Three-Wheelers', 'electric-three-wheelers', 'Commercial and passenger electric vehicles', TRUE, 3),
(RANDOM_UUID(), 'Batteries', 'batteries', 'EV replacement batteries and power packs', TRUE, 4),
(RANDOM_UUID(), 'Chargers', 'chargers', 'Home and portable EV chargers', TRUE, 5),
(RANDOM_UUID(), 'Accessories', 'accessories', 'EV accessories and upgrades', TRUE, 6);

-- ============================================
-- INSERT FINANCE PARTNERS
-- ============================================
INSERT INTO finance_partners (id, name, code, partner_type, is_active, display_order) VALUES
(RANDOM_UUID(), 'HDFC Bank', 'HDFC_BANK', 'bank', TRUE, 1),
(RANDOM_UUID(), 'ICICI Bank', 'ICICI_BANK', 'bank', TRUE, 2),
(RANDOM_UUID(), 'Bajaj Finance', 'BAJAJ_FINANCE', 'nbfc', TRUE, 3),
(RANDOM_UUID(), 'Cholamandalam Finance', 'CHOLA_FINANCE', 'nbfc', TRUE, 4);

-- Note: Products and customers will be added through the application
-- as they require more complex data and relationships
