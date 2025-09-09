import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const { v4: uuidv4 } = await import('uuid');
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from('chat_users')
    .update({ verification_token: token, token_expires_at: expiresAt })
    .eq('user_email', email);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ message: 'Token generated successfully' });
}
