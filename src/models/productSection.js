import mongoose from 'mongoose';

const sectionKinds = ['TRENDING', 'HOT_DEAL', 'NEW', 'SPONSORED', 'CATEGORY'];

const productSectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // internal admin label
  title: { type: String, trim: true },
  subtitle: { type: String, trim: true },

  sectionKind: {
    type: String,
    enum: sectionKinds,
    required: true
  },

  // For CATEGORY kind
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  // For SPONSORED / handpicked
  handpickedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],

  limit: { type: Number, default: 10 },

  backgroundColor: { type: String, trim: true },
  gradientColors: [{ type: String }],

  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('ProductSection', productSectionSchema);

