import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  description: String,
  semester: Number,
});

export default mongoose.model('Course', courseSchema);
