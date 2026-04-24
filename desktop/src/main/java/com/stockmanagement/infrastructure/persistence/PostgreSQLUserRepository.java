package com.stockmanagement.infrastructure.persistence;

import com.stockmanagement.domain.model.User;
import com.stockmanagement.domain.repository.UserRepository;
import com.stockmanagement.infrastructure.config.DatabaseConfig;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

/**
 * PostgreSQL implementation of UserRepository
 *
 * Handles all database operations for User entities using JDBC and PreparedStatement.
 * Implements the Repository pattern to provide a clean abstraction over direct database access.
 *
 * This implementation follows these principles:
 * - SQL Injection Prevention: Uses PreparedStatement exclusively
 * - Connection Management: Leverages HikariCP connection pooling
 * - Resource Safety: Ensures proper closure of database resources
 * - Domain Isolation: Maps database records to domain entities
 */
public class PostgreSQLUserRepository implements UserRepository {

    private final DataSource dataSource;

    /**
     * Constructor that receives the DataSource via dependency injection.
     * Allows for flexibility in testing and configuration.
     *
     * @param dataSource the HikariCP DataSource managed by DatabaseConfig
     */
    public PostgreSQLUserRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Convenience constructor using the singleton DatabaseConfig instance.
     * Simplifies instantiation in application code.
     */
    public PostgreSQLUserRepository() {
        this(DatabaseConfig.getInstance().getDataSource());
    }

    /**
     * Find a user by username.
     *
     * Executes a SELECT query against the lpa_users table filtered by username.
     * Returns an Optional to handle the case where the user is not found.
     *
     * @param username the username to search for
     * @return an Optional containing the User if found, empty otherwise
     */
    @Override
    public Optional<User> findByUsername(String username) {
        String sql = "SELECT id, username, password, firstname, lastname, role, status, created_at, updated_at " +
                     "FROM lpa_users WHERE username = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToUser(rs));
                }
            }
        } catch (SQLException e) {
            // Log the exception in production (would use SLF4J or similar)
            System.err.println("Error finding user by username: " + e.getMessage());
            e.printStackTrace();
        }

        return Optional.empty();
    }

    /**
     * Find a user by ID.
     *
     * Executes a SELECT query against the lpa_users table filtered by user ID.
     *
     * @param id the user ID to search for
     * @return an Optional containing the User if found, empty otherwise
     */
    @Override
    public Optional<User> findById(Integer id) {
        String sql = "SELECT id, username, password, firstname, lastname, role, status, created_at, updated_at " +
                     "FROM lpa_users WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToUser(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error finding user by ID: " + e.getMessage());
            e.printStackTrace();
        }

        return Optional.empty();
    }

    /**
     * Save a new user to the repository.
     *
     * Executes an INSERT statement and returns the saved User with generated ID.
     * Note: Password hashing should be done in the application service layer,
     * not in the repository.
     *
     * @param user the User entity to save
     * @return the saved User with generated ID
     */
    @Override
    public User save(User user) {
        String sql = "INSERT INTO lpa_users (username, password, firstname, lastname, role, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?) RETURNING id, created_at, updated_at";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, user.getUsername());
            stmt.setString(2, user.getPassword());
            stmt.setString(3, user.getFirstname());
            stmt.setString(4, user.getLastname());
            stmt.setString(5, user.getRole());
            stmt.setString(6, user.getStatus());

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    // Create a new User object with the generated ID and timestamps
                    return new User(
                        rs.getInt("id"),
                        user.getUsername(),
                        user.getPassword(),
                        user.getFirstname(),
                        user.getLastname(),
                        user.getRole(),
                        user.getStatus(),
                        convertToLocalDateTime(rs.getTimestamp("created_at")),
                        convertToLocalDateTime(rs.getTimestamp("updated_at"))
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("Error saving user: " + e.getMessage());
            e.printStackTrace();
        }

        throw new RuntimeException("Failed to save user");
    }

    /**
     * Update an existing user.
     *
     * Executes an UPDATE statement for the given User entity.
     *
     * @param user the User entity to update
     * @return the updated User
     */
    @Override
    public User update(User user) {
        String sql = "UPDATE lpa_users SET username = ?, password = ?, firstname = ?, " +
                     "lastname = ?, role = ?, status = ? WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, user.getUsername());
            stmt.setString(2, user.getPassword());
            stmt.setString(3, user.getFirstname());
            stmt.setString(4, user.getLastname());
            stmt.setString(5, user.getRole());
            stmt.setString(6, user.getStatus());
            stmt.setInt(7, user.getId());

            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected > 0) {
                return user;
            }
        } catch (SQLException e) {
            System.err.println("Error updating user: " + e.getMessage());
            e.printStackTrace();
        }

        throw new RuntimeException("Failed to update user");
    }

    /**
     * Maps a ResultSet row to a User domain entity.
     *
     * This method encapsulates the mapping logic between the database schema
     * and the domain model, making the code more maintainable.
     *
     * @param rs the ResultSet positioned at the row to map
     * @return a User domain entity
     * @throws SQLException if accessing ResultSet columns fails
     */
    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        return new User(
            rs.getInt("id"),
            rs.getString("username"),
            rs.getString("password"),
            rs.getString("firstname"),
            rs.getString("lastname"),
            rs.getString("role"),
            rs.getString("status"),
            convertToLocalDateTime(rs.getTimestamp("created_at")),
            convertToLocalDateTime(rs.getTimestamp("updated_at"))
        );
    }

    /**
     * Converts a java.sql.Timestamp to java.time.LocalDateTime.
     *
     * Handles null values gracefully by returning null.
     *
     * @param timestamp the SQL timestamp to convert
     * @return a LocalDateTime or null if timestamp is null
     */
    private LocalDateTime convertToLocalDateTime(java.sql.Timestamp timestamp) {
        if (timestamp == null) {
            return null;
        }
        return timestamp.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }
}
