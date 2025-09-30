import { connectToDB } from '../../lib/db';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const ev = req.body;
  const db = await connectToDB();
  await db.collection('events').insertOne(ev);
  res.json({ ok:true });
}
