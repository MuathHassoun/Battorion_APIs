import nodemailer from 'nodemailer';
import { supabase } from '../../lib/supabase';
import { randomUUID } from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email, id } = req.body;

  let { data, error } = await supabase
    .from('chat_users')
    .select('verification_token')
    .eq('user_email', email)
    .single();

  if (error || !data) {
    const newToken = randomUUID();
    const { data: inserted, error: insertError } = await supabase
      .from('chat_users')
      .insert([{ user_email: email, verification_token: newToken }])
      .select('verification_token')
      .single();

    if (insertError) {
      return res.status(500).json({ message: 'Failed to insert new user', error: insertError });
    }
    data = inserted;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const verificationLink = `https://battorion-ap-is.vercel.app/api/email_verification/verify-email?id=${id}&token=${data.verification_token}&email=${email}`;
  try {
    await transporter.sendMail({
      from: `"Battorion Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Battorion | Verify Your Email to Send Feedback',
      text: `Hello,
      We received a request to submit feedback using this email address.

      Before we can process your feedback, please verify your email by clicking the link below.
      Your feedback will not be submitted until your email is verified.

      ${verificationLink}

      If you did not attempt to send feedback, you can safely ignore this email.

      Best regards,
      The Battorion Team`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; max-width:600px; margin:0 auto; padding:20px; color:#333;">
        <h2 style="color:#2c3e50;">Verify your email to send feedback</h2>
        <p>Hello,</p>
        <p>We received a request to submit feedback from this email address.
        Before we can process your feedback, please confirm that this email belongs to you by clicking the button below:</p>
        <p><strong>Note:</strong> Your feedback will not be submitted until your email is verified.</p>
        <p style="text-align:center; margin:30px 0;">
          <a href="${verificationLink}" style="background:#4CAF50; color:#fff; padding:12px 20px; text-decoration:none; border-radius:5px; display:inline-block;">
            Verify Email
          </a>
        </p>
        <p>If the button doesn’t work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all;"><a href="${verificationLink}">${verificationLink}</a></p>
        <hr style="margin:30px 0; border:none; border-top:1px solid #ddd;">
        <p style="font-size:12px; color:#999;">If you did not attempt to send feedback, you can safely ignore this email.</p>
        <p style="font-size:12px; color:#999;">© ${new Date().getFullYear()} Battorion. All rights reserved.</p>
      </div>
    `
    });
    return res.status(200).json({ message: 'Verification email sent' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send email', error: err });
  }
}
