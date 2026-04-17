package com.stockmanagement.infrastructure.persistence;

import com.stockmanagement.domain.model.Stock;
import com.stockmanagement.domain.repository.StockRepository;
import com.stockmanagement.infrastructure.config.DatabaseConfig;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * PostgreSQL implementation of StockRepository
 * Handles all database operations for Stock entity
 * Maps to PostgreSQL lpa_stock table with fields: sku, name, description, onhand, price, status, image_url
 */
public class PostgreSQLStockRepository implements StockRepository {

    private final DatabaseConfig dbConfig;

    // SQL queries - Updated for PostgreSQL schema
    private static final String INSERT_SQL =
        "INSERT INTO lpa_stock (sku, name, description, onhand, price, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id";

    private static final String UPDATE_SQL =
        "UPDATE lpa_stock SET sku = ?, name = ?, description = ?, onhand = ?, price = ?, status = ?, image_url = ? WHERE id = ?";

    private static final String DELETE_SQL =
        "DELETE FROM lpa_stock WHERE id = ?";

    private static final String SELECT_BY_ID_SQL =
        "SELECT id, sku, name, description, onhand, price, status, image_url, created_at, updated_at FROM lpa_stock WHERE id = ?";

    private static final String SELECT_ALL_SQL =
        "SELECT id, sku, name, description, onhand, price, status, image_url, created_at, updated_at FROM lpa_stock ORDER BY created_at DESC";

    private static final String SELECT_BY_SKU_SQL =
        "SELECT id, sku, name, description, onhand, price, status, image_url, created_at, updated_at FROM lpa_stock WHERE sku = ? ORDER BY name";

    private static final String SELECT_BY_NAME_SQL =
        "SELECT id, sku, name, description, onhand, price, status, image_url, created_at, updated_at FROM lpa_stock WHERE name ILIKE ? ORDER BY name";

    private static final String EXISTS_SQL =
        "SELECT COUNT(*) FROM lpa_stock WHERE id = ?";

    private static final String SELECT_BY_QUANTITY_BELOW_SQL =
        "SELECT id, sku, name, description, onhand, price, status, image_url, created_at, updated_at FROM lpa_stock WHERE onhand < ? ORDER BY onhand ASC";

    public PostgreSQLStockRepository() {
        this.dbConfig = DatabaseConfig.getInstance();
    }

    @Override
    public Stock save(Stock stock) {
        try (Connection conn = dbConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(INSERT_SQL)) {

            setStockParameters(stmt, stock, 0);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    int id = rs.getInt("id");
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

            setStockParameters(stmt, stock, 0);
            stmt.setInt(8, stock.getId());

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
    public List<Stock> findBySku(String sku) {
        List<Stock> stocks = new ArrayList<>();

        try (Connection conn = dbConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(SELECT_BY_SKU_SQL)) {

            stmt.setString(1, sku);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    stocks.add(mapResultSetToStock(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding stocks by SKU: " + e.getMessage(), e);
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

    @Override
    public List<Stock> findByQuantityBelow(Integer threshold) {
        List<Stock> stocks = new ArrayList<>();

        try (Connection conn = dbConfig.getDataSource().getConnection();
             PreparedStatement stmt = conn.prepareStatement(SELECT_BY_QUANTITY_BELOW_SQL)) {

            stmt.setInt(1, threshold);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    stocks.add(mapResultSetToStock(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error finding stocks by quantity: " + e.getMessage(), e);
        }

        return stocks;
    }

    // Helper methods
    private void setStockParameters(PreparedStatement stmt, Stock stock, int startIndex) throws SQLException {
        // Mapping: sku, name, description, onhand, price, status, image_url
        stmt.setString(startIndex + 1, stock.getSku()); // sku
        stmt.setString(startIndex + 2, stock.getProductName()); // name
        stmt.setString(startIndex + 3, stock.getDescription()); // description
        stmt.setInt(startIndex + 4, stock.getQuantity()); // onhand
        stmt.setBigDecimal(startIndex + 5, stock.getPrice()); // price
        stmt.setString(startIndex + 6, stock.getStatus()); // status
        stmt.setString(startIndex + 7, stock.getImageUrl()); // image_url
    }

    private Stock mapResultSetToStock(ResultSet rs) throws SQLException {
        // Safely extract timestamps - convert to LocalDateTime only if not null
        Timestamp createdTs = rs.getTimestamp("created_at");
        Timestamp updatedTs = rs.getTimestamp("updated_at");

        return new Stock(
            rs.getInt("id"),
            rs.getString("name"), // productName
            rs.getString("description"),
            rs.getInt("onhand"), // quantity
            rs.getBigDecimal("price"),
            rs.getString("sku"), // sku
            rs.getString("image_url"), // imageUrl
            rs.getString("status"), // status
            createdTs != null ? createdTs.toLocalDateTime() : null,
            updatedTs != null ? updatedTs.toLocalDateTime() : null
        );
    }
}

