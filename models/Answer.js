import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  question: String,
  answerText: String,
  result: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Answer || mongoose.model('Answer', AnswerSchema);
