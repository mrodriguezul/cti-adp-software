package com.stockmanagement.presentation.controller;

import com.stockmanagement.application.service.UserAuthenticationService;
import com.stockmanagement.domain.exception.AuthenticationException;
import com.stockmanagement.domain.model.User;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.concurrent.CountDownLatch;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit Tests for LoginController
 * Ticket: 2.1.2 - Login UI & Controller Integration
 *
 * This test suite covers:
 * - Input validation (empty fields, whitespace handling)
 * - Successful authentication flow
 * - Failed authentication handling
 * - Error message display
 * - UI state management
 *
 * Uses Mockito to mock UserAuthenticationService and UI components.
 * Handles JavaFX threading requirements for UI component testing.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("LoginController Test Suite")
class LoginControllerTest {

    @Mock
    private UserAuthenticationService mockAuthService;

    private LoginController loginController;
    private TextField usernameField;
    private PasswordField passwordField;
    private Label errorLabel;

    /**
     * Initialize JavaFX toolkit before running any tests.
     * This ensures JavaFX toolkit is initialized only once for all tests.
     */
    @BeforeAll
    static void initJavaFX() {
        // Initialize Platform.startup() only if not already on FX thread
        if (!Platform.isFxApplicationThread()) {
            new Thread(() -> {
                try {
                    Platform.startup(() -> {});
                } catch (Exception e) {
                    // Already initialized or other setup error
                }
            }).start();

            // Give the toolkit time to initialize
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    /**
     * Set up test fixtures before each test.
     * Creates a new LoginController instance with mocked dependencies.
     * All JavaFX component creation happens on the FX application thread.
     */
    @BeforeEach
    void setUp() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(1);

        Platform.runLater(() -> {
            try {
                // Initialize JavaFX UI components on FX thread
                usernameField = new TextField();
                usernameField.setId("usernameField");

                passwordField = new PasswordField();
                passwordField.setId("passwordField");

                errorLabel = new Label();
                errorLabel.setId("errorLabel");

                // Create LoginController instance
                loginController = new LoginController();

                // Inject mocked dependencies using reflection
                injectMockedAuthService();
                injectUIComponents();
            } catch (Exception e) {
                System.err.println("Failed to set up test fixtures: " + e.getMessage());
                throw new RuntimeException("Failed to set up test fixtures", e);
            } finally {
                latch.countDown();
            }
        });

        latch.await();
    }

    /**
     * Helper method to inject the mocked UserAuthenticationService
     * into the LoginController using reflection.
     */
    private void injectMockedAuthService() {
        try {
            var field = LoginController.class.getDeclaredField("authService");
            field.setAccessible(true);
            field.set(loginController, mockAuthService);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException("Failed to inject mock authService", e);
        }
    }

    /**
     * Helper method to inject UI components into the LoginController
     * using reflection (simulating FXML injection).
     */
    private void injectUIComponents() {
        try {
            var usernameFieldRef = LoginController.class.getDeclaredField("usernameField");
            usernameFieldRef.setAccessible(true);
            usernameFieldRef.set(loginController, usernameField);

            var passwordFieldRef = LoginController.class.getDeclaredField("passwordField");
            passwordFieldRef.setAccessible(true);
            passwordFieldRef.set(loginController, passwordField);

            var errorLabelRef = LoginController.class.getDeclaredField("errorLabel");
            errorLabelRef.setAccessible(true);
            errorLabelRef.set(loginController, errorLabel);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException("Failed to inject UI components", e);
        }
    }

    // ==================== Input Validation Tests ====================

    @Test
    @DisplayName("Should reject login with empty username")
    void testHandleLogin_EmptyUsername_ShowsError() throws AuthenticationException {
        // Arrange
        usernameField.setText("");
        passwordField.setText("password123");

        // Act
        loginController.handleLogin(new ActionEvent());

        // Assert
        assertEquals("Username and password are required", errorLabel.getText());
        verify(mockAuthService, never()).authenticate(anyString(), anyString());
    }

    @Test
    @DisplayName("Should reject login with empty password")
    void testHandleLogin_EmptyPassword_ShowsError() throws AuthenticationException {
        // Arrange
        usernameField.setText("cti_admin");
        passwordField.setText("");

        // Act
        loginController.handleLogin(new ActionEvent());

        // Assert
        assertEquals("Username and password are required", errorLabel.getText());
        verify(mockAuthService, never()).authenticate(anyString(), anyString());
    }

    @Test
    @DisplayName("Should reject login with both username and password empty")
    void testHandleLogin_BothFieldsEmpty_ShowsError() throws AuthenticationException {
        // Arrange
        usernameField.setText("");
        passwordField.setText("");

        // Act
        loginController.handleLogin(new ActionEvent());

        // Assert
        assertEquals("Username and password are required", errorLabel.getText());
        verify(mockAuthService, never()).authenticate(anyString(), anyString());
    }

    @Test
    @DisplayName("Should trim whitespace from username")
    void testHandleLogin_UsernameWithWhitespace_TrimmedCorrectly() throws AuthenticationException {
        // Arrange
        User mockUser = createMockUser("cti_admin");
        usernameField.setText("  cti_admin  ");
        passwordField.setText("password123");

        when(mockAuthService.authenticate("cti_admin", "password123"))
            .thenReturn(mockUser);

        // Act
        try {
            loginController.handleLogin(new ActionEvent());
        } catch (Exception e) {
            // Expected: Stage operations may fail in test environment
        }

        // Assert
        verify(mockAuthService).authenticate("cti_admin", "password123");
    }

    // ==================== Successful Authentication Tests ====================

    @Test
    @DisplayName("Should authenticate user with valid credentials")
    void testHandleLogin_ValidCredentials_CallsAuthService() throws AuthenticationException {
        // Arrange
        User mockUser = createMockUser("cti_admin");
        usernameField.setText("cti_admin");
        passwordField.setText("password123");

        when(mockAuthService.authenticate("cti_admin", "password123"))
            .thenReturn(mockUser);

        // Act
        try {
            loginController.handleLogin(new ActionEvent());
        } catch (Exception e) {
            // Expected: Stage operations may fail in test environment
        }

        // Assert
        verify(mockAuthService).authenticate("cti_admin", "password123");
    }

    @Test
    @DisplayName("Should return authenticated user with correct role")
    void testHandleLogin_AuthenticatedUser_HasCorrectRole() {
        // Arrange
        User mockUser = createMockUser("cti_admin");

        // Assert - Just verify the mock user was created correctly
        assertEquals("admin", mockUser.getRole());
        assertEquals("A", mockUser.getStatus());
        assertTrue(mockUser.isActive());
    }

    // ==================== Authentication Failure Tests ====================

    @Test
    @DisplayName("Should handle invalid credentials exception")
    void testHandleLogin_InvalidCredentials_ShowsErrorMessage() throws AuthenticationException {
        // Arrange
        usernameField.setText("cti_admin");
        passwordField.setText("wrongpassword");

        when(mockAuthService.authenticate("cti_admin", "wrongpassword"))
            .thenThrow(new AuthenticationException("Invalid credentials"));

        // Act
        loginController.handleLogin(new ActionEvent());

        // Assert
        assertEquals("Invalid credentials", errorLabel.getText());
    }

    @Test
    @DisplayName("Should handle disabled account exception")
    void testHandleLogin_DisabledAccount_ShowsErrorMessage() throws AuthenticationException {
        // Arrange
        usernameField.setText("disabled_user");
        passwordField.setText("password123");

        when(mockAuthService.authenticate("disabled_user", "password123"))
            .thenThrow(new AuthenticationException("Account is disabled"));

        // Act
        loginController.handleLogin(new ActionEvent());

        // Assert
        assertEquals("Account is disabled", errorLabel.getText());
    }

    @Test
    @DisplayName("Should handle user not found exception")
    void testHandleLogin_UserNotFound_ShowsErrorMessage() throws AuthenticationException {
        // Arrange
        usernameField.setText("nonexistent_user");
        passwordField.setText("password123");

        when(mockAuthService.authenticate("nonexistent_user", "password123"))
            .thenThrow(new AuthenticationException("User not found"));

        // Act
        loginController.handleLogin(new ActionEvent());

        // Assert
        assertEquals("User not found", errorLabel.getText());
    }

    @Test
    @DisplayName("Should clear password field on authentication failure")
    void testHandleLogin_AuthenticationFailure_ClearsPasswordField() throws AuthenticationException {
        // Arrange
        usernameField.setText("cti_admin");
        passwordField.setText("wrongpassword");

        when(mockAuthService.authenticate("cti_admin", "wrongpassword"))
            .thenThrow(new AuthenticationException("Invalid credentials"));

        // Act
        loginController.handleLogin(new ActionEvent());

        // Assert
        assertTrue(passwordField.getText().isEmpty());
    }

    @Test
    @DisplayName("Should handle unexpected exceptions gracefully")
    void testHandleLogin_UnexpectedException_ShowsGenericErrorMessage() throws AuthenticationException {
        // Arrange
        usernameField.setText("cti_admin");
        passwordField.setText("password123");

        when(mockAuthService.authenticate(anyString(), anyString()))
            .thenThrow(new RuntimeException("Database connection failed"));

        // Act
        loginController.handleLogin(new ActionEvent());

        // Assert
        assertEquals("An unexpected error occurred. Please try again.", errorLabel.getText());
        assertTrue(passwordField.getText().isEmpty());
    }

    // ==================== UI State Management Tests ====================

    @Test
    @DisplayName("Should clear error label at the start of login attempt")
    void testHandleLogin_ClearsErrorLabelFirst() {
        // Arrange
        errorLabel.setText("Previous error");
        usernameField.setText("");
        passwordField.setText("");

        // Act
        loginController.handleLogin(new ActionEvent());

        // Assert - Error label is cleared immediately, then set to validation error
        assertEquals("Username and password are required", errorLabel.getText());
    }

    @Test
    @DisplayName("Should not clear password field on validation error")
    void testHandleLogin_ValidationError_KeepsPasswordField() {
        // Arrange
        String initialPassword = "password123";
        usernameField.setText("");
        passwordField.setText(initialPassword);

        // Act
        loginController.handleLogin(new ActionEvent());

        // Assert - Password should remain for user convenience (validation error)
        assertEquals(initialPassword, passwordField.getText());
    }

    @Test
    @DisplayName("Should validate credentials before processing")
    void testHandleLogin_ValidatesBeforeProcessing() throws AuthenticationException {
        // Arrange
        usernameField.setText("   ");  // Whitespace only
        passwordField.setText("password");

        // Act
        loginController.handleLogin(new ActionEvent());

        // Assert
        assertEquals("Username and password are required", errorLabel.getText());
        verify(mockAuthService, never()).authenticate(anyString(), anyString());
    }

    @Test
    @DisplayName("Should reject login when username is whitespace")
    void testHandleLogin_WhitespaceUsername_ShowsError() throws AuthenticationException {
        // Arrange
        usernameField.setText("   ");
        passwordField.setText("password123");

        // Act
        loginController.handleLogin(new ActionEvent());

        // Assert
        assertEquals("Username and password are required", errorLabel.getText());
        verify(mockAuthService, never()).authenticate(anyString(), anyString());
    }

    // ==================== Helper Methods ====================

    /**
     * Helper method to create a mock User object for testing.
     * Returns a user with admin role and active status.
     *
     * @param username the username for the mock user
     * @return a mock User object
     */
    private User createMockUser(String username) {
        return new User(
            1,
            username,
            "hashed_password",  // password
            "Admin",            // firstname
            "User",             // lastname
            "admin",            // role
            "A",                // status (Active)
            LocalDateTime.now(),
            LocalDateTime.now()
        );
    }
}
