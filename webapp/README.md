# CTI ADP Software - LPA Admin Web Application

A web-based inventory and sales management application built with PHP and PostgreSQL.

## 📋 Overview

The LPA Admin application is a comprehensive management system that enables:
- **User authentication** with role-based access control
- **Inventory management** (Stock Management)
- **Sales management** (Sales Management)
- **Logging system** for action auditing

## 🛠️ Prerequisites

- **PHP 7.4+** (PHP 8.0+ recommended)
- **PostgreSQL 10+**
- **XAMPP** or web server compatible with PHP
- **Modern browser** with ES6 support

### Required PHP Extensions

The application requires the following PHP extensions to be enabled:

1. **pgsql** - For PostgreSQL connection
2. **pdo_pgsql** - For PDO support with PostgreSQL (optional but recommended)

## 📦 Directory Structure

```
webapp/
├── app-lib.php              # Main application library
├── database.php             # Database connection functions
├── database_credentials.php # Database credentials
├── functions.php            # General utility functions
├── header.php               # HTML header template
├── footer.php               # HTML footer template
├── index.php                # Home page (requires authentication)
├── login.php                # Login page
├── sales.php                # Sales management page
├── stock.php                # Inventory management page
├── stockaddedit.php         # Form to add/edit stock items
├── query_functions.php      # Database query functions
├── css/                     # CSS styles
│   ├── bootstrap.min.css
│   ├── bootstrap.rtl.min.css
│   └── style.css
├── js/                      # JavaScript scripts
│   ├── jquery-3.1.1.min.js
│   ├── bootstrap.min.js
│   └── script.js
├── log/                     # Logs directory
│   ├── lpa.log
│   └── lpalog.log
└── templates/               # Page templates
    └── sales_search.php
```

## 🔧 Installation

### 1. Enable PostgreSQL Extension in PHP (XAMPP)

#### On Windows:

1. **Edit the `php.ini` file** located at `C:\xampp\php\php.ini`

2. **Find the line**:
   ```ini
   ;extension=pgsql
   ```

3. **Uncomment the line** (remove the semicolon):
   ```ini
   extension=pgsql
   ```

4. **Also find**:
   ```ini
   ;extension=pdo_pgsql
   ```

5. **Uncomment the line**:
   ```ini
   extension=pdo_pgsql
   ```

6. **Restart Apache** from the XAMPP Control Panel

#### Verify PostgreSQL is enabled:

Create a file `test_pgsql.php` in the `webapp` directory:

```php
<?php
if (extension_loaded('pgsql')) {
    echo "✓ PostgreSQL extension is enabled";
} else {
    echo "✗ PostgreSQL extension is NOT enabled";
}
?>
```

Access `http://localhost/cti-adp-software/webapp/test_pgsql.php` in your browser.

### 2. Configure Database Credentials

The file `database_credentials.php` is already configured with the following values:

```php
<?php
/** Database credentials for PostgreSQL */

define('DB_HOST', "localhost");
define('DB_PORT', 5433);
define('DB_USER', "cti_user");
define('DB_PASSWORD', "cti_password_dev");
define('DB_NAME', "cti_ecommerce");
define('DB_SCHEMA', "public");
?>
```

**PostgreSQL Connection String**: `postgresql://cti_user:cti_password_dev@localhost:5433/cti_ecommerce?schema=public`

### 3. PostgreSQL Database Structure

Ensure your PostgreSQL database has the following tables:

#### Table: `lpa_users`
```sql
CREATE TABLE lpa_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table: `lpa_invoices`
```sql
CREATE TABLE lpa_invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(255),
    client_address TEXT,
    amount DECIMAL(10, 2),
    status CHAR(1) DEFAULT 'A',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table: `lpa_stock`
```sql
CREATE TABLE lpa_stock (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    onhand INTEGER,
    status VARCHAR(20),
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Security Configuration

### Example Credentials:
- **User**: user with `administrator` role
- **Password**: Must be hashed using PHP's `password_hash()`

### Role System:
- `administrator` - Full access to all features
- `user` - Limited access to read-only data

## 🚀 Application Usage

### Login
1. Access `http://localhost/cti-adp-software/webapp/login.php`
2. Enter your username and password
3. You will be redirected to the home page

### Main Dashboard
- Personalized welcome message
- Navigation to other modules

### Stock Module
- Search products in inventory
- Add new products
- Edit existing products
- View price and available quantity

### Sales Module
- Search invoices/sales
- Search by:
  - Invoice number
  - Client name
  - Client address
- View total sales

## 📝 Important Files

### `database.php`
Defines main functions for PostgreSQL connection:
- `openDB()` - Opens database connection
- `closeDB()` - Closes the connection
- `db_escape()` - Escapes special characters
- `array_db_escape()` - Escapes array of values

**PostgreSQL functions used:**
- `pg_connect()` - Connection
- `pg_query()` - Execute query
- `pg_fetch_assoc()` - Get result as associative array
- `pg_num_rows()` - Count rows
- `pg_free_result()` - Free result
- `pg_escape_string()` - Escape strings

### `query_functions.php`
Contains specific query functions:
- `query_with_check()` - Executes query with validation
- `search_sales()` - Sales search functionality

### `app-lib.php`
Central library that includes:
- Session system
- UI building functions
- Logging system (`lpa_log()`)
- HTML table generation

## 🔍 Logging System

The application maintains a record in `log/lpalog.log` of:
- Successful login attempts
- Failed login attempts
- Authenticated user actions

Log format:
```
LOG - IP address: 192.168.1.100
13/04/2026 14:30:45 - User john_doe successfully logged in.
----------------
```

## ⚠️ Common Error Resolution

### Error: "Call to undefined function pg_connect()"
**Solution**: Enable the `pgsql` extension in `php.ini` and restart Apache.

**Detailed steps:**
1. Open `C:\xampp\php\php.ini`
2. Find `;extension=pgsql` and `;extension=pdo_pgsql`
3. Remove the semicolon at the beginning: `extension=pgsql`
4. Save the file
5. Restart Apache from XAMPP Control Panel

### Error: "resource" is not a supported builtin type
**Solution**: Update return types of functions. Change `: resource` to no specific type.

**This error has already been fixed in the updated version.**

### Error: "Failed to connect to PostgreSQL"
**Verify:**
1. PostgreSQL is running on port 5433
2. Correct credentials in `database_credentials.php`
3. Database `cti_ecommerce` exists
4. User `cti_user` has proper permissions

**Test command in PostgreSQL:**
```sql
\c cti_ecommerce cti_user
```

### Error: "Undefined function lpa_log()"
**Solution**: Ensure that `app-lib.php` is required before use.

The function is defined in `app-lib.php` and is automatically included.

## 🔐 Recommended Security Improvements

1. **Use Prepared Statements**: Replace string interpolation with prepared statements
   ```php
   $query = "SELECT * FROM lpa_users WHERE username = $1";
   $result = pg_query_params($db, $query, array($username));
   ```

2. **Password Hashing**: Use `password_hash()` instead of storing plain text

3. **Input Validation**: Validate and sanitize all user inputs

4. **HTTPS**: Implement SSL/TLS certificates in production

5. **Session Control**: Implement session expiration

## 📊 Application Flow

```
login.php (No authentication required)
    ↓
  [Valid authentication]
    ↓
index.php (Dashboard)
    ├─→ stock.php (Inventory Management)
    │   └─→ stockaddedit.php (Add/Edit)
    ├─→ sales.php (Sales Management)
    │   └─→ templates/sales_search.php
    └─→ [Logout]
```

## 🛠️ Main Functions

### Authentication
- Login with username/password
- Session system
- Role control (admin/user)

### Database
- Persistent PostgreSQL connection
- Character escaping
- Error handling

### UI
- Main navigation
- Dynamic tables
- Responsive forms
- Bootstrap for responsive design

## 📈 Future Extensions

- Implement REST API
- Add more reports
- Dashboard with graphics
- PDF/Excel export
- Granular permission system

## 📞 Support

To report bugs or request features:
1. Check logs in `log/lpalog.log`
2. Check browser console (F12)
3. Validate database connection

## 📄 License

Developed for CTI ADP Software.

---

**Last Updated**: April 2026  
**Version**: 1.0  
**Status**: PostgreSQL migrated from MySQL

