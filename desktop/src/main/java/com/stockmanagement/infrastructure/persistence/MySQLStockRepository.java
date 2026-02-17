package com.stockmanagement.infrastructure.persistence;

import com.stockmanagement.domain.model.Stock;
import com.stockmanagement.domain.repository.StockRepository;
import com.stockmanagement.infrastructure.config.DatabaseConfig;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * MySQL implementation of StockRepository
 * Handles all database operations for Stock entity
 */
public class MySQLStockRepository implements StockRepository {
    
    private final DatabaseConfig dbConfig;
    
    // SQL queries
    private static final String INSERT_SQL = 
        "INSERT INTO lpa_stock (product_name, description, quantity, price, category) VALUES (?, ?, ?, ?, ?)";
    
    private static final String UPDATE_SQL = 
        "UPDATE lpa_stock SET product_name = ?, description = ?, quantity = ?, price = ?, category = ? WHERE id = ?";
    
    private static final String DELETE_SQL = 
        "DELETE FROM lpa_stock WHERE id = ?";
    
    private static final String SELECT_BY_ID_SQL = 
        "SELECT * FROM lpa_stock WHERE id = ?";
    
    private static final String SELECT_ALL_SQL = 
        "SELECT * FROM lpa_stock ORDER BY created_at DESC";
    
    private static final String SELECT_BY_CATEGORY_SQL = 
        "SELECT * FROM lpa_stock WHERE category = ? ORDER BY product_name";
    
    private static final String SELECT_BY_NAME_SQL = 
        "SELECT * FROM lpa_stock WHERE product_name LIKE ? ORDER BY product_name";
    
    private static final String EXISTS_SQL = 
        "SELECT COUNT(*) FROM lpa_stock WHERE id = ?";

    public MySQLStockRepository() {
        this.dbConfig = DatabaseConfig.getInstance();
    }

    @Override
    public Stock save(Stock stock) {
        try (Connection conn = dbConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS)) {
            
            setStockParameters(stmt, stock);
            
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating stock failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int id = generatedKeys.getInt(1);
                    return findById(id).orElseThrow(() -> 
                        new SQLException("Creating stock failed, no ID obtained."));
                } else {
                    throw new SQLException("Creating stock failed, no ID obtained.");
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error saving stock: " + e.getMessage(), e);
        }
    }

    @Override
    public Stock update(Stock stock) {
        if (stock.getId() == null) {
            throw new IllegalArgumentException("Cannot update stock without ID");
        }
        
        try (Connection conn = dbConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(UPDATE_SQL)) {
            
            setStockParameters(stmt, stock);
            stmt.setInt(6, stock.getId());
            
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Updating stock failed, no rows affected.");
            }
            
            return findById(stock.getId()).orElseThrow(() -> 
                new SQLException("Updating stock failed, stock not found."));
                
        } catch (SQLException e) {
            throw new RuntimeException("Error updating stock: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteById(Integer id) {
        try (Connection conn = dbConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(DELETE_SQL)) {
            
            stmt.setInt(1, id);
            stmt.executeUpdate();
            
        } catch (SQLException e) {
            throw new RuntimeException("Error deleting stock: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<Stock> findById(Integer id) {
        try (Connection conn = dbConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(SELECT_BY_ID_SQL)) {
            
            stmt.setInt(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToStock(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding stock by ID: " + e.getMessage(), e);
        }
        return Optional.empty();
    }

    @Override
    public List<Stock> findAll() {
        List<Stock> stocks = new ArrayList<>();
        
        try (Connection conn = dbConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(SELECT_ALL_SQL);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                stocks.add(mapResultSetToStock(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding all stocks: " + e.getMessage(), e);
        }
        
        return stocks;
    }

    @Override
    public List<Stock> findByCategory(String category) {
        List<Stock> stocks = new ArrayList<>();
        
        try (Connection conn = dbConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(SELECT_BY_CATEGORY_SQL)) {
            
            stmt.setString(1, category);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    stocks.add(mapResultSetToStock(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding stocks by category: " + e.getMessage(), e);
        }
        
        return stocks;
    }

    @Override
    public List<Stock> findByProductNameContaining(String productName) {
        List<Stock> stocks = new ArrayList<>();
        
        try (Connection conn = dbConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(SELECT_BY_NAME_SQL)) {
            
            stmt.setString(1, "%" + productName + "%");
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    stocks.add(mapResultSetToStock(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding stocks by name: " + e.getMessage(), e);
        }
        
        return stocks;
    }

    @Override
    public boolean existsById(Integer id) {
        try (Connection conn = dbConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(EXISTS_SQL)) {
            
            stmt.setInt(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error checking stock existence: " + e.getMessage(), e);
        }
        return false;
    }

    // Helper methods
    private void setStockParameters(PreparedStatement stmt, Stock stock) throws SQLException {
        stmt.setString(1, stock.getProductName());
        stmt.setString(2, stock.getDescription());
        stmt.setInt(3, stock.getQuantity());
        stmt.setBigDecimal(4, stock.getPrice());
        stmt.setString(5, stock.getCategory());
    }

    private Stock mapResultSetToStock(ResultSet rs) throws SQLException {
        return new Stock(
            rs.getInt("id"),
            rs.getString("product_name"),
            rs.getString("description"),
            rs.getInt("quantity"),
            rs.getBigDecimal("price"),
            rs.getString("category"),
            rs.getTimestamp("created_at").toLocalDateTime(),
            rs.getTimestamp("updated_at").toLocalDateTime()
        );
    }
}
