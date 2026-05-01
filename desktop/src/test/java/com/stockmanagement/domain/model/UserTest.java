package com.stockmanagement.domain.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mindrot.jbcrypt.BCrypt;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for User domain entity
 *
 * Test coverage includes:
 * - User creation with valid data
 * - Null validation for required fields
 * - User account status checking
 * - User role checking
 * - Equality and hash code implementation
 */
@DisplayName("User Domain Model Tests")
class UserTest {

    private String testPasswordHash;
    private LocalDateTime testDateTime;

    @BeforeEach
    void setUp() {
        testPasswordHash = BCrypt.hashpw("testPassword123", BCrypt.gensalt());
        testDateTime = LocalDateTime.now();
    }

    @Test
    @DisplayName("Should create User with valid data")
    void testCreateUserWithValidData() {
        // Act
        User user = new User(
            1,
            "testuser",
            testPasswordHash,
            "Test",
            "User",
            "user",
            "A",
            testDateTime,
            testDateTime
        );

        // Assert
        assertEquals(1, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals(testPasswordHash, user.getPassword());
        assertEquals("Test", user.getFirstname());
        assertEquals("User", user.getLastname());
        assertEquals("user", user.getRole());
        assertEquals("A", user.getStatus());
        assertNotNull(user.getCreatedAt());
        assertNotNull(user.getUpdatedAt());
    }

    @Test
    @DisplayName("Should throw NullPointerException when ID is null")
    void testCreateUserWithNullId() {
        // Act & Assert
        NullPointerException exception = assertThrows(
            NullPointerException.class,
            () -> new User(
                null,
                "testuser",
                testPasswordHash,
                "Test",
                "User",
                "user",
                "A",
                testDateTime,
                testDateTime
            )
        );

        assertEquals("User ID cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw NullPointerException when username is null")
    void testCreateUserWithNullUsername() {
        // Act & Assert
        NullPointerException exception = assertThrows(
            NullPointerException.class,
            () -> new User(
                1,
                null,
                testPasswordHash,
                "Test",
                "User",
                "user",
                "A",
                testDateTime,
                testDateTime
            )
        );

        assertEquals("Username cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw NullPointerException when password hash is null")
    void testCreateUserWithNullPasswordHash() {
        // Act & Assert
        NullPointerException exception = assertThrows(
            NullPointerException.class,
            () -> new User(
                1,
                "testuser",
                null,
                "Test",
                "User",
                "user",
                "A",
                testDateTime,
                testDateTime
            )
        );

        assertEquals("Password cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw NullPointerException when role is null")
    void testCreateUserWithNullRole() {
        // Act & Assert
        NullPointerException exception = assertThrows(
            NullPointerException.class,
            () -> new User(
                1,
                "testuser",
                testPasswordHash,
                "Test",
                "User",
                null,
                "A",
                testDateTime,
                testDateTime
            )
        );

        assertEquals("Role cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw NullPointerException when status is null")
    void testCreateUserWithNullStatus() {
        // Act & Assert
        NullPointerException exception = assertThrows(
            NullPointerException.class,
            () -> new User(
                1,
                "testuser",
                testPasswordHash,
                "Test",
                "User",
                "user",
                null,
                testDateTime,
                testDateTime
            )
        );

        assertEquals("Status cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should return true for isActive when status is 'A'")
    void testIsActiveWithActiveStatus() {
        // Arrange
        User user = new User(
            1,
            "testuser",
            testPasswordHash,
            "Test",
            "User",
            "user",
            "A",
            testDateTime,
            testDateTime
        );

        // Act & Assert
        assertTrue(user.isActive());
    }

    @Test
    @DisplayName("Should return false for isActive when status is 'D'")
    void testIsActiveWithDisabledStatus() {
        // Arrange
        User user = new User(
            1,
            "disableduser",
            testPasswordHash,
            "Disabled",
            "User",
            "user",
            "D",
            testDateTime,
            testDateTime
        );

        // Act & Assert
        assertFalse(user.isActive());
    }

    @Test
    @DisplayName("Should return true for isAdmin when role is 'admin'")
    void testIsAdminWithAdminRole() {
        // Arrange
        User user = new User(
            2,
            "admin",
            testPasswordHash,
            "Admin",
            "User",
            "admin",
            "A",
            testDateTime,
            testDateTime
        );

        // Act & Assert
        assertTrue(user.isAdmin());
    }

    @Test
    @DisplayName("Should return false for isAdmin when role is 'user'")
    void testIsAdminWithUserRole() {
        // Arrange
        User user = new User(
            1,
            "testuser",
            testPasswordHash,
            "Test",
            "User",
            "user",
            "A",
            testDateTime,
            testDateTime
        );

        // Act & Assert
        assertFalse(user.isAdmin());
    }

    @Test
    @DisplayName("Should handle case-insensitive role comparison for isAdmin")
    void testIsAdminCaseInsensitive() {
        // Arrange
        User user = new User(
            2,
            "admin",
            testPasswordHash,
            "Admin",
            "User",
            "ADMIN",
            "A",
            testDateTime,
            testDateTime
        );

        // Act & Assert
        assertTrue(user.isAdmin());
    }

    @Test
    @DisplayName("Should handle case-insensitive status comparison for isActive")
    void testIsActiveCaseInsensitive() {
        // Arrange
        User user = new User(
            1,
            "testuser",
            testPasswordHash,
            "Test",
            "User",
            "user",
            "a",
            testDateTime,
            testDateTime
        );

        // Act & Assert
        assertTrue(user.isActive());
    }

    @Test
    @DisplayName("Two users with same ID and username should be equal")
    void testUserEquality() {
        // Arrange
        User user1 = new User(
            1,
            "testuser",
            testPasswordHash,
            "Test",
            "User",
            "user",
            "A",
            testDateTime,
            testDateTime
        );

        User user2 = new User(
            1,
            "testuser",
            "differentHash",
            "Different",
            "Name",
            "admin",
            "D",
            testDateTime,
            testDateTime
        );

        // Act & Assert
        assertEquals(user1, user2);
    }

    @Test
    @DisplayName("Two users with different IDs should not be equal")
    void testUserInequalityByDifferentId() {
        // Arrange
        User user1 = new User(
            1,
            "testuser",
            testPasswordHash,
            "Test",
            "User",
            "user",
            "A",
            testDateTime,
            testDateTime
        );

        User user2 = new User(
            2,
            "testuser",
            testPasswordHash,
            "Test",
            "User",
            "user",
            "A",
            testDateTime,
            testDateTime
        );

        // Act & Assert
        assertNotEquals(user1, user2);
    }

    @Test
    @DisplayName("Two users with same ID and username should have same hash code")
    void testUserHashCode() {
        // Arrange
        User user1 = new User(
            1,
            "testuser",
            testPasswordHash,
            "Test",
            "User",
            "user",
            "A",
            testDateTime,
            testDateTime
        );

        User user2 = new User(
            1,
            "testuser",
            "differentHash",
            "Different",
            "Name",
            "admin",
            "D",
            testDateTime,
            testDateTime
        );

        // Act & Assert
        assertEquals(user1.hashCode(), user2.hashCode());
    }

    @Test
    @DisplayName("User should not equal null")
    void testUserNotEqualsNull() {
        // Arrange
        User user = new User(
            1,
            "testuser",
            testPasswordHash,
            "Test",
            "User",
            "user",
            "A",
            testDateTime,
            testDateTime
        );

        // Act & Assert
        assertNotEquals(user, null);
    }

    @Test
    @DisplayName("User should not equal object of different type")
    void testUserNotEqualsOtherType() {
        // Arrange
        User user = new User(
            1,
            "testuser",
            testPasswordHash,
            "Test",
            "User",
            "user",
            "A",
            testDateTime,
            testDateTime
        );

        // Act & Assert
        assertNotEquals(user, "testuser");
    }

    @Test
    @DisplayName("User toString should contain meaningful information")
    void testUserToString() {
        // Arrange
        User user = new User(
            1,
            "testuser",
            testPasswordHash,
            "Test",
            "User",
            "user",
            "A",
            testDateTime,
            testDateTime
        );

        // Act
        String toString = user.toString();

        // Assert
        assertNotNull(toString);
        assertTrue(toString.contains("testuser"));
        assertTrue(toString.contains("Test"));
        assertTrue(toString.contains("User"));
        assertTrue(toString.contains("user")); // role
    }

    @Test
    @DisplayName("Should allow null for first name and last name")
    void testCreateUserWithNullNames() {
        // Act
        User user = new User(
            1,
            "testuser",
            testPasswordHash,
            null,
            null,
            "user",
            "A",
            testDateTime,
            testDateTime
        );

        // Assert
        assertNull(user.getFirstname());
        assertNull(user.getLastname());
        assertEquals("testuser", user.getUsername());
    }

    @Test
    @DisplayName("Should allow null for created and updated timestamps")
    void testCreateUserWithNullTimestamps() {
        // Act
        User user = new User(
            1,
            "testuser",
            testPasswordHash,
            "Test",
            "User",
            "user",
            "A",
            null,
            null
        );

        // Assert
        assertNull(user.getCreatedAt());
        assertNull(user.getUpdatedAt());
    }
}
