import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        default: ""
    },
    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    minOrderValue: {
        type: Number,
        default: 0,
        min: 0
    },
    maxDiscountAmount: {
        type: Number,
        default: null // null means no cap
    },
    usageLimit: {
        type: Number,
        default: null // null means unlimited
    },
    usageCount: {
        type: Number,
        default: 0
    },
    userLimit: {
        type: Number,
        default: 1 // How many times a single user can use this coupon
    },
    validFrom: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    applicableCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }],
    applicableBranches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    }],
    // Track which users have used this coupon and how many times
    usedBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer"
        },
        usageCount: {
            type: Number,
            default: 1
        }
    }]
}, { timestamps: true });

// Method to check if coupon is valid
couponSchema.methods.isValid = function (cartTotal, branchId, userId) {
    const now = new Date();

    // Check if active
    if (!this.isActive) {
        return { valid: false, message: "This coupon is no longer active" };
    }

    // Check date validity
    if (now < this.validFrom) {
        return { valid: false, message: "This coupon is not yet valid" };
    }
    if (now > this.validUntil) {
        return { valid: false, message: "This coupon has expired" };
    }

    // Check usage limit
    if (this.usageLimit !== null && this.usageCount >= this.usageLimit) {
        return { valid: false, message: "This coupon has reached its usage limit" };
    }

    // Check minimum order value
    if (cartTotal < this.minOrderValue) {
        return { valid: false, message: `Minimum order value of ₹${this.minOrderValue} required` };
    }

    // Check branch restriction
    if (this.applicableBranches && this.applicableBranches.length > 0) {
        const branchMatch = this.applicableBranches.some(b => b.toString() === branchId?.toString());
        if (!branchMatch) {
            return { valid: false, message: "This coupon is not valid for your selected branch" };
        }
    }

    // Check user usage limit
    if (userId && this.userLimit) {
        const userUsage = this.usedBy.find(u => u.userId?.toString() === userId?.toString());
        if (userUsage && userUsage.usageCount >= this.userLimit) {
            return { valid: false, message: "You have already used this coupon the maximum number of times" };
        }
    }

    return { valid: true, message: "Coupon is valid" };
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (cartTotal) {
    let discount = 0;

    if (this.discountType === "percentage") {
        discount = (cartTotal * this.discountValue) / 100;
        // Apply max discount cap if set
        if (this.maxDiscountAmount !== null && discount > this.maxDiscountAmount) {
            discount = this.maxDiscountAmount;
        }
    } else {
        // Fixed discount
        discount = this.discountValue;
        // Don't exceed cart total
        if (discount > cartTotal) {
            discount = cartTotal;
        }
    }

    return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

// Method to record usage
couponSchema.methods.recordUsage = async function (userId) {
    this.usageCount += 1;

    if (userId) {
        const userIndex = this.usedBy.findIndex(u => u.userId?.toString() === userId?.toString());
        if (userIndex >= 0) {
            this.usedBy[userIndex].usageCount += 1;
        } else {
            this.usedBy.push({ userId, usageCount: 1 });
        }
    }

    return this.save();
};

export const Coupon = mongoose.model("Coupon", couponSchema);
