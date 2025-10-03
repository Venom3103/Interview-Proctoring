import { evaluateAnswer } from '../../lib/ai';
import dbConnect from '../../lib/db';
import Answer from '../../models/Answer';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const { question, answerText, sessionId, questionId } = req.body;
  try{
    await dbConnect();
    const result = await evaluateAnswer({ question, answer: answerText });
    const saved = await Answer.create({ sessionId, questionId, question, answerText, result });
    res.status(200).json(saved);
  } catch(err){ res.status(500).json({error:err.message}); }
}
