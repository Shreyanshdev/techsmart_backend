import express from 'express';
import Tax from '../models/tax.js';

const router = express.Router();

// Get active tax settings
router.get('/', async (req, res) => {
    try {
        const tax = await Tax.findOne({ isActive: true }).sort({ createdAt: -1 });
        if (!tax) {
            // Default fallback if no tax record exists
            return res.json({
                success: true,
                tax: {
                    sgst: 0,
                    cgst: 0
                }
            });
        }
        res.json({
            success: true,
            tax
        });
    } catch (error) {
        console.error("Get tax error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
