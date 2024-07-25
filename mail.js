fetch('/send-email', {
    method: 'POST',
    body: JSON.stringify({
      to: 'markbironga@gmail.com',
      subject: 'Test Email',
      body: 'Email body'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Email sent successfully');
  })
  .catch(error => {
    console.error('Error sending email:', error);
  });
  