import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Method not allowed');

  const { token, email } = req.query;
  if (!token || !email) return res.status(400).send('Missing token or email');

  const { data, error } = await supabase
    .from('chat_users')
    .select('*')
    .eq('user_email', email)
    .eq('verification_token', token)
    .single();

  if (error || !data) return res.status(404).send('Invalid or expired token');
  if (new Date(data.token_expires_at) < new Date()) return res.status(410).send('Token expired');

  const { error: updateError } = await supabase
    .from('chat_users')
    .update({ is_verified: true, verification_token: null, token_expires_at: null })
    .eq('user_email', email);

  if (updateError) return res.redirect('/html/error.html');
  return res.redirect('/html/success.html');
}
