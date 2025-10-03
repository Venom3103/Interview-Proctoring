import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  role: { type: String, required: true },
  experience: { type: String, required: true },
  skills: [String],
  questions: [Object],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
