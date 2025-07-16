import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  facultyId:  { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  department: String,
  email:      String,
});

export default mongoose.model('Faculty', facultySchema);
