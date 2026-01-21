import mongoose from 'mongoose';

// ... (schema definition remains same, just top and bottom changes)

const bannerSchema = new mongoose.Schema({
    position: {
        type: String,
        enum: ['HOME_MAIN', 'HOME_SECONDARY'],
        required: true,
        unique: true
    },
    slides: [{
        imageUrl: {
            type: String,
            required: true
        },
        title: {
            type: String, // Text on top of image
            default: ''
        },
        buttonText: {
            type: String, // Button internal text
            default: ''
        },
        actionType: {
            type: String,
            enum: ['PRODUCT', 'CATEGORY', 'BRAND', 'NONE'],
            default: 'NONE'
        },
        targetValue: {
            type: String, // ID or Name of the target
            default: ''
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Banner', bannerSchema);
