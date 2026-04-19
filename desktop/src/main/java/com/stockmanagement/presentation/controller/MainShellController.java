package com.stockmanagement.presentation.controller;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.control.MenuItem;
import javafx.scene.control.Alert;
import javafx.scene.layout.StackPane;
import javafx.event.ActionEvent;
import javafx.application.Platform;
import java.io.IOException;
import java.util.logging.Logger;
import java.util.logging.Level;

/**
 * Main Shell Controller
 * Ticket: 1.1.1 - Initialize Main Application Window
 * Ticket: 1.1.2 - Implement MDI Desktop Pane
 * Ticket: 1.2.1 - Build Global Menu Bar UI
 * Ticket: 1.2.2 - Implement Menu Event Routing
 *
 * This controller manages the root container (BorderPane) of the LPA Management System.
 * It serves as the primary orchestrator for the main application shell.
 *
 * Responsibilities:
 * - Initialize the main window layout
 * - Manage interaction between different regions (top, center, bottom)
 * - Prepare the workspace container for future menu bar and MDI pane integration
 * - Load and manage internal views dynamically into the workspace pane
 * - Handle menu navigation events and route to appropriate module views (Ticket 1.2.2)
 * - Display graceful error alerts when views are unavailable
 *
 * Architecture: Following DDD principles
 * - This is a Presentation Layer controller
 * - It acts as a bridge between the View (FXML) and Application/Domain services
 * - Will be expanded in subsequent tickets for menu routing and MDI management
 */
public class MainShellController {

    private static final Logger LOGGER = Logger.getLogger(MainShellController.class.getName());

    /**
     * Central workspace pane injected from FXML.
     * This StackPane serves as the container for all internal views (child modules).
     * It can hold any JavaFX Node and stretches to fill the center region of the BorderPane.
     */
    @FXML
    private StackPane workspacePane;

    /**
     * Initializes the controller after the FXML has been loaded.
     * This method is called automatically by JavaFX when the FXML is loaded.
     *
     * Used for:
     * - Setting up event listeners
     * - Initializing UI components
     * - Loading initial data
     * - Proving that the workspace pane can accept and render child nodes
     */
    @FXML
    public void initialize() {
        setupMainShell();
        testWorkspacePane();
    }

    /**
     * Sets up the main shell layout and initializes regions.
     * This method is called during initialization to prepare the workspace.
     */
    private void setupMainShell() {
        // Menu bar is now initialized via FXML (Ticket 1.2.1)
        // Status bar initialization reserved for future implementation

        System.out.println("Main Shell initialized successfully");
    }

    /**
     * Tests the workspace pane by loading a simple test node.
     * This method demonstrates that the workspacePane can accept and render child nodes.
     *
     * In production, this will be replaced by actual view loading from menu interactions.
     */
    private void testWorkspacePane() {
        // Create a test label to verify the workspace pane works
        Label testLabel = new Label("Workspace Ready");
        testLabel.setStyle(
            "-fx-font-size: 18px; " +
            "-fx-text-fill: #4CAF50; " +
            "-fx-padding: 20px;"
        );

        // Use the loadInternalView method to add the test node
        loadInternalView(testLabel);

        System.out.println("Workspace pane test node loaded successfully");
    }

    /**
     * Handles menu item click events from the global menu bar (Ticket 1.2.1).
     * Routes to appropriate FXML views based on menu item ID (Ticket 1.2.2).
     *
     * This method is called whenever a MenuItem with onAction="#handleMenuClick" is clicked.
     * It extracts the menu item's ID and loads the corresponding FXML file or executes the action.
     *
     * @param event the ActionEvent triggered by a menu item click
     */
    @FXML
    public void handleMenuClick(ActionEvent event) {
        // Extract the source of the event (the clicked MenuItem)
        Object source = event.getSource();

        if (source instanceof MenuItem) {
            MenuItem clickedItem = (MenuItem) source;
            String menuItemId = clickedItem.getId();
            String menuText = clickedItem.getText();

            System.out.println("Menu item clicked: " + menuText + " (ID: " + menuItemId + ")");

            // Route to appropriate views based on menu item ID (Ticket 1.2.2)
            switch (menuItemId) {
                case "menuStock":
                    System.out.println("Loading Stock Management view...");
                    loadStockManagementView();
                    break;

                case "menuInvoices":
                    System.out.println("Loading Invoices view...");
                    loadView("/com/stockmanagement/presentation/view/invoices-view.fxml");
                    break;

                case "menuClients":
                    System.out.println("Loading Clients view...");
                    loadView("/com/stockmanagement/presentation/view/clients-view.fxml");
                    break;

                case "menuUsers":
                    System.out.println("Loading User Management view...");
                    loadView("/com/stockmanagement/presentation/view/user-management-view.fxml");
                    break;

                case "menuGuide":
                    System.out.println("Loading User Guide...");
                    loadView("/com/stockmanagement/presentation/view/user-guide-view.fxml");
                    break;

                case "menuAbout":
                    System.out.println("Showing About dialog...");
                    loadView("/com/stockmanagement/presentation/view/about-view.fxml");
                    break;

                case "menuExit":
                    System.out.println("Exiting application...");
                    Platform.exit();
                    System.exit(0);
                    break;

                default:
                    System.out.println("Unknown menu item: " + menuText);
                    break;
            }
        }
    }

    /**
     * Specialized method to load the Stock Management view with proper dependency injection.
     * The stock-view.fxml requires StockService to be injected into StockController.
     */
    private void loadStockManagementView() {
        try {
            FXMLLoader loader = new FXMLLoader(
                getClass().getResource("/com/stockmanagement/presentation/view/stock-view.fxml")
            );

            // Initialize dependencies for StockController
            com.stockmanagement.infrastructure.persistence.PostgreSQLStockRepository stockRepository =
                new com.stockmanagement.infrastructure.persistence.PostgreSQLStockRepository();
            com.stockmanagement.application.service.StockService stockService =
                new com.stockmanagement.application.service.StockService(stockRepository);

            // Set the controller factory to inject StockService
            loader.setControllerFactory(param -> new com.stockmanagement.presentation.controller.StockController(stockService));

            // Load the FXML and get the root Node
            javafx.scene.Node viewNode = loader.load();

            // Pass the loaded node to loadInternalView to display it
            loadInternalView(viewNode);

            System.out.println("Stock Management view loaded successfully");

        } catch (IOException ioException) {
            LOGGER.log(Level.SEVERE, "IOException while loading Stock Management view", ioException);
            showViewUnavailableError(
                "/com/stockmanagement/presentation/view/stock-view.fxml",
                "The Stock Management view file could not be found or accessed."
            );

        } catch (Exception exception) {
            LOGGER.log(Level.SEVERE, "Unexpected error while loading Stock Management view", exception);
            showViewUnavailableError(
                "/com/stockmanagement/presentation/view/stock-view.fxml",
                "An unexpected error occurred while loading the Stock Management module: " + exception.getMessage()
            );
        }
    }

    /**
     * Private helper method to load a view FXML file and display it in the workspace pane (Ticket 1.2.2).
     *
     * This method:
     * 1. Uses FXMLLoader to load the FXML resource from the provided path
     * 2. Passes the loaded Node to loadInternalView() to display it
     * 3. Catches IOException and NullPointerException for graceful error handling
     * 4. Displays a JavaFX Alert dialog explaining the error
     *
     * @param fxmlPath the resource path to the FXML file (e.g., "/com/stockmanagement/presentation/view/invoices-view.fxml")
     */
    private void loadView(String fxmlPath) {
        try {
            // Create an FXMLLoader with the specified FXML resource path
            FXMLLoader loader = new FXMLLoader(getClass().getResource(fxmlPath));

            // Load the FXML and get the root Node
            Node viewNode = loader.load();

            // Pass the loaded node to loadInternalView to display it
            loadInternalView(viewNode);

            System.out.println("View loaded successfully: " + fxmlPath);

        } catch (IOException ioException) {
            LOGGER.log(Level.SEVERE, "IOException while loading FXML: " + fxmlPath, ioException);
            showViewUnavailableError(fxmlPath, "The view file could not be found or accessed.");

        } catch (NullPointerException nullPointerException) {
            LOGGER.log(Level.SEVERE, "NullPointerException while loading FXML: " + fxmlPath, nullPointerException);
            showViewUnavailableError(fxmlPath, "The view file path is invalid or the resource does not exist.");

        } catch (Exception exception) {
            LOGGER.log(Level.SEVERE, "Unexpected error while loading FXML: " + fxmlPath, exception);
            showViewUnavailableError(fxmlPath, "An unexpected error occurred while loading the module.");
        }
    }

    /**
     * Displays a JavaFX Alert dialog when a view cannot be loaded.
     * This provides user-friendly feedback when a module is unavailable.
     *
     * @param fxmlPath the path to the FXML file that failed to load
     * @param detailMessage additional context about why the view failed to load
     */
    private void showViewUnavailableError(String fxmlPath, String detailMessage) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("View Unavailable");
        alert.setHeaderText("Unable to load module");
        alert.setContentText(
            "The requested module is currently under development or the file could not be found.\n\n" +
            "File: " + fxmlPath + "\n" +
            "Details: " + detailMessage
        );

        alert.showAndWait();
    }

    /**
     * Public helper method to load a new internal view into the workspace pane.
     *
     * This method:
     * 1. Clears any existing children from the workspace pane
     * 2. Adds the new view node to the pane
     *
     * This is the primary method used by menu controllers and other components
     * to dynamically switch between different module views (Stock, Sales, Admin, etc.).
     *
     * @param viewNode the JavaFX Node to display in the workspace pane
     *                 (can be an AnchorPane, VBox, custom control, etc.)
     * @throws IllegalArgumentException if viewNode is null
     */
    public void loadInternalView(Node viewNode) {
        if (viewNode == null) {
            throw new IllegalArgumentException("View node cannot be null");
        }

        // Clear existing children from the workspace pane
        workspacePane.getChildren().clear();

        // Add the new view node to the workspace pane
        workspacePane.getChildren().add(viewNode);

        System.out.println("Internal view loaded into workspace pane: " + viewNode.getClass().getSimpleName());
    }

    /**
     * Returns the workspace pane instance.
     * This may be useful for parent controllers or other components that need
     * to directly access the workspace pane's properties or state.
     *
     * @return the workspace StackPane
     */
    public StackPane getWorkspacePane() {
        return workspacePane;
    }
}
