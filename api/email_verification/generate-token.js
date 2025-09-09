import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from('chat_users')
    .update({
      verification_token: token,
      token_expires_at: expiresAt,
      is_verified: false
    })
    .eq('user_email', email);

  if (error) return res.status(500).json({ message: 'Database error', error });

  return res.status(200).json({ message: 'Token generated', token });
}
