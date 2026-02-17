-- =====================================================
-- LPA eComms Database Schema
-- MySQL Database Script
-- Generated from ERDiagram Model
-- =====================================================

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS lpa_invoice_items;
DROP TABLE IF EXISTS lpa_invoices;
DROP TABLE IF EXISTS lpa_clients;
DROP TABLE IF EXISTS lpa_stock;
DROP TABLE IF EXISTS lpa_users;

-- =====================================================
-- Table: lpa_stock (Product Catalog)
-- Description: Represents the inventory of physical 
--              electronics available for sale
-- =====================================================
CREATE TABLE lpa_stock (
    lpa_stock_ID VARCHAR(20) NOT NULL PRIMARY KEY COMMENT 'Unique identifier (SKU)',
    lpa_stock_name VARCHAR(250) NOT NULL COMMENT 'Product Name',
    lpa_stock_desc TEXT COMMENT 'Full Description',
    lpa_stock_onhand VARCHAR(5) NOT NULL DEFAULT '0' COMMENT 'Inventory Count (on-hand quantity)',
    lpa_stock_price DECIMAL(7,2) NOT NULL COMMENT 'Unit Price',
    lpa_stock_status CHAR(1) NOT NULL DEFAULT 'A' COMMENT 'A=Active, D=Disabled',
    lpa_stock_image_url VARCHAR(500) COMMENT 'Product Image Path URL',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Audit Timestamp',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last Update Timestamp',
    
    -- Constraints
    CONSTRAINT chk_stock_price CHECK (lpa_stock_price >= 0),
    CONSTRAINT chk_stock_status CHECK (lpa_stock_status IN ('A', 'D')),
    UNIQUE KEY unique_stock_id (lpa_stock_ID),
    
    INDEX idx_stock_status (lpa_stock_status),
    INDEX idx_stock_name (lpa_stock_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Product Catalog - Electronics Inventory';

-- =====================================================
-- Table: lpa_clients (Customers)
-- Description: Represents external users who register 
--              on the website to purchase items
-- =====================================================
CREATE TABLE lpa_clients (
    lpa_client_ID VARCHAR(20) NOT NULL PRIMARY KEY COMMENT 'Unique Client ID',
    lpa_client_firstname VARCHAR(50) NOT NULL COMMENT 'Customer First Name',
    lpa_client_lastname VARCHAR(50) NOT NULL COMMENT 'Customer Last Name',
    lpa_client_address VARCHAR(250) COMMENT 'Shipping Address',
    lpa_client_phone VARCHAR(30) COMMENT 'Contact Phone Number',
    lpa_client_email VARCHAR(100) NOT NULL UNIQUE COMMENT 'Email Address (Unique, for Authentication)',
    lpa_client_password VARCHAR(255) NOT NULL COMMENT 'Hashed Password (Bcrypt)',
    lpa_client_status CHAR(1) NOT NULL DEFAULT 'A' COMMENT 'A=Active, D=Disabled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Registration Date',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last Update Timestamp',
    
    -- Constraints
    CONSTRAINT chk_client_status CHECK (lpa_client_status IN ('A', 'D')),
    UNIQUE KEY unique_client_email (lpa_client_email),
    
    INDEX idx_client_status (lpa_client_status),
    INDEX idx_client_email (lpa_client_email),
    INDEX idx_client_name (lpa_client_firstname, lpa_client_lastname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Customer Accounts and Shipping Details';

-- =====================================================
-- Table: lpa_users (Internal Staff)
-- Description: Represents internal staff members who 
--              access the Desktop Administrative Application
-- =====================================================
CREATE TABLE lpa_users (
    lpa_user_ID VARCHAR(20) NOT NULL PRIMARY KEY COMMENT 'Unique User ID',
    lpa_user_username VARCHAR(30) NOT NULL UNIQUE COMMENT 'Login Username',
    lpa_user_password VARCHAR(255) NOT NULL COMMENT 'Hashed Password (Bcrypt)',
    lpa_user_firstname VARCHAR(50) NOT NULL COMMENT 'Staff First Name',
    lpa_user_lastname VARCHAR(50) NOT NULL COMMENT 'Staff Last Name',
    lpa_user_group VARCHAR(50) NOT NULL DEFAULT 'user' COMMENT 'Permission Group: admin or user',
    lpa_user_status CHAR(1) NOT NULL DEFAULT 'A' COMMENT 'A=Active, D=Disabled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation Date',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last Update Timestamp',
    
    -- Constraints
    CONSTRAINT chk_user_status CHECK (lpa_user_status IN ('A', 'D')),
    CONSTRAINT chk_user_group CHECK (lpa_user_group IN ('admin', 'user')),
    UNIQUE KEY unique_user_username (lpa_user_username),
    
    INDEX idx_user_status (lpa_user_status),
    INDEX idx_user_group (lpa_user_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Internal Staff Access Control (RBAC)';

-- =====================================================
-- Table: lpa_invoices (Orders / Sales Transactions)
-- Description: Represents the header information of a 
--              completed sales transaction
-- =====================================================
CREATE TABLE lpa_invoices (
    lpa_inv_no VARCHAR(20) NOT NULL PRIMARY KEY COMMENT 'Unique Invoice Number',
    lpa_inv_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Transaction Date and Time',
    lpa_inv_client_ID VARCHAR(20) NOT NULL COMMENT 'Link to Client (Foreign Key)',
    lpa_inv_client_name VARCHAR(100) NOT NULL COMMENT 'Snapshot: Client Name at Purchase',
    lpa_inv_client_address VARCHAR(250) COMMENT 'Snapshot: Shipping Address at Purchase',
    lpa_inv_amount DECIMAL(8,2) NOT NULL DEFAULT 0 COMMENT 'Total Order Value',
    lpa_inv_status CHAR(1) NOT NULL DEFAULT 'U' COMMENT 'P=Paid, U=Unpaid, S=Shipped, C=Cancelled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Record Creation Timestamp',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last Update Timestamp',
    
    -- Foreign Key Constraints
    CONSTRAINT fk_invoice_client FOREIGN KEY (lpa_inv_client_ID) 
        REFERENCES lpa_clients(lpa_client_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Constraints
    CONSTRAINT chk_invoice_amount CHECK (lpa_inv_amount >= 0),
    CONSTRAINT chk_invoice_status CHECK (lpa_inv_status IN ('P', 'U', 'S', 'C')),
    
    INDEX idx_invoice_date (lpa_inv_date),
    INDEX idx_invoice_status (lpa_inv_status),
    INDEX idx_invoice_client_id (lpa_inv_client_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Sales Transactions (Orders)';

-- =====================================================
-- Table: lpa_invoice_items (Order Line Items)
-- Description: Represents the specific products included 
--              within a single invoice (Order-Product bridge)
-- =====================================================
CREATE TABLE lpa_invoice_items (
    lpa_invitem_no VARCHAR(20) NOT NULL PRIMARY KEY COMMENT 'Unique Line Item ID',
    lpa_invitem_inv_no VARCHAR(20) NOT NULL COMMENT 'Link to Invoice (Foreign Key)',
    lpa_invitem_stock_ID VARCHAR(20) NOT NULL COMMENT 'Link to Original Stock (Foreign Key)',
    lpa_invitem_stock_name VARCHAR(250) NOT NULL COMMENT 'Snapshot: Product Name at Purchase',
    lpa_invitem_qty VARCHAR(6) NOT NULL COMMENT 'Quantity Purchased',
    lpa_invitem_stock_price DECIMAL(7,2) NOT NULL COMMENT 'Snapshot: Unit Price at Purchase',
    lpa_invitem_stock_amount DECIMAL(10,2) NOT NULL COMMENT 'Line Total (Qty * Price)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Record Creation Timestamp',
    
    -- Foreign Key Constraints
    CONSTRAINT fk_invitem_invoice FOREIGN KEY (lpa_invitem_inv_no) 
        REFERENCES lpa_invoices(lpa_inv_no) ON DELETE CASCADE ON UPDATE CASCADE,
    
    CONSTRAINT fk_invitem_stock FOREIGN KEY (lpa_invitem_stock_ID) 
        REFERENCES lpa_stock(lpa_stock_ID) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Constraints
    CONSTRAINT chk_invitem_qty CHECK (CAST(lpa_invitem_qty AS SIGNED) > 0),
    CONSTRAINT chk_invitem_price CHECK (lpa_invitem_stock_price >= 0),
    CONSTRAINT chk_invitem_amount CHECK (lpa_invitem_stock_amount >= 0),
    
    INDEX idx_invitem_inv_no (lpa_invitem_inv_no),
    INDEX idx_invitem_stock_id (lpa_invitem_stock_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Order Line Items (Product-Order Bridge)';

-- =====================================================
-- Relationships Summary
-- =====================================================
-- lpa_clients ||--o{ lpa_invoices : "places"
-- lpa_invoices ||--|{ lpa_invoice_items : "contains"
-- lpa_stock ||--o{ lpa_invoice_items : "listed_as"
-- =====================================================

-- =====================================================
-- Sample Insert Statements (Optional - for testing)
-- =====================================================

-- Insert sample stock items
INSERT INTO lpa_stock (lpa_stock_ID, lpa_stock_name, lpa_stock_desc, lpa_stock_onhand, lpa_stock_price, lpa_stock_status, lpa_stock_image_url)
VALUES 
    ('SKU-001', 'Laptop Dell XPS 13', 'High-performance ultrabook with 13.3 inch FHD display', '15', 999.99, 'A', '/images/laptop-dell-xps-13.jpg'),
    ('SKU-002', 'iPhone 14 Pro', 'Latest Apple smartphone with A16 Bionic chip', '25', 1099.00, 'A', '/images/iphone-14-pro.jpg'),
    ('SKU-003', 'Samsung 4K TV 55"', '55 inch QLED television with quantum dot technology', '8', 799.99, 'A', '/images/samsung-tv-55.jpg'),
    ('SKU-004', 'Wireless Headphones Sony', 'Noise-cancelling Bluetooth headphones', '50', 249.99, 'A', '/images/sony-headphones.jpg'),
    ('SKU-005', 'USB-C Charging Cable', 'Fast charging USB-C cable 3m', '200', 15.99, 'A', '/images/usb-c-cable.jpg');

-- Insert sample customers
INSERT INTO lpa_clients (lpa_client_ID, lpa_client_firstname, lpa_client_lastname, lpa_client_address, lpa_client_phone, lpa_client_email, lpa_client_password, lpa_client_status)
VALUES 
    ('CLI-001', 'Juan', 'García', '123 Main Street, Madrid', '+34 91 123 4567', 'juan.garcia@example.com', '$2b$10$hashedpassword1', 'A'),
    ('CLI-002', 'María', 'López', '456 Oak Avenue, Barcelona', '+34 93 234 5678', 'maria.lopez@example.com', '$2b$10$hashedpassword2', 'A');

-- Insert sample admin users
INSERT INTO lpa_users (lpa_user_ID, lpa_user_username, lpa_user_password, lpa_user_firstname, lpa_user_lastname, lpa_user_group, lpa_user_status)
VALUES 
    ('USR-001', 'admin', '$2b$10$adminhashedpass', 'Admin', 'System', 'admin', 'A'),
    ('USR-002', 'manager', '$2b$10$managerhashedpass', 'Stock', 'Manager', 'user', 'A');

-- =====================================================
-- End of Database Schema Script
-- =====================================================
