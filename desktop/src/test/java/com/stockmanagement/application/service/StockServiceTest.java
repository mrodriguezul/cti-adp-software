package com.stockmanagement.application.service;

import com.stockmanagement.domain.model.Stock;
import com.stockmanagement.domain.repository.StockRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

/**
 * Unit tests for StockService application layer
 * Tests service logic and repository delegation
 */
@ExtendWith(MockitoExtension.class)
class StockServiceTest {

    @Mock
    private StockRepository stockRepository;

    @InjectMocks
    private StockService stockService;

    private Stock testStock;
    private Stock testStock2;

    @BeforeEach
    void setUp() {
        testStock = new Stock("Laptop", "High-performance", 10, new BigDecimal("999.99"), "SKU-001");
        testStock2 = new Stock("Monitor", "27-inch display", 5, new BigDecimal("299.99"), "SKU-002");
    }

    // ==================== Create Stock Tests ====================

    @Test
    void testCreateStock_Success() {
        Stock newStock = new Stock("Keyboard", "Mechanical", 20, new BigDecimal("149.99"), "SKU-003");
        when(stockRepository.save(any(Stock.class))).thenReturn(newStock);

        Stock result = stockService.createStock("Keyboard", "Mechanical", 20, new BigDecimal("149.99"), "SKU-003");

        assertNotNull(result);
        assertEquals("Keyboard", result.getProductName());
        verify(stockRepository, times(1)).save(any(Stock.class));
    }

    @Test
    void testCreateStock_WithNegativeQuantity() {
        assertThrows(IllegalArgumentException.class, () -> {
            stockService.createStock("Laptop", "Description", -5, new BigDecimal("100.00"), "SKU-001");
        });
        verify(stockRepository, never()).save(any(Stock.class));
    }

    @Test
    void testCreateStock_WithNegativePrice() {
        assertThrows(IllegalArgumentException.class, () -> {
            stockService.createStock("Laptop", "Description", 10, new BigDecimal("-100.00"), "SKU-001");
        });
        verify(stockRepository, never()).save(any(Stock.class));
    }

    @Test
    void testCreateStock_WithEmptyProductName() {
        assertThrows(IllegalArgumentException.class, () -> {
            stockService.createStock("", "Description", 10, new BigDecimal("100.00"), "SKU-001");
        });
        verify(stockRepository, never()).save(any(Stock.class));
    }

    // ==================== Update Stock Tests ====================

    @Test
    void testUpdateStock_Success() {
        int stockId = 1;
        Stock existingStock = new Stock(stockId, "Laptop", "Old desc", 10, new BigDecimal("999.99"),
                                       "SKU-001", "http://url", "A", null, null);
        Stock updatedStock = new Stock(stockId, "Laptop Pro", "New desc", 15, new BigDecimal("1299.99"),
                                      "SKU-001", "http://new-url", "A", null, null);

        when(stockRepository.findById(stockId)).thenReturn(Optional.of(existingStock));
        when(stockRepository.update(any(Stock.class))).thenReturn(updatedStock);

        Stock result = stockService.updateStock(stockId, "Laptop Pro", "New desc", 15,
                                               new BigDecimal("1299.99"), "SKU-001", "A", "http://new-url");

        assertNotNull(result);
        assertEquals("Laptop Pro", result.getProductName());
        verify(stockRepository, times(1)).findById(stockId);
        verify(stockRepository, times(1)).update(any(Stock.class));
    }

    @Test
    void testUpdateStock_NotFound() {
        int stockId = 999;
        when(stockRepository.findById(stockId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            stockService.updateStock(stockId, "Laptop", "Desc", 10, new BigDecimal("100.00"),
                                    "SKU-001", "A", "http://url");
        });
        verify(stockRepository, never()).update(any(Stock.class));
    }

    @Test
    void testUpdateStock_WithNegativeQuantity() {
        int stockId = 1;
        Stock existingStock = new Stock(stockId, "Laptop", "Desc", 10, new BigDecimal("100.00"),
                                       "SKU-001", "http://url", "A", null, null);
        when(stockRepository.findById(stockId)).thenReturn(Optional.of(existingStock));

        assertThrows(IllegalArgumentException.class, () -> {
            stockService.updateStock(stockId, "Laptop", "Desc", -5, new BigDecimal("100.00"),
                                    "SKU-001", "A", "http://url");
        });
        verify(stockRepository, never()).update(any(Stock.class));
    }

    // ==================== Delete Stock Tests ====================

    @Test
    void testDeleteStock_Success() {
        int stockId = 1;
        when(stockRepository.existsById(stockId)).thenReturn(true);

        stockService.deleteStock(stockId);

        verify(stockRepository, times(1)).deleteById(stockId);
    }

    @Test
    void testDeleteStock_NotFound() {
        int stockId = 999;
        when(stockRepository.existsById(stockId)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> {
            stockService.deleteStock(stockId);
        });
        verify(stockRepository, never()).deleteById(anyInt());
    }

    // ==================== Get Stock Tests ====================

    @Test
    void testGetStockById_Found() {
        int stockId = 1;
        Stock stock = new Stock(stockId, "Laptop", "Desc", 10, new BigDecimal("100.00"),
                               "SKU-001", "http://url", "A", null, null);
        when(stockRepository.findById(stockId)).thenReturn(Optional.of(stock));

        Optional<Stock> result = stockService.getStockById(stockId);

        assertTrue(result.isPresent());
        assertEquals("Laptop", result.get().getProductName());
        verify(stockRepository, times(1)).findById(stockId);
    }

    @Test
    void testGetStockById_NotFound() {
        int stockId = 999;
        when(stockRepository.findById(stockId)).thenReturn(Optional.empty());

        Optional<Stock> result = stockService.getStockById(stockId);

        assertFalse(result.isPresent());
        verify(stockRepository, times(1)).findById(stockId);
    }

    // ==================== Get All Stocks Tests ====================

    @Test
    void testGetAllStocks_Success() {
        List<Stock> stocks = Arrays.asList(testStock, testStock2);
        when(stockRepository.findAll()).thenReturn(stocks);

        List<Stock> result = stockService.getAllStocks();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(stockRepository, times(1)).findAll();
    }

    @Test
    void testGetAllStocks_Empty() {
        when(stockRepository.findAll()).thenReturn(Arrays.asList());

        List<Stock> result = stockService.getAllStocks();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(stockRepository, times(1)).findAll();
    }

    // ==================== Search Stock Tests ====================

    @Test
    void testSearchStocksByName_Found() {
        String searchText = "Laptop";
        List<Stock> stocks = Arrays.asList(testStock);
        when(stockRepository.findByProductNameContaining(searchText)).thenReturn(stocks);

        List<Stock> result = stockService.searchStocksByName(searchText);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(stockRepository, times(1)).findByProductNameContaining(searchText);
    }

    @Test
    void testSearchStocksByName_NotFound() {
        String searchText = "NonExistent";
        when(stockRepository.findByProductNameContaining(searchText)).thenReturn(Arrays.asList());

        List<Stock> result = stockService.searchStocksByName(searchText);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(stockRepository, times(1)).findByProductNameContaining(searchText);
    }

    @Test
    void testSearchStocksByName_Empty_ReturnsAll() {
        List<Stock> stocks = Arrays.asList(testStock, testStock2);
        when(stockRepository.findAll()).thenReturn(stocks);

        List<Stock> result = stockService.searchStocksByName("");

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(stockRepository, times(1)).findAll();
    }

    @Test
    void testSearchStocksByName_Null_ReturnsAll() {
        List<Stock> stocks = Arrays.asList(testStock, testStock2);
        when(stockRepository.findAll()).thenReturn(stocks);

        List<Stock> result = stockService.searchStocksByName(null);

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(stockRepository, times(1)).findAll();
    }

    // ==================== Get Stocks By SKU Tests ====================

    @Test
    void testGetStocksBySku_Found() {
        String sku = "SKU-001";
        List<Stock> stocks = Arrays.asList(testStock);
        when(stockRepository.findBySku(sku)).thenReturn(stocks);

        List<Stock> result = stockService.getStocksBySku(sku);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(stockRepository, times(1)).findBySku(sku);
    }

    @Test
    void testGetStocksBySku_NotFound() {
        String sku = "SKU-NOTFOUND";
        when(stockRepository.findBySku(sku)).thenReturn(Arrays.asList());

        List<Stock> result = stockService.getStocksBySku(sku);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(stockRepository, times(1)).findBySku(sku);
    }

    // ==================== Add Quantity Tests ====================

    @Test
    void testAddStockQuantity_Success() {
        int stockId = 1;
        Stock existingStock = new Stock(stockId, "Laptop", "Desc", 10, new BigDecimal("100.00"),
                                       "SKU-001", "http://url", "A", null, null);
        Stock updatedStock = new Stock(stockId, "Laptop", "Desc", 15, new BigDecimal("100.00"),
                                      "SKU-001", "http://url", "A", null, null);

        when(stockRepository.findById(stockId)).thenReturn(Optional.of(existingStock));
        when(stockRepository.update(any(Stock.class))).thenReturn(updatedStock);

        Stock result = stockService.addStockQuantity(stockId, 5);

        assertNotNull(result);
        assertEquals(15, result.getQuantity());
        verify(stockRepository, times(1)).findById(stockId);
        verify(stockRepository, times(1)).update(any(Stock.class));
    }

    @Test
    void testAddStockQuantity_NotFound() {
        int stockId = 999;
        when(stockRepository.findById(stockId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            stockService.addStockQuantity(stockId, 5);
        });
        verify(stockRepository, never()).update(any(Stock.class));
    }

    // ==================== Remove Quantity Tests ====================

    @Test
    void testRemoveStockQuantity_Success() {
        int stockId = 1;
        Stock existingStock = new Stock(stockId, "Laptop", "Desc", 10, new BigDecimal("100.00"),
                                       "SKU-001", "http://url", "A", null, null);
        Stock updatedStock = new Stock(stockId, "Laptop", "Desc", 5, new BigDecimal("100.00"),
                                      "SKU-001", "http://url", "A", null, null);

        when(stockRepository.findById(stockId)).thenReturn(Optional.of(existingStock));
        when(stockRepository.update(any(Stock.class))).thenReturn(updatedStock);

        Stock result = stockService.removeStockQuantity(stockId, 5);

        assertNotNull(result);
        assertEquals(5, result.getQuantity());
        verify(stockRepository, times(1)).findById(stockId);
        verify(stockRepository, times(1)).update(any(Stock.class));
    }

    @Test
    void testRemoveStockQuantity_InsufficientStock() {
        int stockId = 1;
        Stock existingStock = new Stock(stockId, "Laptop", "Desc", 10, new BigDecimal("100.00"),
                                       "SKU-001", "http://url", "A", null, null);
        when(stockRepository.findById(stockId)).thenReturn(Optional.of(existingStock));

        assertThrows(IllegalArgumentException.class, () -> {
            stockService.removeStockQuantity(stockId, 15);
        });
        verify(stockRepository, never()).update(any(Stock.class));
    }

    // ==================== Stock Exists Tests ====================

    @Test
    void testStockExists_True() {
        int stockId = 1;
        when(stockRepository.existsById(stockId)).thenReturn(true);

        boolean result = stockService.stockExists(stockId);

        assertTrue(result);
        verify(stockRepository, times(1)).existsById(stockId);
    }

    @Test
    void testStockExists_False() {
        int stockId = 999;
        when(stockRepository.existsById(stockId)).thenReturn(false);

        boolean result = stockService.stockExists(stockId);

        assertFalse(result);
        verify(stockRepository, times(1)).existsById(stockId);
    }

    // ==================== Low Stock Tests ====================

    @Test
    void testGetLowStockItems_Found() {
        List<Stock> lowStocks = Arrays.asList(testStock2);
        when(stockRepository.findByQuantityBelow(10)).thenReturn(lowStocks);

        List<Stock> result = stockService.getLowStockItems(10);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(stockRepository, times(1)).findByQuantityBelow(10);
    }

    @Test
    void testGetLowStockItems_None() {
        when(stockRepository.findByQuantityBelow(5)).thenReturn(Arrays.asList());

        List<Stock> result = stockService.getLowStockItems(5);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(stockRepository, times(1)).findByQuantityBelow(5);
    }

    @Test
    void testGetLowStockItems_NullThreshold() {
        List<Stock> result = stockService.getLowStockItems(null);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(stockRepository, never()).findByQuantityBelow(anyInt());
    }

    @Test
    void testGetLowStockItems_ZeroThreshold() {
        List<Stock> result = stockService.getLowStockItems(0);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(stockRepository, never()).findByQuantityBelow(anyInt());
    }

    @Test
    void testGetLowStockItems_NegativeThreshold() {
        List<Stock> result = stockService.getLowStockItems(-5);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(stockRepository, never()).findByQuantityBelow(anyInt());
    }
}

