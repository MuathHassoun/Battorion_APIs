import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, id } = req.body;
  if (!email || !id) {
    return res.status(400).json({ error: 'Email and ID are required' });
  }

  const { data, error } = await supabase
    .from('chat_users')
    .select('id, is_verified')
    .eq('user_email', email)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'User not found' });
  } if (data.id !== id) {
    return res.status(403).json({ error: 'ID does not match the email' });
  }
  return res.status(200).json({ verified: data.is_verified ? 1 : 0 });
}
