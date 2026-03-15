INSERT INTO lpa_stock (id, sku, name, description, onhand, price, status, image_url) VALUES
(1001, 'SKU-CTI-LAP-1001', 'Lenovo ThinkPad E14 Gen 5', '14-inch business laptop, Intel Core i5, 16GB RAM, 512GB SSD', 18, 1299.99, 'A', NULL),
(1002, 'SKU-CTI-AUD-1002', 'Sony WH-1000XM5', 'Wireless noise-canceling over-ear headphones', 30, 249.75, 'A', NULL),
(1003, 'SKU-CTI-MON-1003', 'Dell UltraSharp U2723QE', '27-inch 4K IPS monitor with USB-C hub', 12, 479.90, 'A', NULL),
(1004, 'SKU-CTI-RAM-1004', 'Corsair Vengeance DDR5 32GB', 'DDR5 memory kit 32GB (2x16GB) 5600MHz', 22, 149.50, 'A', NULL),
(1005, 'SKU-CTI-SSD-1005', 'Samsung 980 PRO 1TB', 'NVMe PCIe 4.0 SSD 1TB', 40, 89.95, 'A', NULL);

-- Password is: password123
INSERT INTO lpa_users (id, username, password, firstname, lastname, role, status) VALUES
(2001, 'cti_admin', '$2b$12$SomeFakeHashedPasswordString1234567890', 'System', 'Admin', 'admin', 'A');

-- Password is: password123
INSERT INTO lpa_clients (id, firstname, lastname, address, phone, email, password, status) VALUES
(3001, 'Alice', 'Johnson', '123 Market St, San Francisco, CA 94105', '415-555-0101', 'alice.johnson@cti.test', '$2b$12$SomeFakeHashedPasswordString1234567890', 'A'),
(3002, 'Bob', 'Williams', '456 Castro St, Mountain View, CA 94041', '650-555-0102', 'bob.williams@cti.test', '$2b$12$SomeFakeHashedPasswordString1234567890', 'A');

INSERT INTO lpa_invoices (id, invoice_number, client_id, client_name, client_address, amount, status) VALUES
(4001, 'INV-CTI-4001', 3001, 'Alice Johnson', '123 Market St, San Francisco, CA 94105', 1598.99, 'P'),
(4002, 'INV-CTI-4002', 3002, 'Bob Williams', '456 Castro St, Mountain View, CA 94041', 769.35, 'U');

INSERT INTO lpa_invoice_items (id, invoice_id, stock_id, stock_name, price, quantity, subtotal) VALUES
(5001, 4001, 1001, 'Lenovo ThinkPad E14 Gen 5', 1299.99, 1, 1299.99),
(5002, 4001, 1004, 'Corsair Vengeance DDR5 32GB', 149.50, 2, 299.00),
(5003, 4002, 1002, 'Sony WH-1000XM5', 249.75, 2, 499.50),
(5004, 4002, 1005, 'Samsung 980 PRO 1TB', 89.95, 3, 269.85);
