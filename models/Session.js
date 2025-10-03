import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  candidateName: String,
  email: String,
  role: String,
  experience: String,
  startTime: Date,
  endTime: Date,
  proctoringEvents: [Object],
  integrityScore: { type: Number, default: 100 },
});

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);
