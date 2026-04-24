package com.stockmanagement.domain.exception;

/**
 * Exception thrown when authentication fails.
 *
 * This exception is used to signal authentication failures such as:
 * - Invalid credentials
 * - Disabled user accounts
 * - Invalid username
 *
 * This maintains clear separation of concerns by keeping authentication
 * errors within the domain layer.
 */
public class AuthenticationException extends Exception {

    public AuthenticationException(String message) {
        super(message);
    }

    public AuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}

