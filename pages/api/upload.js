import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { connectToDB } from '../../lib/db';

export const config = { api: { bodyParser: false } };
const UPLOAD_DIR = path.join(process.cwd(), '.uploads');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });

  const form = new formidable.IncomingForm({
    uploadDir: UPLOAD_DIR,
    keepExtensions: true,
    multiples: false,
    filename: (name, ext, part) => `video-${Date.now()}${ext}`
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ ok: false, message: String(err) });

    const file = files.video;
    if (!file) return res.status(400).json({ ok: false, message: 'No video uploaded' });

    const sessionId = fields.sessionId || 'demo';
    const db = await connectToDB();
    await db.collection('sessions').updateOne(
      { _id: sessionId },
      { $set: { videoPath: file.path, endedAt: new Date() } },
      { upsert: true }
    );

    res.json({ ok: true, path: file.path });
  });
}
