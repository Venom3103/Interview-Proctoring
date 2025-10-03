import { runCode } from '../../lib/evaluation';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const { code, language } = req.body;
  try{
    const result = await runCode({ code, language });
    res.status(200).json(result);
  } catch(err){ res.status(500).json({error:err.message}); }
}
