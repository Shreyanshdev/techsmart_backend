import mongoose from "mongoose";

const taxSchema = new mongoose.Schema({
    sgst: {
        type: Number,
        required: true,
        default: 0
    },
    cgst: {
        type: Number,
        required: true,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

taxSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Tax = mongoose.model("Tax", taxSchema);
export default Tax;
