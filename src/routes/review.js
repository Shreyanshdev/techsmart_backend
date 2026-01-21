import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    markReviewHelpful,
    getMyReviews,
    getOrderReviews,
    getAllReviews,
    moderateReview
} from '../controllers/review.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.post('/:reviewId/helpful', verifyToken, markReviewHelpful);

// Customer routes (protected)
router.post('/', verifyToken, createReview);
router.get('/my-reviews', verifyToken, getMyReviews);
router.get('/order/:orderId', verifyToken, getOrderReviews);
router.put('/:reviewId', verifyToken, updateReview);
router.delete('/:reviewId', verifyToken, deleteReview);

// Admin routes (protected - add admin middleware in production)
router.get('/admin/all', verifyToken, getAllReviews);
router.patch('/admin/:reviewId/moderate', verifyToken, moderateReview);

export default router;
