import { supabase } from '../../lib/supabase.js';
export function startEmailWatcher(email) {
  if (!email) return;

  const channel = supabase
    .channel('verify-channel')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_users',
        filter: `user_email=eq.${email}`,
      },
      (payload) => {
        if (payload.new.is_verified) {
          window.location.href =
            'https://battorion-website.vercel.app/html/verification-success.html';
        }
      }
    )
    .subscribe();

  window.addEventListener('beforeunload', () => {
    supabase.removeChannel(channel);
  });
}
