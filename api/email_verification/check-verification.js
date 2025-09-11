import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      verified: 0
    });
  }

  const { email, id } = req.body;
  if (!email || !id) {
    return res.status(400).json({
      error: 'Email and ID are required',
      verified: 0
    });
  }

  const { data: user, error: emailError } = await supabase
    .from('chat_users')
    .select('device_unique_id, is_verified')
    .eq('user_email', email)
    .single();

  if (emailError || !user) {
    return res.status(404).json({
      error: 'Email not found',
      verified: 0
    });
  } if (user.device_unique_id !== id) {
    return res.status(403).json({
      error: 'ID does not match this email',
      verified: 0
    });
  }
  return res.status(200).json({ verified: user.is_verified ? 1 : 0 });
}
