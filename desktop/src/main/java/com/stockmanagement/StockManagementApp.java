package com.stockmanagement;

import com.stockmanagement.application.service.StockService;
import com.stockmanagement.infrastructure.config.DatabaseConfig;
import com.stockmanagement.infrastructure.persistence.PostgreSQLStockRepository;
import com.stockmanagement.presentation.controller.StockController;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

/**
 * DEPRECATED - Stock Management Standalone Application
 *
 * TICKET 3.1.1: This class has been refactored as part of the MDI shell integration.
 *
 * MIGRATION NOTICE:
 * This standalone Stock Management application is no longer the primary entry point.
 * Use LpaApplication.java as the main entry point for the integrated LPA Management System.
 *
 * HISTORY:
 * - Previously: Launched Stock Management as a standalone JavaFX application
 * - Now: Stock Management is integrated as an embedded child view within the LPA MDI shell
 *
 * USAGE:
 * 1. For normal operation: Run LpaApplication.java
 * 2. For isolated Stock Management testing: This class can still be used as a testing harness
 *    (see instructions below)
 *
 * TESTING HARNESS USAGE:
 * If you need to test Stock Management in isolation during development:
 * - Uncomment the main() method below
 * - Run StockManagementApp.java directly
 * - This will launch the legacy standalone interface for regression testing
 *
 * ARCHITECTURE:
 * The refactored design maintains complete separation of concerns:
 * - Domain Layer: Stock model and business logic (unchanged)
 * - Application Layer: StockService (unchanged)
 * - Presentation Layer: StockController now works as an embedded view
 *
 * @deprecated Use LpaApplication.java as the main entry point. This class is retained
 *             for backward compatibility and isolated testing purposes only.
 */
@Deprecated(since = "1.0", forRemoval = false)
public class StockManagementApp extends Application {

    private StockService stockService;

    @Override
    public void init() {
        // Initialize dependencies following DDD and Dependency Injection principles
        PostgreSQLStockRepository stockRepository = new PostgreSQLStockRepository();
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

    /**
     * TESTING HARNESS: Uncomment below to use this class for isolated Stock Management testing
     *
     * NOTE: For production use, always run LpaApplication.main(args) instead.
     */
    /*
    public static void main(String[] args) {
        launch(args);
    }
    */

    // Main entry point is now in LpaApplication.java
}
