package com.stockmanagement.domain.repository;

import com.stockmanagement.domain.model.User;
import java.util.Optional;

/**
 * Repository interface for User entity
 *
 * Defines the contract for data access operations related to User authentication
 * and user management. This interface maintains the separation of concerns between
 * domain logic and persistence implementation.
 *
 * Following the Repository pattern from Domain-Driven Design, this interface
 * abstracts the data access layer, allowing for multiple implementations
 * (PostgreSQL, mock, etc.) without affecting the domain layer.
 */
public interface UserRepository {

    /**
     * Find a user by username.
     *
     * @param username the username to search for
     * @return an Optional containing the User if found, empty otherwise
     */
    Optional<User> findByUsername(String username);

    /**
     * Find a user by ID.
     *
     * @param id the user ID to search for
     * @return an Optional containing the User if found, empty otherwise
     */
    Optional<User> findById(Integer id);

    /**
     * Save a new user to the repository.
     *
     * @param user the User entity to save
     * @return the saved User with generated ID
     */
    User save(User user);

    /**
     * Update an existing user.
     *
     * @param user the User entity to update
     * @return the updated User
     */
    User update(User user);
}

