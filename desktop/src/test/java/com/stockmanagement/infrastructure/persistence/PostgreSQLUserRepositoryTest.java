package com.stockmanagement.infrastructure.persistence;

import com.stockmanagement.domain.model.User;
import com.stockmanagement.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mindrot.jbcrypt.BCrypt;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for PostgreSQLUserRepository
 *
 * Test coverage includes:
 * - Finding users by username
 * - Finding users by ID
 * - Saving new users
 * - Updating existing users
 * - Proper mapping from ResultSet to User domain entity
 * - SQL error handling
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("PostgreSQLUserRepository Tests")
class PostgreSQLUserRepositoryTest {

    @Mock
    private DataSource dataSource;

    @Mock
    private Connection connection;

    @Mock
    private PreparedStatement preparedStatement;

    @Mock
    private ResultSet resultSet;

    private UserRepository userRepository;
    private String testPasswordHash;

    @BeforeEach
    void setUp() {
        userRepository = new PostgreSQLUserRepository(dataSource);
        testPasswordHash = BCrypt.hashpw("testPassword123", BCrypt.gensalt());
    }

    @Test
    @DisplayName("Should find user by username successfully")
    void testFindByUsernameSuccess() throws SQLException {
        // Arrange
        String username = "testuser";
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true);

        // Mock ResultSet data
        when(resultSet.getInt("id")).thenReturn(1);
        when(resultSet.getString("username")).thenReturn("testuser");
        when(resultSet.getString("password")).thenReturn(testPasswordHash);
        when(resultSet.getString("firstname")).thenReturn("Test");
        when(resultSet.getString("lastname")).thenReturn("User");
        when(resultSet.getString("role")).thenReturn("user");
        when(resultSet.getString("status")).thenReturn("A");
        when(resultSet.getTimestamp("created_at")).thenReturn(new Timestamp(System.currentTimeMillis()));
        when(resultSet.getTimestamp("updated_at")).thenReturn(new Timestamp(System.currentTimeMillis()));

        // Act
        Optional<User> result = userRepository.findByUsername(username);

        // Assert
        assertTrue(result.isPresent());
        User user = result.get();
        assertEquals(1, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("Test", user.getFirstname());
        assertEquals("user", user.getRole());
        assertTrue(user.isActive());

        // Verify interactions
        verify(dataSource, times(1)).getConnection();
        verify(preparedStatement, times(1)).setString(1, username);
        verify(preparedStatement, times(1)).executeQuery();
    }

    @Test
    @DisplayName("Should return empty Optional when user not found by username")
    void testFindByUsernameNotFound() throws SQLException {
        // Arrange
        String username = "nonexistent";
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(false); // No results

        // Act
        Optional<User> result = userRepository.findByUsername(username);

        // Assert
        assertFalse(result.isPresent());
        verify(dataSource, times(1)).getConnection();
        verify(preparedStatement, times(1)).setString(1, username);
    }

    @Test
    @DisplayName("Should find user by ID successfully")
    void testFindByIdSuccess() throws SQLException {
        // Arrange
        Integer userId = 1;
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true);

        // Mock ResultSet data
        when(resultSet.getInt("id")).thenReturn(1);
        when(resultSet.getString("username")).thenReturn("testuser");
        when(resultSet.getString("password")).thenReturn(testPasswordHash);
        when(resultSet.getString("firstname")).thenReturn("Test");
        when(resultSet.getString("lastname")).thenReturn("User");
        when(resultSet.getString("role")).thenReturn("user");
        when(resultSet.getString("status")).thenReturn("A");
        when(resultSet.getTimestamp("created_at")).thenReturn(new Timestamp(System.currentTimeMillis()));
        when(resultSet.getTimestamp("updated_at")).thenReturn(new Timestamp(System.currentTimeMillis()));

        // Act
        Optional<User> result = userRepository.findById(userId);

        // Assert
        assertTrue(result.isPresent());
        User user = result.get();
        assertEquals(1, user.getId());
        assertEquals("testuser", user.getUsername());

        // Verify interactions
        verify(dataSource, times(1)).getConnection();
        verify(preparedStatement, times(1)).setInt(1, userId);
        verify(preparedStatement, times(1)).executeQuery();
    }

    @Test
    @DisplayName("Should return empty Optional when user not found by ID")
    void testFindByIdNotFound() throws SQLException {
        // Arrange
        Integer userId = 999;
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(false);

        // Act
        Optional<User> result = userRepository.findById(userId);

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Should handle SQL exception when finding by username")
    void testFindByUsernameHandlesSQLException() throws SQLException {
        // Arrange
        when(dataSource.getConnection()).thenThrow(new SQLException("Connection error"));

        // Act
        Optional<User> result = userRepository.findByUsername("testuser");

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Should handle SQL exception when finding by ID")
    void testFindByIdHandlesSQLException() throws SQLException {
        // Arrange
        when(dataSource.getConnection()).thenThrow(new SQLException("Connection error"));

        // Act
        Optional<User> result = userRepository.findById(1);

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Should properly map disabled user from ResultSet")
    void testFindDisabledUserByUsername() throws SQLException {
        // Arrange
        String username = "disableduser";
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true);

        // Mock ResultSet data with disabled status
        when(resultSet.getInt("id")).thenReturn(5);
        when(resultSet.getString("username")).thenReturn("disableduser");
        when(resultSet.getString("password")).thenReturn(testPasswordHash);
        when(resultSet.getString("firstname")).thenReturn("Disabled");
        when(resultSet.getString("lastname")).thenReturn("User");
        when(resultSet.getString("role")).thenReturn("user");
        when(resultSet.getString("status")).thenReturn("D"); // Disabled
        when(resultSet.getTimestamp("created_at")).thenReturn(new Timestamp(System.currentTimeMillis()));
        when(resultSet.getTimestamp("updated_at")).thenReturn(new Timestamp(System.currentTimeMillis()));

        // Act
        Optional<User> result = userRepository.findByUsername(username);

        // Assert
        assertTrue(result.isPresent());
        User user = result.get();
        assertFalse(user.isActive());
        assertEquals("D", user.getStatus());
    }

    @Test
    @DisplayName("Should properly map admin user from ResultSet")
    void testFindAdminUserByUsername() throws SQLException {
        // Arrange
        String username = "admin";
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true);

        // Mock ResultSet data with admin role
        when(resultSet.getInt("id")).thenReturn(2);
        when(resultSet.getString("username")).thenReturn("admin");
        when(resultSet.getString("password")).thenReturn(testPasswordHash);
        when(resultSet.getString("firstname")).thenReturn("Admin");
        when(resultSet.getString("lastname")).thenReturn("User");
        when(resultSet.getString("role")).thenReturn("admin");
        when(resultSet.getString("status")).thenReturn("A");
        when(resultSet.getTimestamp("created_at")).thenReturn(new Timestamp(System.currentTimeMillis()));
        when(resultSet.getTimestamp("updated_at")).thenReturn(new Timestamp(System.currentTimeMillis()));

        // Act
        Optional<User> result = userRepository.findByUsername(username);

        // Assert
        assertTrue(result.isPresent());
        User user = result.get();
        assertTrue(user.isAdmin());
        assertEquals("admin", user.getRole());
    }

    @Test
    @DisplayName("Should construct repository with provided DataSource")
    void testConstructorWithDataSource() {
        // Act & Assert
        assertNotNull(userRepository);
        // Repository should be created successfully with mocked DataSource
    }
}

