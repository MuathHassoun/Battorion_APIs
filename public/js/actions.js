async function resendEmail() {
  const params = new URLSearchParams(window.location.search);
  let email = params.get("email");
  let errorMessage = "";

  const tokenRes = await fetch('/api/email_verification/generate-token', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: email, response: "Website"})
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

  await fetch('/api/email_verification/send-verification-email', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, id: "EMPTY"})
  });
}

function redirectWithError(errorMessage) {
  window.location.href =
    `https://battorion-website.vercel.app/html/verification-failure.html?error=${encodeURIComponent(errorMessage)}`;
}

async function checkVerifyEmail() {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');
  try {
    const checkRes = await fetch('/api/email_verification/verification-channel', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email})
    });

    if (checkRes.status === 200) {
      localStorage.setItem('userEmail', email);
      window.location.href = 'https://battorion-website.vercel.app/' + (
        localStorage.getItem('chatting') === "true"
          ? ''
          : 'html/verification-success.html'
      );
    }
  } catch (err) {
    window.location.href =
      `https://battorion-website.vercel.app/html/verification-failure.html?error=${encodeURIComponent(err.message)}`;
  }
}
