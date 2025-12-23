/**
 * Custom Error Classes
 * Provides structured error types for different scenarios
 */

/**
 * Base Application Error
 * All custom errors extend from this class
 */
export class AppError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true; // Distinguishes operational errors from programming errors
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation Error (400)
 * Used for input validation failures
 */
export class ValidationError extends AppError {
    constructor(message) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

/**
 * Authentication Error (401)
 * Used when authentication fails or token is invalid
 */
export class AuthenticationError extends AppError {
    constructor(message = 'Authentication required') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

/**
 * Authorization Error (403)
 * Used when user doesn't have permission to access resource
 */
export class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403, 'FORBIDDEN');
    }
}

/**
 * Not Found Error (404)
 * Used when requested resource doesn't exist
 */
export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}

/**
 * Conflict Error (409)
 * Used for duplicate entries or conflicting operations
 */
export class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409, 'CONFLICT');
    }
}

/**
 * Account Locked Error (423)
 * Used when account is temporarily locked
 */
export class AccountLockedError extends AppError {
    constructor(message = 'Account is locked') {
        super(message, 423, 'ACCOUNT_LOCKED');
    }
}

/**
 * Rate Limit Error (429)
 * Used when rate limit is exceeded
 */
export class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429, 'RATE_LIMIT_EXCEEDED');
    }
}

/**
 * Internal Server Error (500)
 * Used for unexpected server errors
 */
export class InternalServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, 500, 'INTERNAL_SERVER_ERROR');
    }
}

/**
 * Database Error (500)
 * Used for database operation failures
 */
export class DatabaseError extends AppError {
    constructor(message = 'Database operation failed') {
        super(message, 500, 'DATABASE_ERROR');
    }
}

/**
 * External Service Error (502)
 * Used when external service (Razorpay, Google Maps, etc.) fails
 */
export class ExternalServiceError extends AppError {
    constructor(service = 'External service', message = 'Service unavailable') {
        super(`${service}: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR');
    }
}
