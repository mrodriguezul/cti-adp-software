package com.stockmanagement.application.service;

import com.stockmanagement.domain.model.Stock;
import com.stockmanagement.domain.repository.StockRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Stock Service - Application layer
 * Coordinates business operations and use cases
 */
public class StockService {
    
    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    /**
     * Create a new stock item
     */
    public Stock createStock(String productName, String description, Integer quantity, 
                            BigDecimal price, String category) {
        Stock stock = new Stock(productName, description, quantity, price, category);
        return stockRepository.save(stock);
    }

    /**
     * Update an existing stock item
     */
    public Stock updateStock(Integer id, String productName, String description, 
                            Integer quantity, BigDecimal price, String category) {
        Optional<Stock> existingStock = stockRepository.findById(id);
        
        if (existingStock.isEmpty()) {
            throw new IllegalArgumentException("Stock with ID " + id + " not found");
        }
        
        Stock stock = existingStock.get();
        stock.setProductName(productName);
        stock.setDescription(description);
        stock.updateQuantity(quantity);
        stock.updatePrice(price);
        stock.setCategory(category);
        
        return stockRepository.update(stock);
    }

    /**
     * Delete a stock item
     */
    public void deleteStock(Integer id) {
        if (!stockRepository.existsById(id)) {
            throw new IllegalArgumentException("Stock with ID " + id + " not found");
        }
        stockRepository.deleteById(id);
    }

    /**
     * Get a stock item by ID
     */
    public Optional<Stock> getStockById(Integer id) {
        return stockRepository.findById(id);
    }

    /**
     * Get all stock items
     */
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    /**
     * Search stocks by product name
     */
    public List<Stock> searchStocksByName(String productName) {
        if (productName == null || productName.trim().isEmpty()) {
            return getAllStocks();
        }
        return stockRepository.findByProductNameContaining(productName);
    }

    /**
     * Get stocks by category
     */
    public List<Stock> getStocksByCategory(String category) {
        return stockRepository.findByCategory(category);
    }

    /**
     * Add quantity to existing stock
     */
    public Stock addStockQuantity(Integer id, Integer amount) {
        Stock stock = stockRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Stock with ID " + id + " not found"));
        
        stock.addStock(amount);
        return stockRepository.update(stock);
    }

    /**
     * Remove quantity from existing stock
     */
    public Stock removeStockQuantity(Integer id, Integer amount) {
        Stock stock = stockRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Stock with ID " + id + " not found"));
        
        stock.removeStock(amount);
        return stockRepository.update(stock);
    }

    /**
     * Check if stock exists
     */
    public boolean stockExists(Integer id) {
        return stockRepository.existsById(id);
    }

    /**
     * Get low stock items (quantity less than threshold)
     */
    public List<Stock> getLowStockItems(Integer threshold) {
        return getAllStocks().stream()
            .filter(stock -> stock.isLowStock(threshold))
            .toList();
    }
}
