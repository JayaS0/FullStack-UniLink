import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  link:        { type: String },
  mediaUrls:   [String],
  company:     { type: String },
  category:    { type: String },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Listing', listingSchema);
