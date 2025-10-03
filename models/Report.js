import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  knowledgeScore: Number,
  communicationScore: Number,
  codingScore: Number,
  integrityScore: Number,
  finalScore: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
