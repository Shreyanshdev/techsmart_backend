import express from 'express';
import { createOrder, verifyPayment, getPaymentStatus, refundPayment, getSubscriptionPaymentStatus, createCodOrder, createCodSubscription } from '../controllers/payment.js';
import { verifyToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

// Payment creation and verification require authentication
router.post('/orders', verifyToken, createOrder);
router.post('/verify', verifyToken, verifyPayment);

// COD payment routes
router.post('/cod/order', verifyToken, createCodOrder);
router.post('/cod/subscription', verifyToken, createCodSubscription);

// Get payment status (authentication required)
router.get('/orders/:orderId/status', verifyToken, getPaymentStatus);
router.get('/subscriptions/:subscriptionId/status', verifyToken, getSubscriptionPaymentStatus);

// Refund payment (admin only)
router.post('/refund', verifyToken, requireAdmin, refundPayment);

export default router;