package com.stockmanagement.presentation.controller;

import com.stockmanagement.application.service.UserAuthenticationService;
import com.stockmanagement.domain.exception.AuthenticationException;
import com.stockmanagement.domain.model.User;
import com.stockmanagement.infrastructure.persistence.PostgreSQLUserRepository;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.io.IOException;
import java.util.logging.Logger;
import java.util.logging.Level;

/**
 * Login Controller
 * Ticket: 2.1.2 - Login UI & Controller Integration
 *
 * This controller manages the login screen interaction and authentication flow.
 * It coordinates between the UI (login-view.fxml) and the authentication service
 * to verify user credentials and transition to the main shell upon success.
 *
 * Responsibilities:
 * - Handle user input from the login form
 * - Invoke the UserAuthenticationService to validate credentials
 * - Display authentication errors to the user
 * - Transition to the main shell upon successful authentication
 * - Close the login window and open the main application window
 *
 * Architecture:
 * - Controller depends on UserAuthenticationService (injected or instantiated)
 * - Follows MVC pattern with FXML markup handling presentation
 * - Maintains separation between UI logic and business logic
 */
public class LoginController {

    private static final Logger LOGGER = Logger.getLogger(LoginController.class.getName());

    // FXML Injected UI Components
    @FXML
    private TextField usernameField;

    @FXML
    private PasswordField passwordField;

    @FXML
    private Label errorLabel;

    // Authentication Service (instantiated here for simplicity)
    private UserAuthenticationService authService;

    /**
     * Initialize the controller.
     * Called automatically by FXMLLoader after the FXML is loaded.
     * Sets up the authentication service with the PostgreSQL repository.
     */
    @FXML
    public void initialize() {
        // Instantiate the authentication service with PostgreSQL repository
        // In a production system, this would use a dependency injection container
        PostgreSQLUserRepository userRepository = new PostgreSQLUserRepository();
        this.authService = new UserAuthenticationService(userRepository);

        // Ensure error label is initially empty
        errorLabel.setText("");
    }

    /**
     * Handles the login button click event.
     *
     * This method:
     * 1. Clears any previous error messages
     * 2. Retrieves username and password from the input fields
     * 3. Calls the authentication service to validate credentials
     * 4. On success: Closes the login window and opens the main shell
     * 5. On failure: Displays the error message to the user
     *
     * @param event the ActionEvent triggered by the login button click
     */
    @FXML
    public void handleLogin(ActionEvent event) {
        // Step 1: Clear previous error messages
        errorLabel.setText("");

        // Step 2: Retrieve username and password from input fields
        String username = usernameField.getText().trim();
        String password = passwordField.getText();

        // Validate that fields are not empty
        if (username.isEmpty() || password.isEmpty()) {
            errorLabel.setText("Username and password are required");
            return;
        }

        try {
            // Step 3: Attempt authentication
            User authenticatedUser = authService.authenticate(username, password);

            LOGGER.log(Level.INFO, "User authenticated successfully: " + username);

            // Step 4: Close the login window
            Stage loginStage = (Stage) usernameField.getScene().getWindow();
            loginStage.close();

            // Step 5: Open the main shell window
            openMainShell();

        } catch (AuthenticationException e) {
            // Step 5: Display error message
            LOGGER.log(Level.WARNING, "Authentication failed: " + e.getMessage());
            errorLabel.setText(e.getMessage());

            // Clear the password field for security
            passwordField.clear();
        } catch (Exception e) {
            // Handle unexpected errors
            LOGGER.log(Level.SEVERE, "Unexpected error during login", e);
            errorLabel.setText("An unexpected error occurred. Please try again.");
            passwordField.clear();
        }
    }

    /**
     * Opens the main shell window after successful authentication.
     *
     * This method:
     * 1. Loads the main-shell.fxml file
     * 2. Creates a new Stage for the main application
     * 3. Sets the stage to maximized
     * 4. Displays the main shell to the user
     *
     * @throws IOException if the main-shell.fxml file cannot be loaded
     */
    private void openMainShell() {
        try {
            // Load the main-shell.fxml file
            FXMLLoader loader = new FXMLLoader(
                getClass().getResource("/com/stockmanagement/presentation/view/main-shell.fxml")
            );

            Parent root = loader.load();

            // Create a new Stage for the main shell
            Stage mainShell = new Stage();
            Scene scene = new Scene(root, 800, 600);

            // Configure and display the main shell
            mainShell.setTitle("LPA Management System");
            mainShell.setScene(scene);
            mainShell.setMaximized(true);
            mainShell.show();

            LOGGER.log(Level.INFO, "Main shell opened successfully");

        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Failed to load main shell", e);
            errorLabel.setText("Failed to load the main application. Please contact support.");
        }
    }
}

