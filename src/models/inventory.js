import mongoose from "mongoose";
import Counter from "./counter.js";

/**
 * Inventory Model
 * Links products to branches with variant-specific pricing and stock
 * Each document represents one unique product variant in one specific branch
 */

// Variant Schema
const variantSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
        trim: true,
        description: "Stock Keeping Unit (e.g., FOR_OIL_1L)"
    },
    packSize: {
        type: String,
        required: true,
        description: "Package size (e.g., 1L, 500ml, 1kg)"
    },
    weightValue: {
        type: Number,
        required: true,
        description: "Numeric weight/volume value"
    },
    weightUnit: {
        type: String,
        required: true,
        enum: ['ml', 'l', 'g', 'kg', 'pcs', 'dozen'],
        description: "Unit of measurement"
    },
    images: [{
        type: String,
        description: "Image URLs for this variant"
    }],
    maxQtyPerOrder: {
        type: Number,
        default: 0,
        description: "Maximum quantity allowed per order (0 for unlimited)"
    },
    handling: {
        fragile: { type: Boolean, default: false },
        cold: { type: Boolean, default: false },
        heavy: { type: Boolean, default: false }
    }
}, { _id: false });

// Pricing Schema
const pricingSchema = new mongoose.Schema({
    mrp: {
        type: Number,
        required: true,
        description: "Maximum Retail Price"
    },
    sellingPrice: {
        type: Number,
        required: true,
        description: "Current selling price"
    },
    costPrice: {
        type: Number,
        description: "Cost price for margin calculation"
    },
    discount: {
        type: Number,
        default: 0,
        description: "Discount percentage"
    }
}, { _id: false });

const inventorySchema = new mongoose.Schema({
    // Unique Inventory ID
    inventoryId: {
        type: String,
        unique: true,
        description: "Unique inventory identifier"
    },

    // References
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
        index: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true
    },

    // Variant Information
    variant: {
        type: variantSchema,
        required: true
    },


    // Pricing for this branch
    pricing: {
        type: pricingSchema,
        required: true
    },

    // Stock Management
    stock: {
        type: Number,
        default: 0,
        min: 0,
        description: "Current stock quantity"
    },
    reservedStock: {
        type: Number,
        default: 0,
        min: 0,
        description: "Stock reserved for pending orders"
    },
    lowStockThreshold: {
        type: Number,
        default: 10,
        description: "Alert when stock falls below this"
    },

    // Availability
    isAvailable: {
        type: Boolean,
        default: true,
        index: true
    },
    availableFrom: {
        type: Date,
        description: "When this item becomes available"
    },
    availableUntil: {
        type: Date,
        description: "When this item stops being available"
    },

    // Display Order
    displayOrder: {
        type: Number,
        default: 0,
        description: "Order for display in listings"
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound indexes for efficient queries
inventorySchema.index({ branch: 1, product: 1, 'variant.sku': 1 }, { unique: true });
inventorySchema.index({ branch: 1, isAvailable: 1 });
inventorySchema.index({ product: 1, isAvailable: 1 });
inventorySchema.index({ 'variant.sku': 1 });

// Virtual for available stock (total - reserved)
inventorySchema.virtual('availableStock').get(function () {
    return Math.max(0, this.stock - this.reservedStock);
});

// Virtual for discount percentage
inventorySchema.virtual('discountPercentage').get(function () {
    if (this.pricing?.mrp && this.pricing?.sellingPrice) {
        return Math.round(((this.pricing.mrp - this.pricing.sellingPrice) / this.pricing.mrp) * 100);
    }
    return 0;
});

// Virtual for low stock check
inventorySchema.virtual('isLowStock').get(function () {
    return this.stock <= this.lowStockThreshold;
});

// Static method to find available inventory for a branch
inventorySchema.statics.findByBranch = async function (branchId, options = {}) {
    const query = {
        branch: branchId,
        isAvailable: true,
        stock: { $gt: 0 }
    };

    if (options.productId) {
        query.product = options.productId;
    }

    return this.find(query)
        .populate('product', 'name brand category images description')
        .sort({ displayOrder: 1, 'variant.packSize': 1 });
};

// Static method to update stock
inventorySchema.statics.updateStock = async function (inventoryId, quantity, operation = 'decrement') {
    const update = operation === 'decrement'
        ? { $inc: { stock: -quantity } }
        : { $inc: { stock: quantity } };

    return this.findByIdAndUpdate(inventoryId, update, { new: true });
};

// Pre-save hook to generate inventoryId
inventorySchema.pre('save', async function (next) {
    if (this.isNew && !this.inventoryId) {
        const counter = await Counter.findOneAndUpdate(
            { name: 'inventoryId' },
            { $inc: { sequenceValue: 1 } },
            { new: true, upsert: true }
        );
        this.inventoryId = `INV_${counter.sequenceValue.toString().padStart(6, '0')}`;
    }
    next();
});

// Update isAvailable based on stock
inventorySchema.pre('save', function (next) {
    if (this.stock <= 0) {
        this.isAvailable = false;
    } else {
        this.isAvailable = true;
    }
    next();
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
