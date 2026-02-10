import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
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
    // Optional: Sort order for home screen grid
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
