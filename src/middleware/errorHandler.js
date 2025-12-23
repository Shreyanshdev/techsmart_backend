import { AppError } from '../utils/errors.js';

/**
 * Centralized Error Handler Middleware
 * Handles all errors in a consistent format
 */
export const errorHandler = (err, req, res, next) => {
    let { statusCode = 500, message, errorCode } = err;

    // Log error for debugging
    console.error('❌ Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        statusCode,
        errorCode
    });

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(', ');
        errorCode = 'VALIDATION_ERROR';
    }

    // Handle Mongoose duplicate key errors
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyPattern)[0];
        message = `${field} already exists`;
        errorCode = 'DUPLICATE_ERROR';
    }

    // Handle Mongoose cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
        errorCode = 'INVALID_ID';
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
        errorCode = 'INVALID_TOKEN';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
        errorCode = 'TOKEN_EXPIRED';
    }

    // Handle multer file upload errors
    if (err.name === 'MulterError') {
        statusCode = 400;
        message = `File upload error: ${err.message}`;
        errorCode = 'FILE_UPLOAD_ERROR';
    }

    // Ensure we don't leak sensitive information in production
    if (!err.isOperational && process.env.NODE_ENV === 'production') {
        message = 'Something went wrong';
        errorCode = 'INTERNAL_SERVER_ERROR';
    }

    // Send standardized error response
    res.status(statusCode).json({
        success: false,
        message,
        error: errorCode || 'SERVER_ERROR',
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err
        })
    });
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors automatically
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Not Found Handler
 * Handles 404 errors for undefined routes
 */
export const notFoundHandler = (req, res, next) => {
    const error = new AppError(
        `Route ${req.originalUrl} not found`,
        404,
        'ROUTE_NOT_FOUND'
    );
    next(error);
};
