import {supabase} from "../../lib/supabase";

document.addEventListener("DOMContentLoaded", async () => {
  const emailElement = document.getElementById("email_address");
  let email = emailElement?.value || "";
  let errorMessage = "";

  if (!isValidEmail(email)) {
    const params = new URLSearchParams(window.location.search);
    email = params.get("email");
    if (!isValidEmail(email)) {
      redirectWithError("invalid_email");
      return;
    }
  }

  if (document.cookie.includes("is_web_verified=true")) {
    window.location.href = 'https://battorion-website.vercel.app/html/verification-success.html';
  } else {
    try {
      const tokenRes = await fetch('/api/email_verification/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, response: "Website" })
      });

      if (tokenRes.status !== 200) {
        let tokenError;
        try {
          tokenError = await tokenRes.json();
        } catch {
          tokenError = {};
        }
        errorMessage = `token_generation_failed_${tokenRes.status}:${tokenError.message || "unknown_error"}`;
        redirectWithError(errorMessage);
        return;
      }

      const sendRes = await fetch('/api/email_verification/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, id: "EMPTY" })
      });

      if (sendRes.status === 200) {
        const channel = supabase
          .channel('verification-channel')
          .on(
            'postgres_changes', {
              event: 'UPDATE',
              schema: 'public',
              table: 'chat_users',
              filter: `user_email=eq.${email.toLowerCase().trim()}`
            },
            async (payload) => {
              if (payload.new.is_web_verified) {
                try {
                  await fetch('/api/email_verification/verification-channel', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ email })
                  });
                } catch (err) {
                  window.location.href = 'https://battorion-website.vercel.app/html/verification-success.html';
                }
                window.location.href = 'https://battorion-website.vercel.app/html/verification-success.html';
              }
            }
          )
          .subscribe();

        window.addEventListener('beforeunload', () => {
          supabase.removeChannel(channel);
        });
      } else {
        let sendError;
        try {
          sendError = await sendRes.json();
        } catch {
          sendError = {};
        }
        errorMessage = `email_sending_failed_${sendRes.status}:${sendError.errored || sendError.message || "unknown_error"}`;
        redirectWithError(errorMessage);
      }
    } catch (error) {
      errorMessage = `network_or_server_error: ${encodeURIComponent(error.message)}`;
      redirectWithError(errorMessage);
    }
  }
});

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function redirectWithError(errorMessage) {
  window.location.href =
    `https://battorion-website.vercel.app/html/verification-failure.html?error=${encodeURIComponent(errorMessage)}`;
}
