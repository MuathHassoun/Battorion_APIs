import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const { data, error } = await supabase
    .from('chat_users')
    .select('is_web_verified')
    .eq('user_email', email)
    .single();

  if (error) {
    return res.status(500).json({ error: 'Database error', details: error.message });
  }

  const { error: updateError } = await supabase
    .from('chat_users')
    .update({ is_web_verified: false })
    .eq('user_email', email)

  if (updateError) return res.status(500).json({ error: 'Update error', details: updateError.message });
  return res.status(200).json({ is_verified: data.is_web_verified });
}
