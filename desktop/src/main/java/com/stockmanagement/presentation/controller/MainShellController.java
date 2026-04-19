package com.stockmanagement.presentation.controller;

import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.layout.StackPane;

/**
 * Main Shell Controller
 * Ticket: 1.1.1 - Initialize Main Application Window
 * Ticket: 1.1.2 - Implement MDI Desktop Pane
 *
 * This controller manages the root container (BorderPane) of the LPA Management System.
 * It serves as the primary orchestrator for the main application shell.
 *
 * Responsibilities:
 * - Initialize the main window layout
 * - Manage interaction between different regions (top, center, bottom)
 * - Prepare the workspace container for future menu bar and MDI pane integration
 * - Load and manage internal views dynamically into the workspace pane
 *
 * Architecture: Following DDD principles
 * - This is a Presentation Layer controller
 * - It acts as a bridge between the View (FXML) and Application/Domain services
 * - Will be expanded in subsequent tickets for menu routing and MDI management
 */
public class MainShellController {

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
        // Future: Initialize menu bar in the top region (Ticket 1.2.1)
        // Future: Initialize status bar in the bottom region if needed

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
