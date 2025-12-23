import express from 'express';
import Feedback from '../models/Feedback.js';
import { verifyToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleAuth.js'; // Assuming it's named requireAdmin or similar

const router = express.Router();

/**
 * @route   POST /api/feedback
 * @desc    Submit feedback
 * @access  Private (Customer)
 */
router.post('/', verifyToken, async (req, res) => {
    try {
        const { message, topic } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const feedback = await Feedback.create({
            user: req.user._id,
            message,
            topic: topic || 'General'
        });

        res.status(201).json({ success: true, feedback });
    } catch (error) {
        console.error('Submit Feedback Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/feedback
 * @desc    Get all feedback
 * @access  Private (Admin)
 */
router.get('/', verifyToken, requireAdmin, async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(feedbacks);
    } catch (error) {
        console.error('Get Feedback Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
