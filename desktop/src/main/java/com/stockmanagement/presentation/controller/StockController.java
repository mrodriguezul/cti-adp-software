package com.stockmanagement.presentation.controller;

import com.stockmanagement.application.service.StockService;
import com.stockmanagement.domain.model.Stock;
import javafx.beans.property.SimpleObjectProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

/**
 * JavaFX Controller for Stock Management UI
 */
public class StockController {

    @FXML private TableView<Stock> stockTable;
    @FXML private TableColumn<Stock, Integer> idColumn;
    @FXML private TableColumn<Stock, String> productNameColumn;
    @FXML private TableColumn<Stock, String> descriptionColumn;
    @FXML private TableColumn<Stock, Integer> quantityColumn;
    @FXML private TableColumn<Stock, BigDecimal> priceColumn;
    @FXML private TableColumn<Stock, String> categoryColumn;
    @FXML private TableColumn<Stock, String> createdAtColumn;
    @FXML private TableColumn<Stock, String> updatedAtColumn;

    @FXML private TextField productNameField;
    @FXML private TextArea descriptionField;
    @FXML private TextField quantityField;
    @FXML private TextField priceField;
    @FXML private TextField categoryField;
    @FXML private TextField searchField;

    @FXML private Button saveButton;
    @FXML private Button updateButton;
    @FXML private Button deleteButton;
    @FXML private Button clearButton;

    private final StockService stockService;
    private final ObservableList<Stock> stockList;
    private Stock selectedStock;
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public StockController(StockService stockService) {
        this.stockService = stockService;
        this.stockList = FXCollections.observableArrayList();
    }

    @FXML
    public void initialize() {
        setupTableColumns();
        setupTableSelection();
        setupButtonStates();
        loadAllStocks();
        setupSearchListener();
    }

    private void setupTableColumns() {
        idColumn.setCellValueFactory(new PropertyValueFactory<>("id"));
        productNameColumn.setCellValueFactory(new PropertyValueFactory<>("productName"));
        descriptionColumn.setCellValueFactory(new PropertyValueFactory<>("description"));
        quantityColumn.setCellValueFactory(new PropertyValueFactory<>("quantity"));
        priceColumn.setCellValueFactory(new PropertyValueFactory<>("price"));
        categoryColumn.setCellValueFactory(new PropertyValueFactory<>("category"));
        
        // Custom cell factories for date formatting
        createdAtColumn.setCellValueFactory(cellData -> {
            LocalDateTime dateTime = cellData.getValue().getCreatedAt();
            return new SimpleStringProperty(dateTime != null ? dateTime.format(dateFormatter) : "");
        });
        
        updatedAtColumn.setCellValueFactory(cellData -> {
            LocalDateTime dateTime = cellData.getValue().getUpdatedAt();
            return new SimpleStringProperty(dateTime != null ? dateTime.format(dateFormatter) : "");
        });

        // Price formatting
        priceColumn.setCellFactory(col -> new TableCell<Stock, BigDecimal>() {
            @Override
            protected void updateItem(BigDecimal price, boolean empty) {
                super.updateItem(price, empty);
                if (empty || price == null) {
                    setText(null);
                } else {
                    setText(String.format("$%.2f", price));
                }
            }
        });

        stockTable.setItems(stockList);
    }

    private void setupTableSelection() {
        stockTable.getSelectionModel().selectedItemProperty().addListener(
            (observable, oldValue, newValue) -> {
                selectedStock = newValue;
                if (newValue != null) {
                    populateFields(newValue);
                    updateButton.setDisable(false);
                    deleteButton.setDisable(false);
                } else {
                    updateButton.setDisable(true);
                    deleteButton.setDisable(true);
                }
            }
        );
    }

    private void setupButtonStates() {
        updateButton.setDisable(true);
        deleteButton.setDisable(true);
    }

    private void setupSearchListener() {
        searchField.textProperty().addListener((observable, oldValue, newValue) -> {
            handleSearch();
        });
    }

    @FXML
    private void handleSave() {
        try {
            validateInputs();
            
            String productName = productNameField.getText().trim();
            String description = descriptionField.getText().trim();
            Integer quantity = Integer.parseInt(quantityField.getText().trim());
            BigDecimal price = new BigDecimal(priceField.getText().trim());
            String category = categoryField.getText().trim();

            stockService.createStock(productName, description, quantity, price, category);
            
            showSuccess("Stock item created successfully!");
            clearFields();
            loadAllStocks();
            
        } catch (NumberFormatException e) {
            showError("Invalid number format. Please check quantity and price fields.");
        } catch (IllegalArgumentException e) {
            showError(e.getMessage());
        } catch (Exception e) {
            showError("Error saving stock: " + e.getMessage());
        }
    }

    @FXML
    private void handleUpdate() {
        if (selectedStock == null) {
            showError("Please select a stock item to update.");
            return;
        }

        try {
            validateInputs();
            
            String productName = productNameField.getText().trim();
            String description = descriptionField.getText().trim();
            Integer quantity = Integer.parseInt(quantityField.getText().trim());
            BigDecimal price = new BigDecimal(priceField.getText().trim());
            String category = categoryField.getText().trim();

            stockService.updateStock(selectedStock.getId(), productName, description, 
                                   quantity, price, category);
            
            showSuccess("Stock item updated successfully!");
            clearFields();
            loadAllStocks();
            
        } catch (NumberFormatException e) {
            showError("Invalid number format. Please check quantity and price fields.");
        } catch (IllegalArgumentException e) {
            showError(e.getMessage());
        } catch (Exception e) {
            showError("Error updating stock: " + e.getMessage());
        }
    }

    @FXML
    private void handleDelete() {
        if (selectedStock == null) {
            showError("Please select a stock item to delete.");
            return;
        }

        Alert confirmDialog = new Alert(Alert.AlertType.CONFIRMATION);
        confirmDialog.setTitle("Confirm Delete");
        confirmDialog.setHeaderText("Delete Stock Item");
        confirmDialog.setContentText("Are you sure you want to delete: " + 
                                    selectedStock.getProductName() + "?");

        Optional<ButtonType> result = confirmDialog.showAndWait();
        if (result.isPresent() && result.get() == ButtonType.OK) {
            try {
                stockService.deleteStock(selectedStock.getId());
                showSuccess("Stock item deleted successfully!");
                clearFields();
                loadAllStocks();
            } catch (Exception e) {
                showError("Error deleting stock: " + e.getMessage());
            }
        }
    }

    @FXML
    private void handleClear() {
        clearFields();
        stockTable.getSelectionModel().clearSelection();
    }

    @FXML
    private void handleSearch() {
        String searchText = searchField.getText().trim();
        try {
            if (searchText.isEmpty()) {
                loadAllStocks();
            } else {
                stockList.clear();
                stockList.addAll(stockService.searchStocksByName(searchText));
            }
        } catch (Exception e) {
            showError("Error searching stocks: " + e.getMessage());
        }
    }

    @FXML
    private void handleRefresh() {
        loadAllStocks();
        searchField.clear();
        showSuccess("Stock list refreshed!");
    }

    private void loadAllStocks() {
        try {
            stockList.clear();
            stockList.addAll(stockService.getAllStocks());
        } catch (Exception e) {
            showError("Error loading stocks: " + e.getMessage());
        }
    }

    private void populateFields(Stock stock) {
        productNameField.setText(stock.getProductName());
        descriptionField.setText(stock.getDescription());
        quantityField.setText(stock.getQuantity().toString());
        priceField.setText(stock.getPrice().toString());
        categoryField.setText(stock.getCategory());
    }

    private void clearFields() {
        productNameField.clear();
        descriptionField.clear();
        quantityField.clear();
        priceField.clear();
        categoryField.clear();
        selectedStock = null;
        updateButton.setDisable(true);
        deleteButton.setDisable(true);
    }

    private void validateInputs() {
        if (productNameField.getText().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name is required");
        }
        if (quantityField.getText().trim().isEmpty()) {
            throw new IllegalArgumentException("Quantity is required");
        }
        if (priceField.getText().trim().isEmpty()) {
            throw new IllegalArgumentException("Price is required");
        }
    }

    private void showSuccess(String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Success");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    private void showError(String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("Error");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}
