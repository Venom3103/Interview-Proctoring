# Focus Proctoring — Complete (MVP)

## Features included
- Candidate/Admin unified login (choose role) with OTP (SendGrid) and admin JWT auth
- Candidate session: webcam + screen recording (MediaRecorder) and TensorFlow.js detection (face + object) scaffold
- Events saved to MongoDB and emitted via Socket.io for live admin monitoring
- Admin dashboard to view sessions and generate PDF reports
- OpenAI placeholders for question generation and automated feedback

## Quick start
1. Copy `.env.example` to `.env.local` and set:
   - MONGODB_URI, SENDGRID_API_KEY (optional), JWT_SECRET, OPENAI_API_KEY
2. Install deps: `npm install`
3. Run: `npm run dev`
4. Open http://localhost:3000

Note: For production, run socket server separately or deploy with a platform that supports WebSockets.
