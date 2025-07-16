import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: String,
  type:        { type: String, required: true },
  fileUrls:    [String],

  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true,
  },

  semester: Number,
  relatedCourse: String,

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
