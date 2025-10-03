import dbConnect from "../../lib/db";
import Report from "../../models/Report";

export default async function handler(req, res) {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });
  await dbConnect();
  const report = await Report.findOne({ sessionId });
  res.status(200).json(report || {});
}
