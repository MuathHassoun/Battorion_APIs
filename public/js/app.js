document.addEventListener("DOMContentLoaded", async () => {
  const email = document.getElementById("email_address");
  if (!isValidEmail(email)) {
    window.location.href = "https://battorion-website.vercel.app/html/verification-failure.html";
    return;
  }

  try {
    const res = await fetch('/api/email_verification/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email })
    });

    if(res.status === 200) {
      const res = await fetch('/api/email_verification/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          id: "EMPTY"
        })
      });

      if (res.status === 200) {
        await import('/public/js/channel.js');
      } else {
        window.location.href = "https://battorion-website.vercel.app/html/verification-failure.html";
      }
    } else {
      window.location.href = "https://battorion-website.vercel.app/html/verification-failure.html";
    }
  } catch (error) {
    window.location.href = "https://battorion-website.vercel.app/html/verification-failure.html";
  }
});

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
