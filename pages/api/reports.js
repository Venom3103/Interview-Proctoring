import { connectToDB } from '../../lib/db';
import PDFDocument from 'pdfkit';
export default async function handler(req,res){
  const db = await connectToDB();
  if(req.method==='GET'){ const sessions = await db.collection('sessions').find({}).toArray(); res.json({ sessions }); }
  else if(req.method==='POST'){ const { sessionId } = req.body; const events = await db.collection('events').find({ sessionId }).toArray(); res.setHeader('Content-Type','application/pdf'); res.setHeader('Content-Disposition', `attachment; filename=report_${sessionId}.pdf`); const doc = new PDFDocument(); doc.pipe(res); doc.fontSize(18).text('Proctoring Report'); doc.moveDown(); events.forEach(e=> doc.text(`${e.timestamp} - ${e.type} - ${JSON.stringify(e.details||{})}`)); doc.end(); } else res.status(405).end(); }
