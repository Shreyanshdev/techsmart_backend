import express from 'express';
import { Coupon } from '../models/coupon.js';
import { Customer } from '../models/user.js';

const router = express.Router();

// GET /coupons/available - Get available coupons for user
router.get('/available', async (req, res) => {
    try {
        const { branchId, userId } = req.query;
        const now = new Date();

        // Find all active, valid coupons
        const coupons = await Coupon.find({
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now },
            $or: [
                { usageLimit: null },
                { $expr: { $lt: ["$usageCount", "$usageLimit"] } }
            ]
        }).lean();

        // Filter by branch and user usage
        let filteredCoupons = coupons.filter(coupon => {
            // 1. Branch check
            if (branchId && coupon.applicableBranches && coupon.applicableBranches.length > 0) {
                const branchMatch = coupon.applicableBranches.some(b => b.toString() === branchId);
                if (!branchMatch) return false;
            }

            // 2. User usage check (if userId is provided)
            if (userId && coupon.userLimit) {
                const userUsage = coupon.usedBy?.find(u => u.userId?.toString() === userId?.toString());
                if (userUsage && userUsage.usageCount >= coupon.userLimit) {
                    return false; // User has reached their limit
                }
            }

            return true;
        });

        // Format response
        const formattedCoupons = filteredCoupons.map(coupon => ({
            _id: coupon._id,
            code: coupon.code,
            description: coupon.description,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderValue: coupon.minOrderValue,
            maxDiscountAmount: coupon.maxDiscountAmount,
            validUntil: coupon.validUntil,
            // Calculate remaining uses if applicable
            remainingUses: coupon.usageLimit ? coupon.usageLimit - coupon.usageCount : null
        }));

        res.json({
            success: true,
            count: formattedCoupons.length,
            coupons: formattedCoupons
        });
    } catch (error) {
        console.error('Error fetching available coupons:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
    }
});

// POST /coupons/validate - Validate coupon and calculate discount
router.post('/validate', async (req, res) => {
    try {
        const { code, cartTotal, branchId, userId } = req.body;

        if (!code) {
            return res.status(400).json({ success: false, message: 'Coupon code is required' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid coupon code' });
        }

        // Validate coupon
        const validation = coupon.isValid(cartTotal, branchId, userId);
        if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.message });
        }

        // Calculate discount
        const discount = coupon.calculateDiscount(cartTotal);

        res.json({
            success: true,
            coupon: {
                _id: coupon._id,
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minOrderValue: coupon.minOrderValue,
                maxDiscountAmount: coupon.maxDiscountAmount
            },
            discount,
            newTotal: Math.round((cartTotal - discount) * 100) / 100
        });
    } catch (error) {
        console.error('Error validating coupon:', error);
        res.status(500).json({ success: false, message: 'Failed to validate coupon' });
    }
});

// POST /coupons/apply - Apply coupon to order (called during order creation)
router.post('/apply', async (req, res) => {
    try {
        const { code, cartTotal, branchId, userId } = req.body;

        if (!code) {
            return res.status(400).json({ success: false, message: 'Coupon code is required' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid coupon code' });
        }

        // Validate coupon
        const validation = coupon.isValid(cartTotal, branchId, userId);
        if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.message });
        }

        // Calculate discount
        const discount = coupon.calculateDiscount(cartTotal);

        // Record usage
        await coupon.recordUsage(userId);

        res.json({
            success: true,
            coupon: {
                _id: coupon._id,
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            },
            discount,
            newTotal: Math.round((cartTotal - discount) * 100) / 100
        });
    } catch (error) {
        console.error('Error applying coupon:', error);
        res.status(500).json({ success: false, message: 'Failed to apply coupon' });
    }
});

// GET /coupons/search - Search coupons by code
router.get('/search', async (req, res) => {
    try {
        const { query, branchId, userId } = req.query;
        const now = new Date();

        if (!query) {
            return res.json({ success: true, count: 0, coupons: [] });
        }

        // Search by code (case-insensitive partial match)
        const coupons = await Coupon.find({
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now },
            code: { $regex: query.toUpperCase(), $options: 'i' }
        }).limit(20).lean();

        // Filter by branch and user usage
        let filteredCoupons = coupons.filter(coupon => {
            // 1. Branch check
            if (branchId && coupon.applicableBranches && coupon.applicableBranches.length > 0) {
                const branchMatch = coupon.applicableBranches.some(b => b.toString() === branchId);
                if (!branchMatch) return false;
            }

            // 2. User usage check (if userId is provided)
            if (userId && coupon.userLimit) {
                const userUsage = coupon.usedBy?.find(u => u.userId?.toString() === userId?.toString());
                if (userUsage && userUsage.usageCount >= coupon.userLimit) {
                    return false;
                }
            }

            return true;
        });

        const formattedCoupons = filteredCoupons.map(coupon => ({
            _id: coupon._id,
            code: coupon.code,
            description: coupon.description,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderValue: coupon.minOrderValue,
            maxDiscountAmount: coupon.maxDiscountAmount,
            validUntil: coupon.validUntil
        }));

        res.json({
            success: true,
            count: formattedCoupons.length,
            coupons: formattedCoupons
        });
    } catch (error) {
        console.error('Error searching coupons:', error);
        res.status(500).json({ success: false, message: 'Failed to search coupons' });
    }
});

export default router;
