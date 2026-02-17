-- =================================================================
-- DATABASE SCHEMA FOR LPA PROJECT
-- Platform: PostgreSQL
-- Generated: 2026-02-17
-- =================================================================

-- 1. Clean up previous iterations
DROP TABLE IF EXISTS lpa_invoice_items CASCADE;
DROP TABLE IF EXISTS lpa_invoices CASCADE;
DROP TABLE IF EXISTS lpa_clients CASCADE;
DROP TABLE IF EXISTS lpa_stock CASCADE;
DROP TABLE IF EXISTS lpa_users CASCADE;

-- ==========================================
-- 2. Table: lpa_users (Internal Staff)
-- ==========================================
CREATE TABLE lpa_users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(50) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,    -- Secure Hash (Bcrypt/Argon2)
    firstname       VARCHAR(50),
    lastname        VARCHAR(50),
    role            VARCHAR(20) DEFAULT 'user', -- Renamed from 'group'
    status          CHAR(1) DEFAULT 'A',      -- 'A'ctive, 'D'isabled
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Validation Constraints
    CONSTRAINT check_user_status CHECK (status IN ('A', 'D'))
);

-- ==========================================
-- 3. Table: lpa_stock (Inventory)
-- ==========================================
CREATE TABLE lpa_stock (
    id              SERIAL PRIMARY KEY,
    sku             VARCHAR(50) NOT NULL UNIQUE, -- Original "Stock ID"
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    onhand          INTEGER DEFAULT 0,        -- Mathematical safety
    price           DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status          CHAR(1) DEFAULT 'A',
    image_url       VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Validation Constraints
    CONSTRAINT check_stock_positive CHECK (onhand >= 0),
    CONSTRAINT check_price_positive CHECK (price >= 0),
    CONSTRAINT check_stock_status CHECK (status IN ('A', 'D'))
);

-- ==========================================
-- 4. Table: lpa_clients (Customers)
-- ==========================================
CREATE TABLE lpa_clients (
    id              SERIAL PRIMARY KEY,
    firstname       VARCHAR(50) NOT NULL,
    lastname        VARCHAR(50) NOT NULL,
    address         VARCHAR(255),
    phone           VARCHAR(30),
    email           VARCHAR(100) NOT NULL UNIQUE, -- Auth Key
    password        VARCHAR(255) NOT NULL,
    status          CHAR(1) DEFAULT 'A',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Validation Constraints
    CONSTRAINT check_client_status CHECK (status IN ('A', 'D'))
);

-- ==========================================
-- 5. Table: lpa_invoices (Order Header)
-- ==========================================
CREATE TABLE lpa_invoices (
    id              SERIAL PRIMARY KEY,
    invoice_number  VARCHAR(50) NOT NULL UNIQUE, -- E.g. "INV-2026-001"
    client_id       INTEGER NOT NULL,
    
    -- Historical Snapshots (Data at time of purchase)
    client_name     VARCHAR(100),
    client_address  VARCHAR(255),
    
    amount          DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status          CHAR(1) DEFAULT 'U', -- P=Paid, U=Unpaid, S=Shipped
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Relationships
    CONSTRAINT fk_invoice_client 
        FOREIGN KEY (client_id) REFERENCES lpa_clients (id) 
        ON DELETE RESTRICT -- Protects invoice history if client is deleted
);

-- ==========================================
-- 6. Table: lpa_invoice_items (Order Lines)
-- ==========================================
CREATE TABLE lpa_invoice_items (
    id              SERIAL PRIMARY KEY,
    invoice_id      INTEGER NOT NULL,
    stock_id        INTEGER NOT NULL,
    
    -- Historical Snapshots (Price/Name at time of purchase)
    stock_name      VARCHAR(255),
    price           DECIMAL(10, 2) NOT NULL,
    
    quantity        INTEGER NOT NULL,
    subtotal        DECIMAL(12, 2) NOT NULL,
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Validation Constraints
    CONSTRAINT check_qty_positive CHECK (quantity > 0),

    -- Relationships
    CONSTRAINT fk_item_invoice 
        FOREIGN KEY (invoice_id) REFERENCES lpa_invoices (id) 
        ON DELETE CASCADE, -- Deleting an invoice deletes its items
        
    CONSTRAINT fk_item_stock 
        FOREIGN KEY (stock_id) REFERENCES lpa_stock (id) 
        ON DELETE RESTRICT -- Cannot delete a product that has been sold
);

-- ==========================================
-- 7. Performance Indexes
-- ==========================================
-- Speed up queries that join tables
CREATE INDEX idx_invoices_client ON lpa_invoices(client_id);
CREATE INDEX idx_items_invoice   ON lpa_invoice_items(invoice_id);
CREATE INDEX idx_items_stock     ON lpa_invoice_items(stock_id);

-- Speed up search on common fields
CREATE INDEX idx_stock_sku       ON lpa_stock(sku);
CREATE INDEX idx_clients_email   ON lpa_clients(email);