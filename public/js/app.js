document.addEventListener("DOMContentLoaded", async () => {
  const emailElement = document.getElementById("email_address");
  const email = emailElement.value;
  if (!isValidEmail(email)) {
    window.location.href = "https://battorion-website.vercel.app/html/verification-failure.html";
    return;
  }

  try {
    alert("Message 1");
    const res = await fetch('/api/email_verification/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email })
    });

    if(res.status === 200) {
      alert("Message 2");
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
        alert("Message 3");
        await import('public/js/channel.js');
      } else {
        alert("Message 4");
        window.location.href = "https://battorion-website.vercel.app/html/verification-failure.html";
      }
    } else {
      alert("Message 5");
      window.location.href = "https://battorion-website.vercel.app/html/verification-failure.html";
    }
  } catch (error) {
    alert("Message 6");
    window.location.href = "https://battorion-website.vercel.app/html/verification-failure.html";
  }
});

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
