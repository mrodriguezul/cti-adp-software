package com.stockmanagement.application.service;

import com.stockmanagement.domain.model.Stock;
import com.stockmanagement.domain.repository.StockRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Integration Tests for Stock Service
 * Tests service layer business logic
 */
@DisplayName("Stock Service Tests")
class StockServiceTest {

    private StockService stockService;

    @Mock
    private StockRepository mockRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        stockService = new StockService(mockRepository);
    }

    @Test
    @DisplayName("Should create stock successfully")
    void testCreateStock() {
        Stock stock = new Stock("Laptop", "Gaming", 10, BigDecimal.TEN, "Electronics");
        when(mockRepository.save(any())).thenReturn(stock);

        Stock result = stockService.createStock("Laptop", "Gaming", 10, BigDecimal.TEN, "Electronics");

        assertNotNull(result);
        assertEquals("Laptop", result.getProductName());
        verify(mockRepository).save(any());
    }

    @Test
    @DisplayName("Should retrieve stock by ID")
    void testGetStockById() {
        Stock stock = new Stock(1, "Laptop", "Gaming", 10, BigDecimal.TEN, "Electronics", null, null);
        when(mockRepository.findById(1)).thenReturn(Optional.of(stock));

        Optional<Stock> result = stockService.getStockById(1);

        assertTrue(result.isPresent());
        assertEquals("Laptop", result.get().getProductName());
    }

    @Test
    @DisplayName("Should delete stock successfully")
    void testDeleteStock() {
        when(mockRepository.existsById(1)).thenReturn(true);

        stockService.deleteStock(1);

        verify(mockRepository).deleteById(1);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent stock")
    void testDeleteNonExistentStock() {
        when(mockRepository.existsById(999)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> {
            stockService.deleteStock(999);
        });
    }

    @Test
    @DisplayName("Should search stocks by product name")
    void testSearchByName() {
        Stock stock = new Stock("Dell Laptop", "Gaming", 10, BigDecimal.TEN, "Electronics");
        List<Stock> stocks = List.of(stock);
        when(mockRepository.findByProductNameContaining("Dell")).thenReturn(stocks);

        List<Stock> result = stockService.searchStocksByName("Dell");

        assertEquals(1, result.size());
        assertEquals("Dell Laptop", result.get(0).getProductName());
    }

    @Test
    @DisplayName("Should get all stocks")
    void testGetAllStocks() {
        Stock stock1 = new Stock(1, "Laptop", "Desc", 10, BigDecimal.TEN, "Electronics", null, null);
        Stock stock2 = new Stock(2, "Mouse", "Desc", 20, BigDecimal.ONE, "Accessories", null, null);
        List<Stock> stocks = List.of(stock1, stock2);

        when(mockRepository.findAll()).thenReturn(stocks);

        List<Stock> result = stockService.getAllStocks();

        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("Should filter low stock items")
    void testGetLowStockItems() {
        Stock stock1 = new Stock(1, "Item1", "Desc", 5, BigDecimal.TEN, "Cat", null, null);
        List<Stock> stocks = List.of(stock1);

        when(mockRepository.findByQuantityBelow(10)).thenReturn(stocks);

        List<Stock> result = stockService.getLowStockItems(10);

        assertEquals(1, result.size());
        assertEquals("Item1", result.get(0).getProductName());
    }

    @Test
    @DisplayName("Should add quantity to stock")
    void testAddStockQuantity() {
        Stock stock = new Stock(1, "Laptop", "Desc", 10, BigDecimal.TEN, "Electronics", null, null);
        when(mockRepository.findById(1)).thenReturn(Optional.of(stock));
        when(mockRepository.update(any())).thenReturn(stock);

        Stock result = stockService.addStockQuantity(1, 5);

        assertNotNull(result);
        verify(mockRepository).update(any());
    }

    @Test
    @DisplayName("Should remove quantity from stock")
    void testRemoveStockQuantity() {
        Stock stock = new Stock(1, "Laptop", "Desc", 10, BigDecimal.TEN, "Electronics", null, null);
        when(mockRepository.findById(1)).thenReturn(Optional.of(stock));
        when(mockRepository.update(any())).thenReturn(stock);

        Stock result = stockService.removeStockQuantity(1, 3);

        assertNotNull(result);
        verify(mockRepository).update(any());
    }

    @Test
    @DisplayName("Should check if stock exists")
    void testStockExists() {
        when(mockRepository.existsById(1)).thenReturn(true);

        boolean result = stockService.stockExists(1);

        assertTrue(result);
    }
}

