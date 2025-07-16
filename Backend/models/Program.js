import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  semesters: [{ type: Number }], // Example: [1, 2, 3, 4, 5, 6, 7, 8]
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Program', programSchema);
