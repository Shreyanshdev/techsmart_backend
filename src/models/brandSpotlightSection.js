import mongoose from 'mongoose';

const brandSpotlightSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // internal admin label
  title: { type: String, trim: true },
  subtitle: { type: String, trim: true },

  brandName: { type: String, required: true, trim: true },
  brandLogo: { type: String, trim: true },

  handpickedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],

  limit: { type: Number, default: 8 },

  backgroundColor: { type: String, trim: true },

  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('BrandSpotlightSection', brandSpotlightSchema);

