import mongoose from "mongoose";

// Simplified Nutrition Schema for dairy products
const nutritionSchema = new mongoose.Schema({
    calories: {
        type: Number,
        default: 0,
        description: "Calories per 100ml/g"
    },
    protein: {
        type: Number,
        default: 0,
        description: "Protein in grams per 100ml/g"
    },
    fat: {
        type: Number,
        default: 0,
        description: "Fat in grams per 100ml/g"
    },
    calcium: {
        type: Number,
        default: 0,
        description: "Calcium in mg per 100ml/g"
    },
    vitaminD: {
        type: Number,
        default: 0,
        description: "Vitamin D in IU per 100ml/g"
    }
}, { _id: false });

// Quantity Schema
const quantitySchema = new mongoose.Schema({
    value: {
        type: Number,
        required: true,
        description: "Numeric value of quantity"
    },
    unit: {
        type: String,
        required: true,
        enum: ['ml', 'l', 'g', 'kg'],
        description: "Unit of measurement"
    }
}, { _id: false });

// Dairy-Specific Product Schema
const productSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        description: "Product name"
    },
    shortDescription: {
        type: String,
        maxlength: 200,
        description: "Brief description for cards"
    },
    description: {
        type: String,
        description: "Detailed product description"
    },
    images: [{
        type: String,
        required: true,
        description: "Product image URLs"
    }],

    // Dairy-Specific Fields (optional for backward compatibility)
    animalType: {
        type: String,
        enum: ['cow', 'buffalo', 'goat', 'mixed'],
        description: "Type of animal milk"
    },
    breed: {
        type: String,
        description: "Animal breed (e.g., Jersey, Holstein, Murrah, Sahiwal)"
    },
    productType: {
        type: String,
        enum: ['milk', 'curd', 'paneer', 'ghee', 'butter', 'cheese', 'buttermilk', 'lassi'],
        description: "Type of dairy product"
    },
    processingType: {
        type: String,
        enum: ['raw', 'pasteurized', 'homogenized', 'ultra-pasteurized', 'boiled'],
        description: "Processing method"
    },
    fatContent: {
        type: Number,
        description: "Fat percentage (e.g., 3.5, 6.0)"
    },

    // Category
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        description: "Product category"
    },

    // Pricing & Quantity
    price: {
        type: Number,
        required: true,
        description: "Product price"
    },
    discountPrice: {
        type: Number,
        description: "Discounted price"
    },
    quantity: {
        type: quantitySchema,
        required: true,
        default: () => ({ value: 500, unit: 'ml' }),
        description: "Quantity with value and unit"
    },

    // Nutrition
    nutrition: {
        type: nutritionSchema,
        description: "Nutritional information"
    },

    // Quality & Safety
    shelfLife: {
        type: String,
        description: "Shelf life (e.g., '2 days', '7 days')"
    },
    storageTemp: {
        type: String,
        description: "Storage temperature (e.g., '2-4°C')"
    },
    certifications: [{
        type: String,
        description: "Certifications like 'FSSAI', 'Organic', 'A2'"
    }],

    // Stock and Availability
    stock: {
        type: Number,
        default: 0,
        description: "Available stock"
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'out_of_stock'],
        default: 'active',
        description: "Product status"
    },
    featured: {
        type: Boolean,
        default: false,
        description: "Whether product is featured"
    },

    // Subscription Configuration
    isSubscriptionAvailable: {
        type: Boolean,
        default: false,
        description: "Whether this product is available for subscription"
    },

    subscriptionConfig: {
        deliveryFrequencies: [{
            type: String,
            enum: ['daily', 'alternate', 'weekly', 'monthly']
        }],

        frequencyPricing: {
            daily: {
                enabled: { type: Boolean, default: true },
                multiplier: { type: Number, default: 1.0 },
                maxDeliveries: { type: Number, default: 30 },
                description: { type: String, default: "Daily delivery - 30 deliveries per month" }
            },
            alternate: {
                enabled: { type: Boolean, default: true },
                multiplier: { type: Number, default: 1.0 },
                maxDeliveries: { type: Number, default: 15 },
                description: { type: String, default: "Alternate day delivery - 15 deliveries per month" }
            },
            weekly: {
                enabled: { type: Boolean, default: true },
                multiplier: { type: Number, default: 1.0 },
                maxDeliveries: { type: Number, default: 5 },
                description: { type: String, default: "Weekly delivery - 5 deliveries per month" }
            },
            monthly: {
                enabled: { type: Boolean, default: true },
                multiplier: { type: Number, default: 1.0 },
                maxDeliveries: { type: Number, default: 1 },
                description: { type: String, default: "Monthly delivery - 1 delivery per month" }
            }
        }
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better search performance
productSchema.index({ name: 'text', shortDescription: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ animalType: 1 });
productSchema.index({ productType: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ fatContent: 1 });

// Virtual for formatted quantity
productSchema.virtual('formattedQuantity').get(function () {
    if (!this.quantity) return '500ml';
    if (typeof this.quantity === 'string') return this.quantity;
    if (this.quantity.value && this.quantity.unit) {
        return `${this.quantity.value}${this.quantity.unit}`;
    }
    return '500ml';
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
    if (this.discountPrice && this.price) {
        return Math.round(((this.price - this.discountPrice) / this.price) * 100);
    }
    return 0;
});

// Pre-save middleware to update timestamps
productSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;