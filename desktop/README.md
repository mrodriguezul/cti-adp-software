# Stock Management System - JavaFX Application

A comprehensive desktop application for managing product inventory using JavaFX and MySQL, built with Domain-Driven Design (DDD) principles.

## 🏗️ Architecture

This application follows **Domain-Driven Design (DDD)** structure with clear separation of concerns:

```
stock-management/
├── src/main/java/com/stockmanagement/
│   ├── domain/                          # Domain Layer (Business Logic)
│   │   ├── model/
│   │   │   └── Stock.java              # Domain Entity with business rules
│   │   └── repository/
│   │       └── StockRepository.java    # Repository interface
│   │
│   ├── application/                     # Application Layer (Use Cases)
│   │   └── service/
│   │       └── StockService.java       # Application services
│   │
│   ├── infrastructure/                  # Infrastructure Layer (Technical Details)
│   │   ├── config/
│   │   │   └── DatabaseConfig.java     # Database configuration
│   │   └── persistence/
│   │       └── MySQLStockRepository.java # Repository implementation
│   │
│   ├── presentation/                    # Presentation Layer (UI)
│   │   └── controller/
│   │       └── StockController.java    # JavaFX controller
│   │
│   └── StockManagementApp.java         # Main application entry point
│
└── src/main/resources/
    ├── com/stockmanagement/presentation/
    │   ├── view/
    │   │   └── stock-view.fxml         # UI layout
    │   └── style/
    │       └── styles.css              # Application styles
    └── database.properties              # Database configuration
```

## 🎯 SOLID Principles Applied

### 1. **Single Responsibility Principle (SRP)**
- `Stock`: Contains only business logic and validations
- `StockService`: Handles application use cases
- `MySQLStockRepository`: Manages database operations only
- `StockController`: Handles UI logic only

### 2. **Open/Closed Principle (OCP)**
- `StockRepository` interface allows extension without modification
- Easy to add new repository implementations (e.g., PostgreSQL, MongoDB)

### 3. **Liskov Substitution Principle (LSP)**
- Any implementation of `StockRepository` can replace `MySQLStockRepository`
- Service layer depends on interface, not concrete implementation

### 4. **Interface Segregation Principle (ISP)**
- `StockRepository` interface contains only necessary methods
- No client is forced to depend on methods it doesn't use

### 5. **Dependency Inversion Principle (DIP)**
- `StockService` depends on `StockRepository` interface (abstraction)
- High-level modules don't depend on low-level modules
- Dependency injection used throughout

## 🔄 DRY Principle

- Database connection logic centralized in `DatabaseConfig`
- SQL queries defined as constants to avoid repetition
- Helper methods for common operations (e.g., `mapResultSetToStock`)
- Reusable validation methods in domain entity

## 📋 Features

### CRUD Operations
- ✅ **Create**: Add new products to stock
- ✅ **Read**: View all products with detailed information
- ✅ **Update**: Modify existing product details
- ✅ **Delete**: Remove products from inventory

### Additional Features
- 🔍 **Search**: Real-time search by product name
- 📊 **Sorting**: Sort by various columns
- 🎨 **Modern UI**: Clean, responsive interface
- ✔️ **Validation**: Input validation with user-friendly error messages
- 🔄 **Auto-refresh**: Automatic table updates after operations

## 🗄️ Database Schema

```sql
CREATE TABLE `lpa_stock` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `product_name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `quantity` int(11) NOT NULL DEFAULT 0,
    `price` decimal(10,2) NOT NULL DEFAULT 0.00,
    `category` varchar(100) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## 🚀 Setup Instructions

### Prerequisites
- Java JDK 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher
- JavaFX SDK (managed by Maven)

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE stock_management;
USE stock_management;
```

2. Create the `lpa_stock` table using the schema above.

3. Add the PRIMARY KEY constraint if not included:
```sql
ALTER TABLE `lpa_stock` ADD PRIMARY KEY (`id`);
ALTER TABLE `lpa_stock` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
```

### Application Configuration

1. **Update database credentials** in `src/main/resources/database.properties`:
```properties
db.url=jdbc:mysql://localhost:3306/stock_management?useSSL=false&serverTimezone=UTC
db.username=your_username
db.password=your_password
```

2. **Build the project**:
```bash
cd stock-management
mvn clean install
```

3. **Run the application**:
```bash
mvn javafx:run
```

Or create an executable JAR:
```bash
mvn clean package
java -jar target/stock-management-1.0-SNAPSHOT.jar
```

## 📦 Dependencies

- **JavaFX 21**: UI framework
- **MySQL Connector/J 8.2.0**: MySQL database driver
- **HikariCP 5.1.0**: High-performance connection pool

## 🎨 UI Components

### Main Window
- **Table View**: Displays all stock items with columns:
  - ID, Product Name, Description, Quantity, Price, Category
  - Created At, Updated At timestamps
  
- **Form Panel**: Input fields for stock details
  - Product Name (required)
  - Description
  - Quantity (required)
  - Price (required)
  - Category

- **Action Buttons**:
  - **Save New**: Create new stock item
  - **Update Selected**: Update selected item
  - **Delete Selected**: Delete selected item
  - **Clear Form**: Reset all fields

- **Search Bar**: Real-time filtering by product name

## 🔧 Usage Guide

### Adding a New Product
1. Fill in the form fields (Product Name, Quantity, and Price are required)
2. Click "Save New" button
3. The product appears in the table

### Updating a Product
1. Select a product from the table (click on row)
2. Modify the fields in the form
3. Click "Update Selected" button
4. Changes are reflected in the table

### Deleting a Product
1. Select a product from the table
2. Click "Delete Selected" button
3. Confirm deletion in the dialog
4. Product is removed from the table

### Searching Products
1. Type in the search field at the top
2. Table automatically filters to show matching products
3. Clear search field to show all products

## 🔐 Business Rules (Domain Logic)

The `Stock` entity enforces the following business rules:
- Product name cannot be empty or exceed 255 characters
- Quantity cannot be negative
- Price cannot be negative
- Stock operations validate amounts before execution

## 🏛️ Design Patterns Used

1. **Repository Pattern**: Abstracts data access layer
2. **Dependency Injection**: Loose coupling between layers
3. **Factory Pattern**: Controller factory for dependency injection
4. **Singleton Pattern**: Database configuration instance
5. **MVC Pattern**: Separation of concerns in presentation layer

## 📝 Code Quality

- ✅ Clean code principles
- ✅ Meaningful variable and method names
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Javadoc documentation
- ✅ Consistent code formatting

## 🔄 Extending the Application

### Adding a New Repository Implementation
```java
public class PostgreSQLStockRepository implements StockRepository {
    // Implement all interface methods for PostgreSQL
}
```

### Adding New Domain Methods
```java
// In Stock.java
public boolean isExpensive() {
    return this.price.compareTo(new BigDecimal("1000")) > 0;
}
```

### Adding New Service Methods
```java
// In StockService.java
public List<Stock> getExpensiveItems() {
    return getAllStocks().stream()
        .filter(Stock::isExpensive)
        .toList();
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify credentials in `database.properties`
   - Ensure database exists

2. **JavaFX Runtime Error**
   - Verify Java 17+ is installed
   - Check JavaFX libraries are downloaded by Maven

3. **Table Not Found**
   - Run the CREATE TABLE script
   - Verify table name is `lpa_stock`

## 📄 License

This project is created for educational purposes demonstrating DDD, SOLID, and DRY principles in JavaFX application development.

## 👨‍💻 Author

Created as a comprehensive example of enterprise-level JavaFX application development with proper architectural patterns.
