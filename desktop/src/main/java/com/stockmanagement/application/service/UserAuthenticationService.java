package com.stockmanagement.application.service;

import com.stockmanagement.domain.exception.AuthenticationException;
import com.stockmanagement.domain.model.User;
import com.stockmanagement.domain.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Optional;

/**
 * User Authentication Service
 *
 * Application service layer that orchestrates the authentication workflow.
 * This service encapsulates the business logic for user authentication,
 * acting as a facade between the presentation layer and the domain/infrastructure layers.
 *
 * Responsibilities:
 * - Retrieve user credentials from the repository
 * - Verify password against stored hash using BCrypt
 * - Check user account status
 * - Enforce business rules for authentication
 *
 * This service follows the Single Responsibility Principle (SRP) by focusing
 * exclusively on authentication logic, and the Dependency Inversion Principle (DIP)
 * by depending on the UserRepository abstraction rather than concrete implementations.
 */
public class UserAuthenticationService {

    private final UserRepository userRepository;

    /**
     * Constructor with dependency injection of UserRepository.
     *
     * Allows for flexibility in testing (mock repositories) and production use.
     *
     * @param userRepository the repository for accessing user data
     * @throws IllegalArgumentException if userRepository is null
     */
    public UserAuthenticationService(UserRepository userRepository) {
        if (userRepository == null) {
            throw new IllegalArgumentException("UserRepository cannot be null");
        }
        this.userRepository = userRepository;
    }

    /**
     * Authenticate a user with username and password.
     *
     * This method performs the following checks:
     * 1. Retrieves the user by username from the repository
     * 2. Verifies that the user exists (throws exception if not)
     * 3. Checks if the user account is active (status = 'A')
     * 4. Verifies the provided password against the stored BCrypt hash
     * 5. Returns the authenticated User on success
     *
     * Authentication fails with a specific message for:
     * - Invalid username or password (generic message for security)
     * - Disabled user accounts
     *
     * @param username the username to authenticate
     * @param rawPassword the plain-text password (not hashed)
     * @return the authenticated User entity
     * @throws AuthenticationException if authentication fails for any reason
     * @throws IllegalArgumentException if username or rawPassword is null/empty
     */
    public User authenticate(String username, String rawPassword) throws AuthenticationException {
        // Input validation
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        if (rawPassword == null || rawPassword.isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }

        // Step 1: Retrieve user from repository
        Optional<User> userOptional = userRepository.findByUsername(username);

        // Step 2: Verify user exists
        // Using generic message for security (don't reveal if username exists)
        if (userOptional.isEmpty()) {
            throw new AuthenticationException("Invalid credentials");
        }

        User user = userOptional.get();

        // Step 3: Check if user account is active
        if (!user.isActive()) {
            throw new AuthenticationException("Account is disabled");
        }

        // Step 4: Verify password using BCrypt
        // BCrypt.checkpw() securely compares the raw password with the stored hash
        if (!BCrypt.checkpw(rawPassword, user.getPassword())) {
            throw new AuthenticationException("Invalid credentials");
        }

        // Step 5: Authentication successful - return authenticated user
        return user;
    }

    /**
     * Hash a raw password using BCrypt.
     *
     * This method should be used when creating new users or resetting passwords.
     * It uses BCrypt's adaptive hashing algorithm to make rainbow table attacks impractical.
     *
     * BCrypt automatically handles:
     * - Salt generation
     * - Computational cost adjustment
     *
     * @param rawPassword the plain-text password to hash
     * @return the BCrypt-hashed password
     * @throws IllegalArgumentException if rawPassword is null or empty
     */
    public static String hashPassword(String rawPassword) {
        if (rawPassword == null || rawPassword.isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        return BCrypt.hashpw(rawPassword, BCrypt.gensalt());
    }
}
