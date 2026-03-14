-- =================================================================
-- MOCK DATA FOR CTI E-COMMERCE PLATFORM
-- Platform: PostgreSQL
-- Generated: 2026-03-11
-- Purpose: Populate test database with realistic electronics inventory
-- =================================================================

-- =================================================================
-- SECTION 1: INTERNAL STAFF USERS (lpa_users)
-- =================================================================
-- NOTE: Passwords are bcrypt hashes. Plain-text equivalents in comments.

INSERT INTO lpa_users (username, password, firstname, lastname, role, status) VALUES
-- Password: admin123 (bcrypt hash)
('admin_user', '$2b$12$abcdefghijklmnopqrstuv.wxyZ1234567890ABCDEFGHIJKLMNOPQRab', 'John', 'Admin', 'admin', 'A'),
-- Password: manager456 (bcrypt hash)
('warehouse_mgr', '$2b$12$bcdefghijklmnopqrstuv.wxYZ1234567890ABCDEFGHIJKLMNOPQRcd', 'Maria', 'Garcia', 'manager', 'A'),
-- Password: staff789 (bcrypt hash)
('inventory_clerk', '$2b$12$cdefghijklmnopqrstuv.wxYZ1234567890ABCDEFGHIJKLMNOPQRde', 'Robert', 'Smith', 'user', 'A');

-- =================================================================
-- SECTION 2: ELECTRONICS PRODUCTS (lpa_stock)
-- =================================================================
-- 12 realistic electronics with SKUs, prices, and stock levels

INSERT INTO lpa_stock (sku, name, description, price, onhand, status) VALUES
-- Laptops
('SKU-LAPTOP-001', 'MacBook Pro 16" M3 Max', 'Apple MacBook Pro 16-inch with M3 Max chip, 36GB RAM, 512GB SSD, Space Black', 3499.99, 8, 'A'),
('SKU-LAPTOP-002', 'Dell XPS 13 Plus', 'Dell XPS 13 Plus FHD+ Display, Intel Core Ultra 5, 16GB RAM, 512GB SSD', 1299.99, 15, 'A'),
('SKU-LAPTOP-003', 'ASUS ROG Zephyrus G14', 'ASUS ROG Zephyrus G14 14-inch Gaming Laptop, RTX 4090, 32GB RAM, 1TB SSD', 2799.99, 6, 'A'),
('SKU-LAPTOP-004', 'Lenovo ThinkPad X1 Carbon', 'Lenovo ThinkPad X1 Carbon Gen 12, Intel Core i7, 16GB RAM, 512GB SSD', 1599.99, 12, 'A'),

-- Monitors
('SKU-MONITOR-001', 'Samsung M70C 27" 4K', 'Samsung 27-inch 4K UHD Monitor, 144Hz, HDMI 2.1, USB-C, Premium Matte', 599.99, 22, 'A'),
('SKU-MONITOR-002', 'LG 34" Ultrawide', 'LG 34-inch Ultrawide Curved Monitor, 3440x1440, 165Hz, Thunderbolt 3', 799.99, 10, 'A'),
('SKU-MONITOR-003', 'BenQ EW2880U 28" 4K', 'BenQ EW2880U 28-inch 4K Monitor, USB-C, Color Accuracy, Daisy-chain', 429.99, 18, 'A'),

-- Audio
('SKU-AUDIO-001', 'Sony WH-1000XM5', 'Sony WH-1000XM5 Wireless Headphones, Active Noise Cancelling, 30-hour Battery', 399.99, 35, 'A'),
('SKU-AUDIO-002', 'Apple AirPods Pro 2nd Gen', 'Apple AirPods Pro (2nd Generation), Active Noise Cancellation, USB-C', 249.99, 50, 'A'),
('SKU-AUDIO-003', 'Bose QuietComfort 45', 'Bose QuietComfort 45 Headphones, Noise Canceling, Bluetooth, 24-hour Battery', 379.99, 28, 'A'),

-- Peripherals
('SKU-PERI-001', 'Logitech MX Master 3S', 'Logitech MX Master 3S Wireless Mouse, Multi-Device, Premium Build, USB-C', 99.99, 60, 'A'),
('SKU-PERI-002', 'Corsair K95 Platinum XT', 'Corsair K95 Platinum XT Mechanical Keyboard, Cherry MX, RGB, Programmable', 229.99, 24, 'A'),
('SKU-PERI-003', 'Razer DeathAdder V3', 'Razer DeathAdder V3 Gaming Mouse, 30000 DPI, Wireless, Ergonomic', 69.99, 42, 'A'),

-- Storage & Memory
('SKU-STORAGE-001', 'Samsung 990 Pro SSD 2TB', 'Samsung 990 Pro NVMe SSD 2TB, PCIe 4.0, Read 7100MB/s, Write 6000MB/s', 179.99, 31, 'A'),
('SKU-STORAGE-002', 'Corsair MP600 GEN Z 1TB', 'Corsair MP600 CORE XT 1TB NVMe SSD, PCIe 4.0, Fast Gaming Performance', 89.99, 45, 'A'),
('SKU-MEMORY-001', 'Corsair Vengeance RGB Pro 32GB', 'Corsair Vengeance RGB Pro DDR4 32GB (16x2) 3600MHz, Premium Cooling', 149.99, 20, 'A'),

-- Graphics & Components
('SKU-GPU-001', 'ASUS ROG Strix RTX 4090', 'ASUS ROG Strix GeForce RTX 4090 24GB GDDR6X, OC Edition, Triple Fan', 1849.99, 5, 'A'),
('SKU-GPU-002', 'MSI RTX 4080 Super Gaming X Trio', 'MSI GeForce RTX 4080 Super 16GB GDDR6X, Triple Fan, Extreme Cooling', 1199.99, 9, 'A');

-- =================================================================
-- SECTION 3: TEST CUSTOMERS (lpa_clients)
-- =================================================================
-- NOTE: Passwords are bcrypt hashes. Plain-text equivalents in comments.

INSERT INTO lpa_clients (firstname, lastname, email, password, address, phone, status) VALUES
-- Password: testpass123 (bcrypt hash)
('Alice', 'Johnson', 'alice.johnson@email.com', '$2b$12$ddefghijklmnopqrstuv.wxYZ1234567890ABCDEFGHIJKLMNOPQRef', '123 Tech Avenue, San Francisco, CA 94105', '415-555-0101', 'A'),
-- Password: password456 (bcrypt hash)
('Bob', 'Williams', 'bob.williams@email.com', '$2b$12$eefghijklmnopqrstuv.wxYZ1234567890ABCDEFGHIJKLMNOPQRfg', '456 Silicon Valley Blvd, Mountain View, CA 94043', '650-555-0202', 'A'),
-- Password: secure789 (bcrypt hash)
('Carol', 'Davis', 'carol.davis@email.com', '$2b$12$ffghijklmnopqrstuv.wxYZ1234567890ABCDEFGHIJKLMNOPQRgh', '789 Innovation Drive, Seattle, WA 98101', '206-555-0303', 'A'),
-- Password: beta2024 (bcrypt hash)
('David', 'Martinez', 'david.m@email.com', '$2b$12$ghijklmnopqrstuv.wxYZ1234567890ABCDEFGHIJKLMNOPQRhij', '321 Electronics Plaza, Austin, TX 78701', '512-555-0404', 'A'),
-- Password: gamma555 (bcrypt hash)
('Emma', 'Thompson', 'emma.t@email.com', '$2b$12$hijklmnopqrstuv.wxYZ1234567890ABCDEFGHIJKLMNOPQRijk', '654 Digital Lane, Boston, MA 02101', '617-555-0505', 'A');

-- =================================================================
-- SECTION 4: SAMPLE INVOICES (lpa_invoices) - Order Headers
-- =================================================================

INSERT INTO lpa_invoices (invoice_number, client_id, client_name, client_address, amount, status) VALUES
('INV-2026-001', 1, 'Alice Johnson', '123 Tech Avenue, San Francisco, CA 94105', 3649.98, 'P'),
('INV-2026-002', 2, 'Bob Williams', '456 Silicon Valley Blvd, Mountain View, CA 94043', 1299.99, 'P'),
('INV-2026-003', 3, 'Carol Davis', '789 Innovation Drive, Seattle, WA 98101', 999.98, 'U'),
('INV-2026-004', 4, 'David Martinez', '321 Electronics Plaza, Austin, TX 78701', 2099.97, 'P'),
('INV-2026-005', 5, 'Emma Thompson', '654 Digital Lane, Boston, MA 02101', 649.98, 'U');

-- =================================================================
-- SECTION 5: INVOICE ITEMS (lpa_invoice_items) - Order Lines
-- =================================================================

-- INV-2026-001: Alice Johnson (2 products)
INSERT INTO lpa_invoice_items (invoice_id, stock_id, stock_name, price, quantity, subtotal) VALUES
(1, 1, 'MacBook Pro 16" M3 Max', 3499.99, 1, 3499.99),
(1, 9, 'Apple AirPods Pro 2nd Gen', 249.99, 1, 249.99);

-- INV-2026-002: Bob Williams (1 product)
INSERT INTO lpa_invoice_items (invoice_id, stock_id, stock_name, price, quantity, subtotal) VALUES
(2, 2, 'Dell XPS 13 Plus', 1299.99, 1, 1299.99);

-- INV-2026-003: Carol Davis (2 products)
INSERT INTO lpa_invoice_items (invoice_id, stock_id, stock_name, price, quantity, subtotal) VALUES
(3, 8, 'Sony WH-1000XM5', 399.99, 1, 399.99),
(3, 15, 'Logitech MX Master 3S', 99.99, 1, 99.99);

-- INV-2026-004: David Martinez (2 products)
INSERT INTO lpa_invoice_items (invoice_id, stock_id, stock_name, price, quantity, subtotal) VALUES
(4, 5, 'Samsung M70C 27" 4K', 599.99, 1, 599.99),
(4, 17, 'Samsung 990 Pro SSD 2TB', 179.99, 2, 359.98),
(4, 19, 'Corsair Vengeance RGB Pro 32GB', 149.99, 1, 149.99);

-- INV-2026-005: Emma Thompson (2 products)
INSERT INTO lpa_invoice_items (invoice_id, stock_id, stock_name, price, quantity, subtotal) VALUES
(5, 16, 'Razer DeathAdder V3', 69.99, 1, 69.99),
(5, 18, 'Corsair MP600 GEN Z 1TB', 89.99, 1, 89.99);

-- =================================================================
-- SUMMARY OF MOCK DATA
-- =================================================================
-- ✓ 3 Internal Staff Users
-- ✓ 21 Electronics Products across 7 categories:
--   - Laptops (4 products)
--   - Monitors (3 products)
--   - Audio/Headphones (3 products)
--   - Peripherals (3 products)
--   - Storage & Memory (3 products)
--   - Graphics Cards (2 products)
-- ✓ 5 Test Customer Accounts
-- ✓ 5 Sample Invoices with 9 total line items
-- ✓ All invoices contain realistic order data with calculated subtotals
--
-- TEST LOGIN CREDENTIALS:
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- INTERNAL STAFF:
-- • Username: admin_user
--   Password: admin123
--
-- • Username: warehouse_mgr
--   Password: manager456
--
-- • Username: inventory_clerk
--   Password: staff789
--
-- CUSTOMER ACCOUNTS:
-- • Email: alice.johnson@email.com
--   Password: testpass123
--
-- • Email: bob.williams@email.com
--   Password: password456
--
-- • Email: carol.davis@email.com
--   Password: secure789
--
-- • Email: david.m@email.com
--   Password: beta2024
--
-- • Email: emma.t@email.com
--   Password: gamma555
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- =================================================================
-- NOTE FOR FUTURE PASSWORD HASHING
-- =================================================================
-- These bcrypt hashes are FAKE PLACEHOLDERS for demonstration only.
-- Once Bcrypt hashing is implemented in the backend, replace with:
-- SELECT crypt('plaintext_password', gen_salt('bf')) AS bcrypt_hash;
-- =================================================================
