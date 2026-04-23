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
    private String sku;
    private String imageUrl;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor for new stock items
    public Stock(String productName, String description, Integer quantity, 
                 BigDecimal price, String sku) {
        this.validateProductName(productName);
        this.validateQuantity(quantity);
        this.validatePrice(price);
        
        this.productName = productName;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.sku = sku;
        // Use single-character status code to match DB schema (char(1))
        this.status = "A";
    }

    // Constructor for existing stock items (from database)
    public Stock(Integer id, String productName, String description, Integer quantity,
                 BigDecimal price, String sku, String imageUrl, String status, LocalDateTime createdAt, 
                 LocalDateTime updatedAt) {
        this(productName, description, quantity, price, sku);
        this.id = id;
        this.imageUrl = imageUrl;
        // Keep the provided status (should be a single-character code like 'A' or 'D')
        this.status = status != null ? status : "A";
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
        if (quantity == null) {
            throw new IllegalArgumentException("Stock quantity cannot be null");
        }
        if (quantity < 0) {
            throw new IllegalArgumentException("Stock quantity cannot be negative.");
        }
    }

    private void validatePrice(BigDecimal price) {
        if (price == null) {
            throw new IllegalArgumentException("Price cannot be null");
        }
        if (price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price cannot be negative.");
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

    public String getSku() {
        return sku;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getStatus() {
        return status;
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

    public void setSku(String sku) {
        this.sku = sku;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setStatus(String status) {
        // Expect single-character status codes ('A' or 'D'); default to 'A' if null
        this.status = status != null ? status : "A";
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
                ", sku='" + sku + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
