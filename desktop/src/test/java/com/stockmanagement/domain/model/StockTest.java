package com.stockmanagement.domain.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for Stock domain entity
 * Validates business rules and constraints
 */
class StockTest {

    private Stock stock;

    @BeforeEach
    void setUp() {
        stock = new Stock("Laptop", "High-performance laptop", 10, new BigDecimal("999.99"), "SKU-001");
    }

    // ==================== Constructor Tests ====================

    @Test
    void testStockCreation_Success() {
        assertNotNull(stock);
        assertEquals("Laptop", stock.getProductName());
        assertEquals("High-performance laptop", stock.getDescription());
        assertEquals(10, stock.getQuantity());
        assertEquals(new BigDecimal("999.99"), stock.getPrice());
        assertEquals("SKU-001", stock.getSku());
        assertEquals("A", stock.getStatus()); // Default status is 'A'
    }

    @Test
    void testStockCreation_WithFullConstructor() {
        LocalDateTime now = LocalDateTime.now();
        Stock stock = new Stock(1, "Monitor", "27-inch display", 5, new BigDecimal("299.99"),
                               "SKU-002", "http://image.url", "A", now, now);

        assertEquals(1, stock.getId());
        assertEquals("Monitor", stock.getProductName());
        assertEquals(5, stock.getQuantity());
        assertEquals("A", stock.getStatus());
        assertEquals("http://image.url", stock.getImageUrl());
    }

    // ==================== Validation Tests ====================

    @Test
    void testProductNameValidation_Empty() {
        assertThrows(IllegalArgumentException.class, () -> {
            new Stock("", "Description", 10, new BigDecimal("100.00"), "SKU-001");
        });
    }

    @Test
    void testProductNameValidation_Null() {
        assertThrows(IllegalArgumentException.class, () -> {
            new Stock(null, "Description", 10, new BigDecimal("100.00"), "SKU-001");
        });
    }

    @Test
    void testProductNameValidation_TooLong() {
        String longName = "A".repeat(256);
        assertThrows(IllegalArgumentException.class, () -> {
            new Stock(longName, "Description", 10, new BigDecimal("100.00"), "SKU-001");
        });
    }

    @Test
    void testQuantityValidation_Negative() {
        assertThrows(IllegalArgumentException.class, () -> {
            new Stock("Laptop", "Description", -1, new BigDecimal("100.00"), "SKU-001");
        });
    }

    @Test
    void testQuantityValidation_Null() {
        assertThrows(IllegalArgumentException.class, () -> {
            new Stock("Laptop", "Description", null, new BigDecimal("100.00"), "SKU-001");
        });
    }

    @Test
    void testQuantityValidation_Zero() {
        Stock stock = new Stock("Laptop", "Description", 0, new BigDecimal("100.00"), "SKU-001");
        assertEquals(0, stock.getQuantity());
    }

    @Test
    void testPriceValidation_Negative() {
        assertThrows(IllegalArgumentException.class, () -> {
            new Stock("Laptop", "Description", 10, new BigDecimal("-100.00"), "SKU-001");
        });
    }

    @Test
    void testPriceValidation_Null() {
        assertThrows(IllegalArgumentException.class, () -> {
            new Stock("Laptop", "Description", 10, null, "SKU-001");
        });
    }

    @Test
    void testPriceValidation_Zero() {
        Stock stock = new Stock("Laptop", "Description", 10, new BigDecimal("0.00"), "SKU-001");
        assertEquals(0, stock.getPrice().compareTo(BigDecimal.ZERO));
    }

    // ==================== Quantity Operations Tests ====================

    @Test
    void testAddStock_Success() {
        stock.addStock(5);
        assertEquals(15, stock.getQuantity());
    }

    @Test
    void testAddStock_InvalidAmount() {
        assertThrows(IllegalArgumentException.class, () -> {
            stock.addStock(-5);
        });
    }

    @Test
    void testAddStock_ZeroAmount() {
        assertThrows(IllegalArgumentException.class, () -> {
            stock.addStock(0);
        });
    }

    @Test
    void testRemoveStock_Success() {
        stock.removeStock(3);
        assertEquals(7, stock.getQuantity());
    }

    @Test
    void testRemoveStock_InsufficientStock() {
        assertThrows(IllegalArgumentException.class, () -> {
            stock.removeStock(15); // Only 10 in stock
        });
    }

    @Test
    void testRemoveStock_InvalidAmount() {
        assertThrows(IllegalArgumentException.class, () -> {
            stock.removeStock(-5);
        });
    }

    @Test
    void testRemoveStock_ZeroAmount() {
        assertThrows(IllegalArgumentException.class, () -> {
            stock.removeStock(0);
        });
    }

    // ==================== Price Update Tests ====================

    @Test
    void testUpdatePrice_Success() {
        stock.updatePrice(new BigDecimal("1299.99"));
        assertEquals(new BigDecimal("1299.99"), stock.getPrice());
    }

    @Test
    void testUpdatePrice_Negative() {
        assertThrows(IllegalArgumentException.class, () -> {
            stock.updatePrice(new BigDecimal("-100.00"));
        });
    }

    @Test
    void testUpdatePrice_Null() {
        assertThrows(IllegalArgumentException.class, () -> {
            stock.updatePrice(null);
        });
    }

    // ==================== Quantity Update Tests ====================

    @Test
    void testUpdateQuantity_Success() {
        stock.updateQuantity(20);
        assertEquals(20, stock.getQuantity());
    }

    @Test
    void testUpdateQuantity_Negative() {
        assertThrows(IllegalArgumentException.class, () -> {
            stock.updateQuantity(-5);
        });
    }

    @Test
    void testUpdateQuantity_Null() {
        assertThrows(IllegalArgumentException.class, () -> {
            stock.updateQuantity(null);
        });
    }

    @Test
    void testUpdateQuantity_Zero() {
        stock.updateQuantity(0);
        assertEquals(0, stock.getQuantity());
    }

    // ==================== Low Stock Check Tests ====================

    @Test
    void testIsLowStock_True() {
        boolean isLow = stock.isLowStock(15);
        assertTrue(isLow);
    }

    @Test
    void testIsLowStock_False() {
        boolean isLow = stock.isLowStock(5);
        assertFalse(isLow);
    }

    @Test
    void testIsLowStock_Boundary() {
        boolean isLow = stock.isLowStock(10);
        assertFalse(isLow); // Equal to threshold is NOT low stock
    }

    // ==================== Setter Tests ====================

    @Test
    void testSetProductName_Success() {
        stock.setProductName("Desktop");
        assertEquals("Desktop", stock.getProductName());
    }

    @Test
    void testSetProductName_Invalid() {
        assertThrows(IllegalArgumentException.class, () -> {
            stock.setProductName("");
        });
    }

    @Test
    void testSetDescription() {
        stock.setDescription("New description");
        assertEquals("New description", stock.getDescription());
    }

    @Test
    void testSetSku() {
        stock.setSku("SKU-NEW");
        assertEquals("SKU-NEW", stock.getSku());
    }

    @Test
    void testSetImageUrl() {
        stock.setImageUrl("http://new-image.url");
        assertEquals("http://new-image.url", stock.getImageUrl());
    }

    @Test
    void testSetStatus_Valid() {
        stock.setStatus("D");
        assertEquals("D", stock.getStatus());
    }

    @Test
    void testSetStatus_Null_DefaultsToActive() {
        stock.setStatus(null);
        assertEquals("A", stock.getStatus());
    }

    // ==================== Equality Tests ====================

    @Test
    void testEquality_SameId() {
        Stock stock1 = new Stock(1, "Laptop", "Desc", 10, new BigDecimal("100.00"),
                                "SKU-001", "http://url", "A", null, null);
        Stock stock2 = new Stock(1, "Desktop", "Different", 5, new BigDecimal("200.00"),
                                "SKU-002", "http://url2", "D", null, null);

        assertEquals(stock1, stock2); // Same ID = equal
    }

    @Test
    void testEquality_DifferentId() {
        Stock stock1 = new Stock(1, "Laptop", "Desc", 10, new BigDecimal("100.00"),
                                "SKU-001", "http://url", "A", null, null);
        Stock stock2 = new Stock(2, "Laptop", "Desc", 10, new BigDecimal("100.00"),
                                "SKU-001", "http://url", "A", null, null);

        assertNotEquals(stock1, stock2); // Different ID = not equal
    }

    @Test
    void testHashCode_ConsistentWithEquality() {
        Stock stock1 = new Stock(1, "Laptop", "Desc", 10, new BigDecimal("100.00"),
                                "SKU-001", "http://url", "A", null, null);
        Stock stock2 = new Stock(1, "Laptop", "Desc", 10, new BigDecimal("100.00"),
                                "SKU-001", "http://url", "A", null, null);

        assertEquals(stock1.hashCode(), stock2.hashCode());
    }

    // ==================== toString Tests ====================

    @Test
    void testToString() {
        String result = stock.toString();
        assertNotNull(result);
        assertTrue(result.contains("Laptop"));
        assertTrue(result.contains("SKU-001"));
    }
}
