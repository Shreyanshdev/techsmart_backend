/**
 * Role-based Authorization Middleware
 * 
 * Provides middleware functions to restrict access to endpoints based on user roles.
 * Must be used AFTER verifyToken middleware to ensure req.user is populated.
 */

/**
 * Middleware to require Customer role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireCustomer = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({
            message: "Authentication required",
            error: "UNAUTHORIZED"
        });
    }

    if (req.user.role !== 'Customer') {
        return res.status(403).json({
            message: "Access denied. Customer role required.",
            error: "FORBIDDEN"
        });
    }

    next();
};

/**
 * Middleware to require DeliveryPartner role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireDeliveryPartner = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({
            message: "Authentication required",
            error: "UNAUTHORIZED"
        });
    }

    if (req.user.role !== 'DeliveryPartner') {
        return res.status(403).json({
            message: "Access denied. Delivery partner role required.",
            error: "FORBIDDEN"
        });
    }

    next();
};

/**
 * Middleware to require Admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({
            message: "Authentication required",
            error: "UNAUTHORIZED"
        });
    }

    if (req.user.role !== 'Admin') {
        return res.status(403).json({
            message: "Access denied. Admin role required.",
            error: "FORBIDDEN"
        });
    }

    next();
};

/**
 * Middleware to allow both Customer and DeliveryPartner roles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireCustomerOrDeliveryPartner = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(401).json({
            message: "Authentication required",
            error: "UNAUTHORIZED"
        });
    }

    if (!['Customer', 'DeliveryPartner'].includes(req.user.role)) {
        return res.status(403).json({
            message: "Access denied. Customer or delivery partner role required.",
            error: "FORBIDDEN"
        });
    }

    next();
};
