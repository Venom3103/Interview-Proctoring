import sgMail from "@sendgrid/mail";
import { connectToDB } from "../../lib/db";
import { generateOTP } from "../../lib/otp";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { email, role } = req.body; // ✅ safe, no mutation
    if (!email) {
      return res
        .status(400)
        .json({ ok: false, message: "Email is required" });
    }

    const otp = generateOTP();

    const db = await connectToDB();
    await db.collection("otps").insertOne({
      email,
      otp,
      role,
      createdAt: new Date(),
    });

    if (process.env.SENDGRID_API_KEY) {
      try {
        await sgMail.send({
          to: email,
          from: "Admin IP <2233074@sliet.ac.in>",
          subject: "verify your email",
          text: `Your OTP is ${otp}`,
        });
      } catch (e) {
        console.error("SendGrid error:", e.response?.body || e.message);
      }
    } else {
      console.log("OTP:", otp);
    }

    return res.json({ ok: true, message: "OTP sent" });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
