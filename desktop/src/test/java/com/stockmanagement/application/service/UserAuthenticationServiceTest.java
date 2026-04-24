package com.stockmanagement.application.service;

import com.stockmanagement.domain.exception.AuthenticationException;
import com.stockmanagement.domain.model.User;
import com.stockmanagement.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mindrot.jbcrypt.BCrypt;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserAuthenticationService
 *
 * Test coverage includes:
 * - Successful authentication with valid credentials
 * - Failed authentication with invalid username
 * - Failed authentication with invalid password
 * - Failed authentication with disabled user account
 * - Password hashing functionality
 * - Dependency injection validation
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserAuthenticationService Tests")
class UserAuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    private UserAuthenticationService authService;
    private User testUser;
    private String testPassword = "securePassword123";
    private String testPasswordHash;

    @BeforeEach
    void setUp() {
        // Initialize service with mocked repository
        authService = new UserAuthenticationService(userRepository);

        // Create test password hash
        testPasswordHash = BCrypt.hashpw(testPassword, BCrypt.gensalt());

        // Create a test user with active status and 'user' role
        testUser = new User(
            1,
            "testuser",
            testPasswordHash,
            "Test",
            "User",
            "user",
            "A",
            LocalDateTime.now(),
            LocalDateTime.now()
        );
    }

    @Test
    @DisplayName("Should successfully authenticate user with valid credentials")
    void testAuthenticateWithValidCredentials() throws AuthenticationException {
        // Arrange
        when(userRepository.findByUsername("testuser"))
            .thenReturn(Optional.of(testUser));

        // Act
        User authenticatedUser = authService.authenticate("testuser", testPassword);

        // Assert
        assertNotNull(authenticatedUser);
        assertEquals("testuser", authenticatedUser.getUsername());
        assertEquals("Test", authenticatedUser.getFirstname());
        assertEquals("user", authenticatedUser.getRole());
        assertTrue(authenticatedUser.isActive());

        // Verify repository was called once
        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    @DisplayName("Should throw AuthenticationException when username does not exist")
    void testAuthenticateWithInvalidUsername() {
        // Arrange
        when(userRepository.findByUsername("nonexistent"))
            .thenReturn(Optional.empty());

        // Act & Assert
        AuthenticationException exception = assertThrows(
            AuthenticationException.class,
            () -> authService.authenticate("nonexistent", testPassword)
        );

        assertEquals("Invalid credentials", exception.getMessage());
        verify(userRepository, times(1)).findByUsername("nonexistent");
    }

    @Test
    @DisplayName("Should throw AuthenticationException when password is incorrect")
    void testAuthenticateWithInvalidPassword() {
        // Arrange
        when(userRepository.findByUsername("testuser"))
            .thenReturn(Optional.of(testUser));

        // Act & Assert
        AuthenticationException exception = assertThrows(
            AuthenticationException.class,
            () -> authService.authenticate("testuser", "wrongPassword")
        );

        assertEquals("Invalid credentials", exception.getMessage());
        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    @DisplayName("Should throw AuthenticationException when user account is disabled")
    void testAuthenticateWithDisabledAccount() {
        // Arrange
        User disabledUser = new User(
            1,
            "disableduser",
            testPasswordHash,
            "Disabled",
            "User",
            "user",
            "D",  // Status is 'D' (Disabled)
            LocalDateTime.now(),
            LocalDateTime.now()
        );

        when(userRepository.findByUsername("disableduser"))
            .thenReturn(Optional.of(disabledUser));

        // Act & Assert
        AuthenticationException exception = assertThrows(
            AuthenticationException.class,
            () -> authService.authenticate("disableduser", testPassword)
        );

        assertEquals("Account is disabled", exception.getMessage());
        verify(userRepository, times(1)).findByUsername("disableduser");
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when username is null")
    void testAuthenticateWithNullUsername() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> authService.authenticate(null, testPassword)
        );

        assertEquals("Username cannot be null or empty", exception.getMessage());
        verify(userRepository, never()).findByUsername(anyString());
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when username is empty")
    void testAuthenticateWithEmptyUsername() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> authService.authenticate("", testPassword)
        );

        assertEquals("Username cannot be null or empty", exception.getMessage());
        verify(userRepository, never()).findByUsername(anyString());
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when password is null")
    void testAuthenticateWithNullPassword() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> authService.authenticate("testuser", null)
        );

        assertEquals("Password cannot be null or empty", exception.getMessage());
        verify(userRepository, never()).findByUsername(anyString());
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when password is empty")
    void testAuthenticateWithEmptyPassword() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> authService.authenticate("testuser", "")
        );

        assertEquals("Password cannot be null or empty", exception.getMessage());
        verify(userRepository, never()).findByUsername(anyString());
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when UserRepository is null in constructor")
    void testConstructorWithNullRepository() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> new UserAuthenticationService(null)
        );

        assertEquals("UserRepository cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should successfully hash password using BCrypt")
    void testHashPassword() {
        // Act
        String hashedPassword = UserAuthenticationService.hashPassword(testPassword);

        // Assert
        assertNotNull(hashedPassword);
        assertNotEquals(testPassword, hashedPassword); // Hashed ≠ plain text
        assertTrue(BCrypt.checkpw(testPassword, hashedPassword)); // Can verify
    }

    @Test
    @DisplayName("Should generate different hashes for same password")
    void testHashPasswordGeneratesDifferentHashesEachTime() {
        // Act
        String hash1 = UserAuthenticationService.hashPassword(testPassword);
        String hash2 = UserAuthenticationService.hashPassword(testPassword);

        // Assert
        assertNotEquals(hash1, hash2); // Different salts = different hashes
        assertTrue(BCrypt.checkpw(testPassword, hash1));
        assertTrue(BCrypt.checkpw(testPassword, hash2));
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when hashing null password")
    void testHashPasswordWithNullPassword() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> UserAuthenticationService.hashPassword(null)
        );

        assertEquals("Password cannot be null or empty", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when hashing empty password")
    void testHashPasswordWithEmptyPassword() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> UserAuthenticationService.hashPassword("")
        );

        assertEquals("Password cannot be null or empty", exception.getMessage());
    }

    @Test
    @DisplayName("Should authenticate admin user successfully")
    void testAuthenticateAdminUser() throws AuthenticationException {
        // Arrange
        User adminUser = new User(
            2,
            "admin",
            testPasswordHash,
            "Admin",
            "User",
            "admin",  // Role is 'admin'
            "A",
            LocalDateTime.now(),
            LocalDateTime.now()
        );

        when(userRepository.findByUsername("admin"))
            .thenReturn(Optional.of(adminUser));

        // Act
        User authenticatedUser = authService.authenticate("admin", testPassword);

        // Assert
        assertNotNull(authenticatedUser);
        assertTrue(authenticatedUser.isAdmin());
        assertEquals("admin", authenticatedUser.getRole());
    }

    @Test
    @DisplayName("Should not reveal if username exists (security)")
    void testAuthenticationDoesNotRevealUsernameExistence() {
        // Arrange
        when(userRepository.findByUsername("nonexistent"))
            .thenReturn(Optional.empty());

        // Act & Assert
        // Should get generic "Invalid credentials" error, not "User not found"
        AuthenticationException exception = assertThrows(
            AuthenticationException.class,
            () -> authService.authenticate("nonexistent", "anyPassword")
        );

        assertEquals("Invalid credentials", exception.getMessage());
    }
}
