async function resendEmail() {
  let errorMessage = "";
  const tokenRes = await fetch('/api/email_verification/generate-token', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email})
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
