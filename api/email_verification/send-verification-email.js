import nodemailer from 'nodemailer';
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email } = req.body;

  const { data, error } = await supabase
    .from('chat_users')
    .select('verification_token')
    .eq('user_email', email)
    .single();

  if (error || !data) return res.status(404).json({ message: 'No token found for this email' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const verificationLink = `https://battorion-ap-is.vercel.app/api/verify-email?token=${data.verification_token}&email=${email}`;

  try {
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your email',
      text: `Click the link to verify your email: ${verificationLink}`,
      html: `<a href="${verificationLink}">Verify Email</a>`
    });
    return res.status(200).json({ message: 'Verification email sent' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send email', error: err });
  }
}
