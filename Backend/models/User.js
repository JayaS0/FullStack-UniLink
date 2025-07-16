import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['student', 'faculty', 'admin'], required: true },

  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: function () { return this.role === 'student'; },
  },

  semester: {
    type: Number,
    required: function () { return this.role === 'student'; },
  },

  programs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program' }], // for faculty
  courses:  [String],   // for faculty

  verified: { type: Boolean, default: false },
  verificationToken: { type: String },

  profilePic: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
