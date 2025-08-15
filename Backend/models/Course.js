import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  description: String,
  semester: { type: Number, required: true },

  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Course', courseSchema);
