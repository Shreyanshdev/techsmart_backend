import Review from "../models/review.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import mongoose from "mongoose";

/**
 * Review Controller
 * Handles creating, fetching, and managing product reviews
 */

// Create a new review
export const createReview = async (req, res) => {
    try {
        const { productId, rating, title, comment, images, orderId } = req.body;
        const customerId = req.user._id || req.user.userId;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                error: "Rating must be between 1 and 5"
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Product not found"
            });
        }

        // Check for existing review for this specific order
        const existingReview = await Review.findOne({
            product: productId,
            customer: customerId,
            order: orderId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                error: "You have already reviewed this product for this order"
            });
        }

        // Check if customer has purchased this product (for verified badge)
        const hasPurchased = await Order.exists({
            customer: customerId,
            _id: orderId,
            'items.productId': productId,
            status: 'delivered'
        });

        const review = new Review({
            product: productId,
            customer: customerId,
            order: orderId,
            rating,
            title: title || '',
            comment: comment || '',
            images: images || [],
            isVerifiedPurchase: !!hasPurchased,
            isApproved: true
        });

        await review.save();

        // Populate for response
        await review.populate('customer', 'name');

        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            review
        });
    } catch (error) {
        console.error("Error creating review:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: "You have already reviewed this product"
            });
        }
        res.status(500).json({
            success: false,
            error: "Failed to create review"
        });
    }
};

// Get reviews for a product
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', rating } = req.query;

        const sortOrder = order === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        const filter = {
            product: productId,
            isApproved: true
        };

        if (rating) {
            filter.rating = parseInt(rating);
        }

        const reviews = await Review.find(filter)
            .populate('customer', 'name')
            .sort({ [sort]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Review.countDocuments(filter);

        // Get rating distribution
        const ratingDistribution = await Review.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(productId), isApproved: true } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        ratingDistribution.forEach(r => {
            distribution[r._id] = r.count;
        });

        res.json({
            success: true,
            reviews,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalReviews: total
            },
            ratingDistribution: distribution
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch reviews"
        });
    }
};

// Update a review (by owner)
export const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, title, comment, images } = req.body;
        const customerId = req.user._id || req.user.userId;

        const review = await Review.findOne({
            _id: reviewId,
            customer: customerId
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                error: "Review not found or you don't have permission to edit"
            });
        }

        if (rating) review.rating = rating;
        if (title !== undefined) review.title = title;
        if (comment !== undefined) review.comment = comment;
        if (images) review.images = images;

        await review.save();

        res.json({
            success: true,
            message: "Review updated successfully",
            review
        });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update review"
        });
    }
};

// Delete a review (by owner)
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const customerId = req.user._id || req.user.userId;

        const review = await Review.findOneAndDelete({
            _id: reviewId,
            customer: customerId
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                error: "Review not found or you don't have permission to delete"
            });
        }

        res.json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete review"
        });
    }
};

// Mark review as helpful (Toggle)
export const markReviewHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const customerId = req.user?._id || req.user?.userId;

        if (!customerId) {
            return res.status(401).json({
                success: false,
                error: "Authentication required"
            });
        }

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                error: "Review not found"
            });
        }

        // Prevent users from marking their own review as helpful
        if (review.customer.toString() === customerId.toString()) {
            return res.status(400).json({
                success: false,
                error: "You cannot mark your own review as helpful"
            });
        }

        // Check if user already marked this review as helpful (Toggle logic)
        const alreadyHelpful = review.helpfulUsers && review.helpfulUsers.includes(customerId);

        let update;
        if (alreadyHelpful) {
            // Remove helpful vote
            update = {
                $inc: { helpfulCount: -1 },
                $pull: { helpfulUsers: customerId }
            };
        } else {
            // Add helpful vote
            update = {
                $inc: { helpfulCount: 1 },
                $addToSet: { helpfulUsers: customerId }
            };
        }

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            update,
            { new: true }
        );

        res.json({
            success: true,
            isHelpful: !alreadyHelpful,
            helpfulCount: updatedReview.helpfulCount
        });
    } catch (error) {
        console.error("Error toggling review helpfulness:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update review"
        });
    }
};

// Get reviews for a specific order
export const getOrderReviews = async (req, res) => {
    try {
        const { orderId } = req.params;
        const customerId = req.user._id || req.user.userId;

        const reviews = await Review.find({
            order: orderId,
            customer: customerId
        });

        res.json({
            success: true,
            reviews
        });
    } catch (error) {
        console.error("Error fetching order reviews:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch order reviews"
        });
    }
};

// Get customer's reviews
export const getMyReviews = async (req, res) => {
    try {
        const customerId = req.user._id || req.user.userId;

        const reviews = await Review.find({ customer: customerId })
            .populate('product', 'name images')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            reviews
        });
    } catch (error) {
        console.error("Error fetching my reviews:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch reviews"
        });
    }
};

// Admin: Get all reviews (for moderation)
export const getAllReviews = async (req, res) => {
    try {
        const { page = 1, limit = 20, approved } = req.query;

        const filter = {};
        if (approved !== undefined) {
            filter.isApproved = approved === 'true';
        }

        const reviews = await Review.find(filter)
            .populate('product', 'name')
            .populate('customer', 'name phone')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Review.countDocuments(filter);

        res.json({
            success: true,
            reviews,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalReviews: total
            }
        });
    } catch (error) {
        console.error("Error fetching all reviews:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch reviews"
        });
    }
};

// Admin: Approve/Reject review
export const moderateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { isApproved } = req.body;

        const review = await Review.findByIdAndUpdate(
            reviewId,
            { isApproved },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                error: "Review not found"
            });
        }

        res.json({
            success: true,
            message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
            review
        });
    } catch (error) {
        console.error("Error moderating review:", error);
        res.status(500).json({
            success: false,
            error: "Failed to moderate review"
        });
    }
};
