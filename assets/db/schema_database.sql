-- -----------------------------------------------------
-- 1. Clean up existing tables (for development/testing)
-- -----------------------------------------------------
DROP TABLE IF EXISTS lpa_invoice_items CASCADE;
DROP TABLE IF EXISTS lpa_invoices CASCADE;
DROP TABLE IF EXISTS lpa_clients CASCADE;
DROP TABLE IF EXISTS lpa_stock CASCADE;
DROP TABLE IF EXISTS lpa_users CASCADE;

-- -----------------------------------------------------
-- 2. Table: lpa_users (Internal Staff)
-- -----------------------------------------------------
CREATE TABLE lpa_users (
    lpa_user_ID         VARCHAR(20) PRIMARY KEY,
    lpa_user_username   VARCHAR(30) NOT NULL UNIQUE,
    lpa_user_password   VARCHAR(255) NOT NULL, -- Increased to 255 for Bcrypt safety
    lpa_user_firstname  VARCHAR(50),
    lpa_user_lastname   VARCHAR(50),
    lpa_user_group      VARCHAR(20) DEFAULT 'user', -- 'admin' or 'user'
    lpa_user_status     CHAR(1) DEFAULT 'A',        -- 'A'ctive, 'D'isabled
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint to ensure status is valid
    CONSTRAINT check_user_status CHECK (lpa_user_status IN ('A', 'D'))
);

-- -----------------------------------------------------
-- 3. Table: lpa_stock (Product Catalog)
-- -----------------------------------------------------
CREATE TABLE lpa_stock (
    lpa_stock_ID        VARCHAR(20) PRIMARY KEY, -- SKU
    lpa_stock_name      VARCHAR(250) NOT NULL,
    lpa_stock_desc      TEXT,
    lpa_stock_onhand    VARCHAR(10) DEFAULT '0', -- VARCHAR as per requirement (Suggest casting to INT in app)
    lpa_stock_price     DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    lpa_stock_status    CHAR(1) DEFAULT 'A',
    lpa_stock_image_url VARCHAR(255),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_stock_status CHECK (lpa_stock_status IN ('A', 'D'))
);

-- -----------------------------------------------------
-- 4. Table: lpa_clients (Customers)
-- -----------------------------------------------------
CREATE TABLE lpa_clients (
    lpa_client_ID       VARCHAR(20) PRIMARY KEY,
    lpa_client_firstname VARCHAR(50) NOT NULL,
    lpa_client_lastname  VARCHAR(50) NOT NULL,
    lpa_client_address   VARCHAR(250),
    lpa_client_phone     VARCHAR(30),
    lpa_client_email     VARCHAR(100) NOT NULL UNIQUE, -- Essential for Auth
    lpa_client_password  VARCHAR(255) NOT NULL,        -- Hash storage
    lpa_client_status    CHAR(1) DEFAULT 'A',
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_client_status CHECK (lpa_client_status IN ('A', 'D'))
);

-- -----------------------------------------------------
-- 5. Table: lpa_invoices (Order Header)
-- -----------------------------------------------------
CREATE TABLE lpa_invoices (
    lpa_inv_no           VARCHAR(20) PRIMARY KEY,
    lpa_inv_date         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lpa_inv_client_ID    VARCHAR(20) NOT NULL,
    
    -- SNAPSHOT FIELDS (Historical Data)
    lpa_inv_client_name    VARCHAR(100), -- Snapshot of First + Last name
    lpa_inv_client_address VARCHAR(250), -- Snapshot of address at time of order
    
    lpa_inv_amount       DECIMAL(12, 2) NOT NULL DEFAULT 0.00, -- Increased precision for totals
    lpa_inv_status       CHAR(1) DEFAULT 'U', -- 'P'aid, 'U'npaid, 'S'hipped
    
    -- Foreign Key Relationship
    CONSTRAINT fk_invoice_client 
        FOREIGN KEY (lpa_inv_client_ID) 
        REFERENCES lpa_clients (lpa_client_ID)
        ON DELETE RESTRICT -- Prevents deleting a client if they have invoices
);

-- -----------------------------------------------------
-- 6. Table: lpa_invoice_items (Order Lines)
-- -----------------------------------------------------
CREATE TABLE lpa_invoice_items (
    lpa_invitem_no           VARCHAR(20) PRIMARY KEY,
    lpa_invitem_inv_no       VARCHAR(20) NOT NULL,
    lpa_invitem_stock_ID     VARCHAR(20) NOT NULL,
    
    -- SNAPSHOT FIELDS (Historical Data)
    lpa_invitem_stock_name   VARCHAR(250),  -- Snapshot of product name
    lpa_invitem_stock_price  DECIMAL(10, 2), -- Snapshot of price at moment of sale
    
    lpa_invitem_qty          VARCHAR(10),   -- Quantity (VARCHAR per requirement)
    lpa_invitem_stock_amount DECIMAL(12, 2), -- Calculated Line Total
    
    -- Foreign Key Relationships
    CONSTRAINT fk_item_invoice 
        FOREIGN KEY (lpa_invitem_inv_no) 
        REFERENCES lpa_invoices (lpa_inv_no)
        ON DELETE CASCADE, -- If invoice is deleted, items go with it
        
    CONSTRAINT fk_item_stock 
        FOREIGN KEY (lpa_invitem_stock_ID) 
        REFERENCES lpa_stock (lpa_stock_ID)
        ON DELETE RESTRICT -- Cannot delete a product if it exists in an invoice
);

-- -----------------------------------------------------
-- 7. Create Indexes (Performance Optimization)
-- -----------------------------------------------------
-- Indexes on Foreign Keys are crucial for join performance
CREATE INDEX idx_inv_client_id ON lpa_invoices(lpa_inv_client_ID);
CREATE INDEX idx_item_inv_no ON lpa_invoice_items(lpa_invitem_inv_no);
CREATE INDEX idx_item_stock_id ON lpa_invoice_items(lpa_invitem_stock_ID);