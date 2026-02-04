package com.stockmanagement.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Stock Domain Entity
 * Represents a product in stock with business logic
 */
public class Stock {
    private Integer id;
    private String productName;
    private String description;
    private Integer quantity;
    private BigDecimal price;
    private String category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor for new stock items
    public Stock(String productName, String description, Integer quantity, 
                 BigDecimal price, String category) {
        this.validateProductName(productName);
        this.validateQuantity(quantity);
        this.validatePrice(price);
        
        this.productName = productName;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.category = category;
    }

    // Constructor for existing stock items (from database)
    public Stock(Integer id, String productName, String description, Integer quantity,
                 BigDecimal price, String category, LocalDateTime createdAt, 
                 LocalDateTime updatedAt) {
        this(productName, description, quantity, price, category);
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Business logic - validations
    private void validateProductName(String productName) {
        if (productName == null || productName.trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        if (productName.length() > 255) {
            throw new IllegalArgumentException("Product name cannot exceed 255 characters");
        }
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }
    }

    private void validatePrice(BigDecimal price) {
        if (price == null || price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
    }

    // Business methods
    public void updateQuantity(Integer newQuantity) {
        validateQuantity(newQuantity);
        this.quantity = newQuantity;
    }

    public void updatePrice(BigDecimal newPrice) {
        validatePrice(newPrice);
        this.price = newPrice;
    }

    public void addStock(Integer amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount to add must be positive");
        }
        this.quantity += amount;
    }

    public void removeStock(Integer amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount to remove must be positive");
        }
        if (this.quantity < amount) {
            throw new IllegalArgumentException("Insufficient stock");
        }
        this.quantity -= amount;
    }

    public boolean isLowStock(Integer threshold) {
        return this.quantity < threshold;
    }

    // Getters
    public Integer getId() {
        return id;
    }

    public String getProductName() {
        return productName;
    }

    public String getDescription() {
        return description;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Setters (for updates)
    public void setProductName(String productName) {
        validateProductName(productName);
        this.productName = productName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Stock stock = (Stock) o;
        return Objects.equals(id, stock.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Stock{" +
                "id=" + id +
                ", productName='" + productName + '\'' +
                ", quantity=" + quantity +
                ", price=" + price +
                ", category='" + category + '\'' +
                '}';
    }
}
