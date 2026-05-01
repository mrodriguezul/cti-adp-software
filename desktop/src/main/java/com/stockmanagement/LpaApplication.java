package com.stockmanagement;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import java.util.logging.Logger;
import java.util.logging.Level;

/**
 * Main JavaFX Application Entry Point
 * LPA Management System - Primary application launcher
 *
 * Ticket: 1.1.1 - Initialize Main Application Window
 * This class initializes the main application window which opens maximized by default,
 * serving as the parent workspace container for all business operations.
 *
 * Architecture: Domain-Driven Design (DDD)
 * - Presentation Layer: This class handles UI initialization
 * - Dependencies injected through controllers via FXMLLoader
 */
public class LpaApplication extends Application {

    private static final Logger LOGGER = Logger.getLogger(LpaApplication.class.getName());

    /**
     * Initializes the JavaFX application.
     * This method is called before the start() method.
     */
    @Override
    public void init() {
        // Future: Initialize global application services and dependency injection containers
    }

    /**
     * Starts the JavaFX application with the main window.
     *
     * @param primaryStage the primary stage for the application window
     */
    @Override
    public void start(Stage primaryStage) {
        try {
            // Load the login FXML file
            FXMLLoader loader = new FXMLLoader(
                getClass().getResource("/com/stockmanagement/presentation/view/login-view.fxml")
            );

            // Load the root node from FXML
            Parent root = loader.load();

            // Create the scene with fixed size for login window
            Scene scene = new Scene(root, 400, 350);

            // Configure the primary stage
            primaryStage.setTitle("LPA Login");
            primaryStage.setScene(scene);
            primaryStage.setResizable(false); // Prevent resizing the login window
            primaryStage.show();

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to load application", e);
            showErrorAndExit("Failed to load login screen: " + e.getMessage());
        }
    }

    /**
     * Handles application cleanup during shutdown.
     */
    @Override
    public void stop() {
        // Future: Clean up resources such as database connections
    }

    /**
     * Displays an error message and exits the application.
     *
     * @param message the error message to display
     */
    private void showErrorAndExit(String message) {
        LOGGER.log(Level.SEVERE, "Application Error: " + message);
        System.exit(1);
    }

    /**
     * Main entry point for the application.
     *
     * @param args command-line arguments
     */
    public static void main(String[] args) {
        launch(args);
    }
}
