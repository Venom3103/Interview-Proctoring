import jwt from 'jsonwebtoken';
export default function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const { email, password } = req.body;
  if(email==='admin@demo.com' && password==='admin123'){ const token = jwt.sign({ email, role:'admin' }, process.env.JWT_SECRET||'devsecret', { expiresIn:'8h' }); return res.json({ success:true, token }); }
  res.status(401).json({ success:false, message:'invalid' });
}
