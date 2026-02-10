import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        index: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
    // Sort order within category
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Compound index for unique name per category
subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

// Compound index for efficient queries
subcategorySchema.index({ category: 1, isActive: 1, order: 1 });

const SubCategory = mongoose.model("SubCategory", subcategorySchema);
export default SubCategory;
