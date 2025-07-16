import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  courseId:   { type: String, required: true },
  courseName: { type: String, required: true },
  facultyId:  { type: String, required: true },
  facultyName:{ type: String },
  rating:     { type: Number, required: true },
  comment:    { type: String, required: true },

  semester:   { type: Number, required: true },
  program:    { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Review', reviewSchema);
