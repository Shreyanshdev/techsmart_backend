import express from 'express';
import addressRoutes from './address.js';
import authRoutes from './auth.js';
import orderRoutes from './order.js';
import paymentRoutes from './payment.js';
import productRoutes from './products.js';
import profileRoutes from './profileRoutes.js';
import subscriptionRoutes from './subscription.js';
import branchRoutes from './branch.js';
import deliveryManagementRoutes from './deliveryManagement.js';
import animalHealthRoutes from './animalHealth.js';
import feedbackRoutes from './feedback.js';
import adminRoutes from './adminRoutes.js';
import taxRoutes from './tax.js';

const router = express.Router();

export const registerRoutes = (app) => {
    // API v1 routes with proper prefixes
    app.use('/api/v1/admin', adminRoutes);
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/addresses', addressRoutes);
    app.use('/api/v1/orders', orderRoutes);
    app.use('/api/v1/payments', paymentRoutes);
    app.use('/api/v1/products', productRoutes);
    app.use('/api/v1/tax', taxRoutes);
    app.use('/api/v1/subscriptions', subscriptionRoutes);
    app.use('/api/v1/branches', branchRoutes);
    app.use('/api/v1/deliveries', deliveryManagementRoutes);
    app.use('/api/v1/animal-health', animalHealthRoutes);
    app.use('/api/v1/feedback', feedbackRoutes);
    app.use('/api/v1', profileRoutes); // Broad match last
};