# Quick Start Guide - Stock Management System

## 🚀 Fast Setup (5 minutes)

### Step 1: Database Setup

1. **Start MySQL** server

2. **Run the setup script**:
```bash
mysql -u root -p < database-setup.sql
```
Or manually in MySQL Workbench/phpMyAdmin:
- Open `database-setup.sql`
- Execute all statements

This creates:
- Database: `stock_management`
- Table: `lpa_stock`
- Sample data (15 products)

### Step 2: Configure Application

1. **Edit** `src/main/resources/database.properties`:
```properties
db.url=jdbc:mysql://localhost:3306/stock_management?useSSL=false&serverTimezone=UTC
db.username=root
db.password=YOUR_PASSWORD_HERE
```

Replace `YOUR_PASSWORD_HERE` with your MySQL password.

### Step 3: Build & Run

**Option A: Using Maven (Recommended)**
```bash
cd stock-management
mvn clean javafx:run
```

**Option B: Using IDE**
1. Import project as Maven project
2. Wait for dependencies to download
3. Run `StockManagementApp.java`

### Step 4: Test the Application

1. **View Data**: You should see 15 sample products
2. **Search**: Type "laptop" in search box
3. **Add**: Fill form and click "Save New"
4. **Update**: Click a row, edit fields, click "Update Selected"
5. **Delete**: Click a row, click "Delete Selected"

## ✅ Verification Checklist

- [ ] MySQL is running
- [ ] Database `stock_management` exists
- [ ] Table `lpa_stock` exists with sample data
- [ ] `database.properties` configured correctly
- [ ] Maven dependencies downloaded
- [ ] Application starts without errors
- [ ] Sample data visible in table
- [ ] CRUD operations work

## 🔧 Troubleshooting

### Issue: "Cannot connect to database"
**Solution**: 
- Check MySQL is running
- Verify credentials in `database.properties`
- Test connection: `mysql -u root -p`

### Issue: "JavaFX runtime components missing"
**Solution**: 
- Ensure Java 17+ installed: `java -version`
- Run: `mvn clean install`
- Use: `mvn javafx:run` (not `java -jar`)

### Issue: "Table doesn't exist"
**Solution**: 
- Run `database-setup.sql` script
- Verify: `mysql -u root -p stock_management -e "SHOW TABLES;"`

### Issue: Maven dependencies not downloading
**Solution**: 
```bash
mvn clean install -U
```

## 📁 Project Structure Overview

```
stock-management/
├── pom.xml                          # Maven configuration
├── database-setup.sql               # Database initialization
├── README.md                        # Full documentation
├── QUICK_START.md                  # This file
└── src/
    ├── main/
    │   ├── java/                   # Java source code
    │   │   └── com/stockmanagement/
    │   │       ├── domain/         # Business logic
    │   │       ├── application/    # Services
    │   │       ├── infrastructure/ # Database
    │   │       ├── presentation/   # UI
    │   │       └── StockManagementApp.java
    │   └── resources/
    │       ├── database.properties # DB config
    │       └── com/stockmanagement/presentation/
    │           ├── view/          # FXML files
    │           └── style/         # CSS files
```

## 🎯 Next Steps

1. **Explore the code**: Start with `StockManagementApp.java`
2. **Read architecture**: Check `README.md` for DDD/SOLID details
3. **Customize**: Modify UI in `stock-view.fxml` and `styles.css`
4. **Extend**: Add new features following the existing patterns

## 💡 Tips

- Use **Ctrl+Click** on table row to select
- **Search is real-time** - no need to press Enter
- **Required fields** marked with asterisk (*)
- **Error messages** appear in dialogs
- **Timestamps** auto-managed by database

## 📞 Support

For detailed information:
- Architecture: See `README.md` - Architecture section
- SOLID principles: See `README.md` - SOLID section
- Database schema: See `database-setup.sql`

Enjoy managing your stock! 🎉
