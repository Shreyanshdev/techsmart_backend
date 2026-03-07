import mongoose from 'mongoose';

const bannerActionTypes = ['PRODUCT', 'CATEGORY', 'BRAND', 'NONE'];

const bannerSectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // internal admin label
  title: { type: String, trim: true },
  subtitle: { type: String, trim: true },

  // Single banner vs multi-slide carousel
  isCarousel: { type: Boolean, default: false },

  // For carousels
  slides: [{
    imageUrl: { type: String, required: true },
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    buttonText: { type: String, trim: true },
    actionType: {
      type: String,
      enum: bannerActionTypes,
      default: 'NONE'
    },
    targetProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    targetCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    targetBrand: { type: String, trim: true },
    order: { type: Number, default: 0 }
  }],

  // For single-banner mode
  imageUrl: { type: String, trim: true },
  buttonText: { type: String, trim: true },
  actionType: {
    type: String,
    enum: bannerActionTypes,
    default: 'NONE'
  },
  targetProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  targetCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  targetBrand: { type: String, trim: true },

  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('BannerSection', bannerSectionSchema);

