package com.stockmanagement.domain.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit Tests for Stock Domain Model
 * Tests business logic and validation rules
 */
@DisplayName("Stock Domain Model Tests")
class StockTest {

    private Stock stock;
    private final BigDecimal testPrice = new BigDecimal("999.99");

    @BeforeEach
    void setUp() {
        stock = new Stock("Laptop", "Gaming Laptop", 10, testPrice, "Electronics");
    }

    @Test
    @DisplayName("Should create valid stock with all required fields")
    void testValidStockCreation() {
        assertNotNull(stock);
        assertEquals("Laptop", stock.getProductName());
        assertEquals("Gaming Laptop", stock.getDescription());
        assertEquals(10, stock.getQuantity());
        assertEquals(testPrice, stock.getPrice());
        assertEquals("Electronics", stock.getCategory());
    }

    @Test
    @DisplayName("Should reject empty product name")
    void testEmptyProductName() {
        assertThrows(IllegalArgumentException.class,
            () -> new Stock("", "Description", 10, testPrice, "Category"));
    }

    @Test
    @DisplayName("Should reject product name with only whitespace")
    void testWhitespaceProductName() {
        assertThrows(IllegalArgumentException.class,
            () -> new Stock("   ", "Description", 10, testPrice, "Category"));
    }

    @Test
    @DisplayName("Should reject product name exceeding 255 characters")
    void testProductNameTooLong() {
        String longName = "a".repeat(256);
        assertThrows(IllegalArgumentException.class,
            () -> new Stock(longName, "Description", 10, testPrice, "Category"));
    }

    @Test
    @DisplayName("Should accept product name with exactly 255 characters")
    void testProductNameMaxLength() {
        String maxName = "a".repeat(255);
        Stock testStock = new Stock(maxName, "Description", 10, testPrice, "Category");
        assertEquals(255, testStock.getProductName().length());
    }

    @Test
    @DisplayName("Should reject null product name")
    void testNullProductName() {
        assertThrows(IllegalArgumentException.class,
            () -> new Stock(null, "Description", 10, testPrice, "Category"));
    }

    @Test
    @DisplayName("Should reject negative quantity")
    void testNegativeQuantity() {
        assertThrows(IllegalArgumentException.class,
            () -> new Stock("Laptop", "Description", -5, testPrice, "Category"));
    }

    @Test
    @DisplayName("Should accept quantity of zero")
    void testZeroQuantity() {
        Stock testStock = new Stock("Laptop", "Description", 0, testPrice, "Category");
        assertEquals(0, testStock.getQuantity());
    }

    @Test
    @DisplayName("Should reject null quantity")
    void testNullQuantity() {
        assertThrows(IllegalArgumentException.class,
            () -> new Stock("Laptop", "Description", null, testPrice, "Category"));
    }

    @Test
    @DisplayName("Should reject negative price")
    void testNegativePrice() {
        BigDecimal negativePrice = new BigDecimal("-50.00");
        assertThrows(IllegalArgumentException.class,
            () -> new Stock("Laptop", "Description", 10, negativePrice, "Category"));
    }

    @Test
    @DisplayName("Should accept price of zero")
    void testZeroPrice() {
        Stock testStock = new Stock("Laptop", "Description", 10, BigDecimal.ZERO, "Category");
        assertEquals(0, testStock.getPrice().compareTo(BigDecimal.ZERO));
    }

    @Test
    @DisplayName("Should reject null price")
    void testNullPrice() {
        assertThrows(IllegalArgumentException.class,
            () -> new Stock("Laptop", "Description", 10, null, "Category"));
    }

    @Test
    @DisplayName("Should increase quantity when adding valid amount")
    void testAddStockValidAmount() {
        stock.addStock(5);
        assertEquals(15, stock.getQuantity());
    }

    @Test
    @DisplayName("Should handle adding large quantities")
    void testAddStockLargeAmount() {
        stock.addStock(1000);
        assertEquals(1010, stock.getQuantity());
    }

    @Test
    @DisplayName("Should reject adding zero amount")
    void testAddStockZeroAmount() {
        assertThrows(IllegalArgumentException.class, () -> stock.addStock(0));
    }

    @Test
    @DisplayName("Should reject adding negative amount")
    void testAddStockNegativeAmount() {
        assertThrows(IllegalArgumentException.class, () -> stock.addStock(-5));
    }

    @Test
    @DisplayName("Should decrease quantity when removing valid amount")
    void testRemoveStockValidAmount() {
        stock.removeStock(3);
        assertEquals(7, stock.getQuantity());
    }

    @Test
    @DisplayName("Should allow removing exact available quantity")
    void testRemoveStockExactAmount() {
        stock.removeStock(10);
        assertEquals(0, stock.getQuantity());
    }

    @Test
    @DisplayName("Should reject removing more than available")
    void testRemoveStockInsufficient() {
        assertThrows(IllegalArgumentException.class, () -> stock.removeStock(15));
    }

    @Test
    @DisplayName("Should reject removing zero amount")
    void testRemoveStockZeroAmount() {
        assertThrows(IllegalArgumentException.class, () -> stock.removeStock(0));
    }

    @Test
    @DisplayName("Should reject removing negative amount")
    void testRemoveStockNegativeAmount() {
        assertThrows(IllegalArgumentException.class, () -> stock.removeStock(-5));
    }

    @Test
    @DisplayName("Should update quantity to new valid value")
    void testUpdateQuantityValid() {
        stock.updateQuantity(25);
        assertEquals(25, stock.getQuantity());
    }

    @Test
    @DisplayName("Should reject updating quantity to negative value")
    void testUpdateQuantityNegative() {
        assertThrows(IllegalArgumentException.class, () -> stock.updateQuantity(-10));
    }

    @Test
    @DisplayName("Should update price to new valid value")
    void testUpdatePriceValid() {
        BigDecimal newPrice = new BigDecimal("1299.99");
        stock.updatePrice(newPrice);
        assertEquals(0, stock.getPrice().compareTo(newPrice));
    }

    @Test
    @DisplayName("Should reject updating price to negative value")
    void testUpdatePriceNegative() {
        assertThrows(IllegalArgumentException.class,
            () -> stock.updatePrice(new BigDecimal("-100")));
    }

    @Test
    @DisplayName("Should identify stock below threshold as low")
    void testIsLowStockBelowThreshold() {
        assertTrue(stock.isLowStock(15));
    }

    @Test
    @DisplayName("Should NOT identify stock at threshold as low")
    void testIsLowStockAtThreshold() {
        assertFalse(stock.isLowStock(10));
    }

    @Test
    @DisplayName("Should NOT identify stock above threshold as low")
    void testIsLowStockAboveThreshold() {
        assertFalse(stock.isLowStock(5));
    }

    @Test
    @DisplayName("Should update product name to valid value")
    void testSetProductNameValid() {
        stock.setProductName("Desktop Computer");
        assertEquals("Desktop Computer", stock.getProductName());
    }

    @Test
    @DisplayName("Should reject invalid product name via setter")
    void testSetProductNameInvalid() {
        assertThrows(IllegalArgumentException.class, () -> stock.setProductName(""));
    }

    @Test
    @DisplayName("Should update description")
    void testSetDescription() {
        stock.setDescription("Updated description");
        assertEquals("Updated description", stock.getDescription());
    }

    @Test
    @DisplayName("Should update category")
    void testSetCategory() {
        stock.setCategory("Computers");
        assertEquals("Computers", stock.getCategory());
    }

    @Test
    @DisplayName("Should consider stocks with same ID as equal")
    void testStockEqualitySameId() {
        Stock stock1 = new Stock(1, "Laptop", "Desc", 10, testPrice, "Electronics", null, null);
        Stock stock2 = new Stock(1, "Desktop", "Different", 20, new BigDecimal("500"), "Computers", null, null);
        assertEquals(stock1, stock2);
    }

    @Test
    @DisplayName("Should consider stocks with different IDs as not equal")
    void testStockEqualityDifferentId() {
        Stock stock1 = new Stock(1, "Laptop", "Desc", 10, testPrice, "Electronics", null, null);
        Stock stock2 = new Stock(2, "Laptop", "Desc", 10, testPrice, "Electronics", null, null);
        assertNotEquals(stock1, stock2);
    }

    @Test
    @DisplayName("Should consider same object reference as equal")
    void testStockEqualitySameReference() {
        assertEquals(stock, stock);
    }

    @Test
    @DisplayName("Should not be equal to null")
    void testStockEqualityNull() {
        assertNotEquals(stock, null);
    }

    @Test
    @DisplayName("Should not be equal to object of different type")
    void testStockEqualityDifferentType() {
        assertNotEquals(stock, "Not a stock");
    }

    @Test
    @DisplayName("Should generate consistent hash code")
    void testStockHashCode() {
        Stock stock1 = new Stock(1, "Laptop", "Desc", 10, testPrice, "Electronics", null, null);
        Stock stock2 = new Stock(1, "Laptop", "Desc", 10, testPrice, "Electronics", null, null);
        assertEquals(stock1.hashCode(), stock2.hashCode());
    }

    @Test
    @DisplayName("Should create stock with all parameters including ID and timestamps")
    void testStockConstructorWithId() {
        LocalDateTime now = LocalDateTime.now();
        Stock stock1 = new Stock(1, "Laptop", "Desc", 10, testPrice, "Electronics", now, now);

        assertEquals(1, stock1.getId());
        assertEquals(now, stock1.getCreatedAt());
        assertEquals(now, stock1.getUpdatedAt());
    }

    @Test
    @DisplayName("Should handle multiple operations in sequence correctly")
    void testMultipleOperationsSequence() {
        assertEquals(10, stock.getQuantity());

        stock.addStock(5);
        assertEquals(15, stock.getQuantity());

        stock.removeStock(3);
        assertEquals(12, stock.getQuantity());

        stock.updateQuantity(20);
        assertEquals(20, stock.getQuantity());

        assertTrue(stock.isLowStock(25));
        assertFalse(stock.isLowStock(15));
    }
}
