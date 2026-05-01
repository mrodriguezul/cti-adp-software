package com.stockmanagement.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * User Domain Entity
 *
 * Represents an internal staff member with authentication and role-based access control.
 * This entity encapsulates user identity, credentials, and authorization information.
 *
 * Properties map directly to the lpa_users PostgreSQL table:
 * - id: Unique user identifier
 * - username: Unique login credential
 * - password: BCrypt hashed password
 * - firstname: User's first name
 * - lastname: User's last name
 * - role: Authorization level ('user' or 'admin')
 * - status: Account status ('A' = Active, 'D' = Disabled)
 *
 * This class follows immutability principles for security-sensitive data.
 */
public class User {
    private Integer id;
    private String username;
    private String password;
    private String firstname;
    private String lastname;
    private String role;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Constructor for creating a User from database retrieval.
     * Used when reconstructing a User entity from persistence layer.
     */
    public User(Integer id, String username, String password, String firstname,
                String lastname, String role, String status, LocalDateTime createdAt,
                LocalDateTime updatedAt) {
        this.id = Objects.requireNonNull(id, "User ID cannot be null");
        this.username = Objects.requireNonNull(username, "Username cannot be null");
        this.password = Objects.requireNonNull(password, "Password cannot be null");
        this.firstname = firstname;
        this.lastname = lastname;
        this.role = Objects.requireNonNull(role, "Role cannot be null");
        this.status = Objects.requireNonNull(status, "Status cannot be null");
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters - Immutable access to user properties

    public Integer getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public String getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    /**
     * Check if this user account is active.
     * @return true if status is 'A', false otherwise
     */
    public boolean isActive() {
        return "A".equalsIgnoreCase(status);
    }

    /**
     * Check if this user has administrative privileges.
     * @return true if role is 'admin', false otherwise
     */
    public boolean isAdmin() {
        return "admin".equalsIgnoreCase(role);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) &&
                Objects.equals(username, user.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", role='" + role + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
