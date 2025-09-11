import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Method not allowed');

  const { id, token, email } = req.query;
  if (!token || !email || !id) {
    return res.status(400).send('Missing id, token, or email');
  }

  const { data, error } = await supabase
    .from('chat_users')
    .select('*')
    .eq('user_email', email)
    .eq('verification_token', token)
    .single();

  if (error || !data) return res.status(404).redirect('/html/error.html');
  if (new Date(data.token_expires_at) < new Date()) return res.status(410).redirect('/html/error.html');

  const { error: updateError } = await supabase
    .from('chat_users')
    .update({ device_unique_id: id, is_verified: true, verification_token: null, token_expires_at: null })
    .eq('user_email', email);

  if (updateError) return res.redirect('/html/error.html');
  return res.redirect('/html/success.html');
}
