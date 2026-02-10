import mongoose from "mongoose";

/**
 * Product Model (Master Product Collection)
 * Contains static product information that doesn't change per store
 * Pricing, stock, and variants are managed in the Inventory collection
 */

// Attribute Schema for flexible key-value pairs
const attributeSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { _id: false });

const productSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        description: "Product name"
    },
    brand: {
        type: String,
        trim: true,
        index: true,
        description: "Brand name"
    },

    // Category
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        index: true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        index: true,
        description: "Reference to SubCategory"
    },

    // Descriptions
    shortDescription: {
        type: String,
        maxlength: 200,
        description: "Brief description for cards"
    },
    description: {
        type: String,
        description: "Detailed product description"
    },

    // Images
    images: [{
        type: String,
        description: "Product image URLs"
    }],

    // Flexible Attributes (Attribute Pattern)
    attributes: {
        type: [attributeSchema],
        default: [],
        description: "Flexible key-value attributes"
    },

    // Product Status
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },

    // Search Tags
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    deliveryInstructions: [{
        type: String,
        trim: true
    }],

    // Flexible Other Information (key-value pairs for any additional info)
    otherInformation: [{
        label: {
            type: String,
            required: true,
            trim: true,
            description: "Display label (e.g., 'Country of Origin', 'Manufacturer', 'FSSAI License')"
        },
        value: {
            type: String,
            required: true,
            trim: true
        }
    }],

    // Rating Statistics (calculated from reviews)
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },

    // Manually set related products
    relatedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        description: "Manually curated related products"
    }],

    // SEO
    slug: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Text index for search
productSchema.index({ name: 'text', brand: 'text', description: 'text', tags: 'text' });

// Compound indexes
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ brand: 1, category: 1 });

// Virtual to get attribute by key
productSchema.methods.getAttribute = function (key) {
    const attr = this.attributes.find(a => a.key === key);
    return attr ? attr.value : null;
};

// Static method to find active products by category
productSchema.statics.findByCategory = async function (categoryId) {
    return this.find({
        category: categoryId,
        isActive: true
    }).sort({ name: 1 });
};

// Pre-save hook to generate slug
productSchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;