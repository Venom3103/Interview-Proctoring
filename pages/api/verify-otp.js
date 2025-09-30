import { connectToDB } from '../../lib/db';
import jwt from 'jsonwebtoken';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const { email, otp, role } = req.body;
  if(!email||!otp) return res.status(400).json({ ok:false, message:'email & otp required' });
  const db = await connectToDB();
  const rec = await db.collection('otps').findOne({ email, otp });
  if(!rec) return res.status(400).json({ ok:false, message:'invalid otp' });
  if(role==='admin'){ const token = jwt.sign({ email, role:'admin' }, process.env.JWT_SECRET||'devsecret', { expiresIn:'8h' }); return res.json({ ok:true, token }); }
  const sessionId = Math.random().toString(36).slice(2,10);
  await db.collection('sessions').insertOne({ _id: sessionId, candidateEmail: email, startedAt: new Date() });
  res.json({ ok:true, sessionId });
}
