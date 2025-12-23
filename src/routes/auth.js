import express from 'express';
import { fetchUser, loginCustomer, verifyCustomerOtp, loginDeliveryPartner, refreshToken, logout } from '../controllers/auth/auth.js';
import { updateUserProfile, getDeliveryPartnerById } from '../controllers/profile.js';
import { verifyToken, authRateLimit } from '../middleware/auth.js';

const router = express.Router();

// Apply rate limiting to authentication endpoints
router.post('/customer/login', authRateLimit, loginCustomer);
router.post('/customer/verify-otp', authRateLimit, verifyCustomerOtp);
router.post('/delivery-partner/login', authRateLimit, loginDeliveryPartner);
router.post('/refresh-token', authRateLimit, refreshToken);

// Protected routes
router.post('/logout', verifyToken, logout);
router.get('/user', verifyToken, fetchUser);
router.put('/user', verifyToken, updateUserProfile);
router.get('/delivery-partners/:id', verifyToken, getDeliveryPartnerById);

export default router;