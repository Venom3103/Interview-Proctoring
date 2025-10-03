import { generateQuestions } from '../../lib/ai';
import dbConnect from '../../lib/db';
import Question from '../../models/Question';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const { role, skills, experience, num } = req.body;
  try {
    await dbConnect();
    const questions = await generateQuestions({ role, skills, experience, num: num||6 });
    const created = await Question.create({ role, skills, experience, questions });
    res.status(200).json({ questions, id: created._id });
  } catch(err){ res.status(500).json({error:err.message}); }
}
