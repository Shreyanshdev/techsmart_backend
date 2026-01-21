import mongoose from "mongoose";

/**
 * Review Model
 * Stores customer reviews and ratings for products
 */
const reviewSchema = new mongoose.Schema({
    // References
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
        index: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        description: "Optional: Link to the order where product was purchased"
    },

    // Rating (1-5 stars)
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    // Review Content
    title: {
        type: String,
        trim: true,
        maxlength: 100,
        description: "Short review title"
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 1000,
        description: "Detailed review text"
    },

    // Review Images (optional)
    images: [{
        type: String,
        description: "Review image URLs"
    }],

    // Moderation
    isApproved: {
        type: Boolean,
        default: true,
        index: true
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: false,
        description: "True if customer actually purchased this product"
    },

    helpfulCount: {
        type: Number,
        default: 0
    },
    helpfulUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        description: "List of customers who marked this review as helpful"
    }],
    reportCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index to prevent duplicate reviews per product per order
reviewSchema.index({ product: 1, customer: 1, order: 1 }, { unique: true });

// Index for fetching product reviews
reviewSchema.index({ product: 1, isApproved: 1, createdAt: -1 });

// Static method to calculate product rating stats
reviewSchema.statics.calculateProductRating = async function (productId) {
    const stats = await this.aggregate([
        { $match: { product: productId, isApproved: true } },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    const Product = mongoose.model('Product');

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            'rating.average': Math.round(stats[0].averageRating * 10) / 10,
            'rating.count': stats[0].totalReviews
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            'rating.average': 0,
            'rating.count': 0
        });
    }
};

// Post-save hook to update product rating
reviewSchema.post('save', async function () {
    await this.constructor.calculateProductRating(this.product);
});

// Post-remove hook to update product rating
reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await doc.constructor.calculateProductRating(doc.product);
    }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
