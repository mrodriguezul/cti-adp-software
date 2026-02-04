package com.stockmanagement;

import com.stockmanagement.application.service.StockService;
import com.stockmanagement.infrastructure.config.DatabaseConfig;
import com.stockmanagement.infrastructure.persistence.MySQLStockRepository;
import com.stockmanagement.presentation.controller.StockController;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

/**
 * Main JavaFX Application
 * Entry point for the Stock Management System
 */
public class StockManagementApp extends Application {

    private StockService stockService;

    @Override
    public void init() {
        // Initialize dependencies following DDD and Dependency Injection principles
        MySQLStockRepository stockRepository = new MySQLStockRepository();
        stockService = new StockService(stockRepository);
    }

    @Override
    public void start(Stage primaryStage) {
        try {
            // Load FXML with custom controller factory
            FXMLLoader loader = new FXMLLoader(
                getClass().getResource("/com/stockmanagement/presentation/view/stock-view.fxml")
            );
            
            // Set controller factory to inject dependencies
            loader.setControllerFactory(param -> new StockController(stockService));
            
            Parent root = loader.load();
            
            Scene scene = new Scene(root);
            
            primaryStage.setTitle("Stock Management System");
            primaryStage.setScene(scene);
            primaryStage.setMinWidth(1000);
            primaryStage.setMinHeight(600);
            primaryStage.show();
            
        } catch (Exception e) {
            e.printStackTrace();
            showErrorAndExit("Failed to load application: " + e.getMessage());
        }
    }

    @Override
    public void stop() {
        // Clean up resources
        DatabaseConfig.getInstance().close();
    }

    private void showErrorAndExit(String message) {
        System.err.println(message);
        System.exit(1);
    }

    public static void main(String[] args) {
        launch(args);
    }
}
