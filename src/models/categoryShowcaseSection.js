import mongoose from 'mongoose';

const categoryShowcaseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // internal admin label
  title: { type: String, trim: true },
  subtitle: { type: String, trim: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  limit: { type: Number, default: 8 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('CategoryShowcaseSection', categoryShowcaseSchema);

