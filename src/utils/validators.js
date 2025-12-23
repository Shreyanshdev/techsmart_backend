import mongoose from 'mongoose';

/**
 * Centralized Validation Utilities
 * Provides reusable validation functions for common data types
 */

/**
 * Validate MongoDB ObjectId format
 * @param {string} id - The ID to validate
 * @param {string} fieldName - Name of the field for error messages
 * @throws {Error} If ID is invalid
 */
export const validateObjectId = (id, fieldName = 'ID') => {
    if (!id) {
        throw new Error(`${fieldName} is required`);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ${fieldName} format`);
    }
};

/**
 * Validate positive number
 * @param {any} value - The value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {number} The validated number
 * @throws {Error} If value is not a positive number
 */
export const validatePositiveNumber = (value, fieldName) => {
    if (value === undefined || value === null) {
        throw new Error(`${fieldName} is required`);
    }
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
        throw new Error(`${fieldName} must be a positive number`);
    }
    return num;
};

/**
 * Validate non-negative number (allows zero)
 * @param {any} value - The value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {number} The validated number
 * @throws {Error} If value is not a non-negative number
 */
export const validateNonNegativeNumber = (value, fieldName) => {
    if (value === undefined || value === null) {
        throw new Error(`${fieldName} is required`);
    }
    const num = Number(value);
    if (isNaN(num) || num < 0) {
        throw new Error(`${fieldName} must be a non-negative number`);
    }
    return num;
};

/**
 * Validate required fields exist in an object
 * @param {Object} obj - The object to validate
 * @param {string[]} fields - Array of required field names
 * @throws {Error} If any required fields are missing
 */
export const validateRequiredFields = (obj, fields) => {
    const missing = fields.filter(field => {
        const value = obj[field];
        return value === undefined || value === null || value === '';
    });
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
};

/**
 * Validate geographic coordinates
 * @param {any} latitude - The latitude value
 * @param {any} longitude - The longitude value
 * @returns {Object} Object with validated latitude and longitude
 * @throws {Error} If coordinates are invalid
 */
export const validateCoordinates = (latitude, longitude) => {
    if (latitude === undefined || latitude === null) {
        throw new Error('Latitude is required');
    }
    if (longitude === undefined || longitude === null) {
        throw new Error('Longitude is required');
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
        throw new Error('Invalid latitude. Must be between -90 and 90');
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
        throw new Error('Invalid longitude. Must be between -180 and 180');
    }

    return { latitude: lat, longitude: lng };
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {string} The validated email (lowercase, trimmed)
 * @throws {Error} If email is invalid
 */
export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        throw new Error('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(trimmedEmail)) {
        throw new Error('Invalid email format');
    }

    return trimmedEmail;
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone - The phone number to validate
 * @returns {string} The validated phone number
 * @throws {Error} If phone number is invalid
 */
export const validatePhone = (phone) => {
    if (!phone || typeof phone !== 'string') {
        throw new Error('Phone number is required');
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const trimmedPhone = phone.trim();

    if (!phoneRegex.test(trimmedPhone)) {
        throw new Error('Invalid phone number. Must be a 10-digit Indian mobile number starting with 6-9');
    }

    return trimmedPhone;
};

/**
 * Validate array is not empty
 * @param {any} arr - The array to validate
 * @param {string} fieldName - Name of the field for error messages
 * @throws {Error} If array is empty or not an array
 */
export const validateNonEmptyArray = (arr, fieldName) => {
    if (!Array.isArray(arr)) {
        throw new Error(`${fieldName} must be an array`);
    }
    if (arr.length === 0) {
        throw new Error(`${fieldName} cannot be empty`);
    }
};

/**
 * Validate string is not empty
 * @param {any} str - The string to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {string} The trimmed string
 * @throws {Error} If string is empty
 */
export const validateNonEmptyString = (str, fieldName) => {
    if (!str || typeof str !== 'string') {
        throw new Error(`${fieldName} is required`);
    }
    const trimmed = str.trim();
    if (trimmed.length === 0) {
        throw new Error(`${fieldName} cannot be empty`);
    }
    return trimmed;
};

/**
 * Validate enum value
 * @param {any} value - The value to validate
 * @param {string[]} allowedValues - Array of allowed values
 * @param {string} fieldName - Name of the field for error messages
 * @throws {Error} If value is not in allowed values
 */
export const validateEnum = (value, allowedValues, fieldName) => {
    if (!allowedValues.includes(value)) {
        throw new Error(`Invalid ${fieldName}. Must be one of: ${allowedValues.join(', ')}`);
    }
};

/**
 * Validate date is in the future
 * @param {any} date - The date to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {Date} The validated date
 * @throws {Error} If date is invalid or in the past
 */
export const validateFutureDate = (date, fieldName) => {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        throw new Error(`Invalid ${fieldName} format`);
    }
    if (dateObj < new Date()) {
        throw new Error(`${fieldName} must be in the future`);
    }
    return dateObj;
};

/**
 * Sanitize string to prevent XSS
 * @param {string} str - The string to sanitize
 * @returns {string} The sanitized string
 */
export const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;

    // Remove HTML tags and potentially dangerous characters
    return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();
};

/**
 * Validate integer within range
 * @param {any} value - The value to validate
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @param {string} fieldName - Name of the field for error messages
 * @returns {number} The validated integer
 * @throws {Error} If value is not an integer or out of range
 */
export const validateIntegerRange = (value, min, max, fieldName) => {
    const num = Number(value);
    if (isNaN(num) || !Number.isInteger(num)) {
        throw new Error(`${fieldName} must be an integer`);
    }
    if (num < min || num > max) {
        throw new Error(`${fieldName} must be between ${min} and ${max}`);
    }
    return num;
};
