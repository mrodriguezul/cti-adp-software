package com.stockmanagement.domain.repository;

import com.stockmanagement.domain.model.Stock;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Stock entity
 * Defines the contract for data access operations
 */
public interface StockRepository {
    
    /**
     * Save a new stock item
     * @param stock the stock to save
     * @return the saved stock with generated ID
     */
    Stock save(Stock stock);
    
    /**
     * Update an existing stock item
     * @param stock the stock to update
     * @return the updated stock
     */
    Stock update(Stock stock);
    
    /**
     * Delete a stock item by ID
     * @param id the stock ID
     */
    void deleteById(Integer id);
    
    /**
     * Find a stock item by ID
     * @param id the stock ID
     * @return Optional containing the stock if found
     */
    Optional<Stock> findById(Integer id);
    
    /**
     * Find all stock items
     * @return list of all stocks
     */
    List<Stock> findAll();
    
    /**
     * Find stocks by category
     * @param category the category name
     * @return list of stocks in the category
     */
    List<Stock> findByCategory(String category);
    
    /**
     * Find stocks by product name (partial match)
     * @param productName the product name to search
     * @return list of matching stocks
     */
    List<Stock> findByProductNameContaining(String productName);
    
    /**
     * Check if a stock item exists by ID
     * @param id the stock ID
     * @return true if exists, false otherwise
     */
    boolean existsById(Integer id);
}
