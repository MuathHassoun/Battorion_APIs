document.addEventListener("DOMContentLoaded", async () => {
  const emailElement = document.getElementById("email_address");
  let email = emailElement.value;
  let errorMessage = "";

  if (!isValidEmail(email)) {
    const params = new URLSearchParams(window.location.search);
    email = params.get("email");
    if (!isValidEmail(email)) {
      redirectWithError("invalid_email");
      return;
    }
  }

  try {
    const tokenRes = await fetch('/api/email_verification/generate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });

    if (tokenRes.status !== 200) {
      errorMessage = `token_generation_failed_${tokenRes.status}`;
      redirectWithError(errorMessage);
      return;
    }

    const sendRes = await fetch('/api/email_verification/send-verification-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, id: "EMPTY" })
    });

    if (sendRes.status === 200) {
      await import('public/js/channel.js');
    }  else {
      errorMessage = `email_sending_failed_${sendRes.status}`;
      redirectWithError(errorMessage);
    }
  } catch (error) {
    errorMessage = `network_or_server_error:${encodeURIComponent(error.message)}`;
    redirectWithError(errorMessage);
  }
});

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function redirectWithError(errorMessage) {
  window.location.href =
    `https://battorion-website.vercel.app/html/verification-failure.html?error=${errorMessage}`;
}
