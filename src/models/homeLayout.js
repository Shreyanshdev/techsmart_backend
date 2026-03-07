import mongoose from 'mongoose';

/**
 * HomeLayout Model
 * CMS-driven dynamic home screen sections.
 * Each document represents one section on the home screen.
 * Sections are ordered by the 'order' field and rendered by the frontend.
 */

const homeLayoutSchema = new mongoose.Schema({
    // Section type determines which frontend component renders this section
    type: {
        type: String,
        enum: [
            'BANNER_CAROUSEL',    // Full-width image carousel
            'CATEGORY_GRID',      // 4-column category grid (non-scrolling)
            'PRODUCT_STRIP',      // Horizontal scrolling product cards
            'BRAND_SPOTLIGHT',    // Brand banner + its products
            'CATEGORY_SHOWCASE',  // Category header + products grid
            'CUSTOM_BANNER',      // Single promotional banner
            'FEATURED_SECTION'    // Featured products
        ],
        required: true
    },

    // Display title (e.g., "Trending Now", "Hot Deals")
    title: {
        type: String,
        trim: true,
        default: ''
    },

    // Optional subtitle
    subtitle: {
        type: String,
        trim: true,
        default: ''
    },

    // If empty, shows to ALL branches. If populated, shows ONLY to users in these specific branches.
    targetBranches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    }],

    // NEW: link to dedicated section configs (Blinkit-style)
    bannerSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BannerSection'
    },
    productSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductSection'
    },
    brandSpotlightSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BrandSpotlightSection'
    },
    categoryShowcaseSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryShowcaseSection'
    },

    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // Display order on home screen (lower = higher on page)
    order: {
        type: Number,
        required: true,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true
});

// Index for efficient home feed query
homeLayoutSchema.index({ isActive: 1, order: 1 });

const HomeLayout = mongoose.model('HomeLayout', homeLayoutSchema);
export default HomeLayout;
