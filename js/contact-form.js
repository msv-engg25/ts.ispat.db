document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-button');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value.trim(),
      company: document.getElementById('company').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      subject: document.getElementById('subject').value.trim(),
      message: document.getElementById('message').value.trim(),
      inquiryType: document.getElementById('inquiry-type').value,
      consent: document.getElementById('consent').checked
    };

    // Check for consent
    if (!formData.consent) {
      showFormMessage('You must give consent to submit the form.', 'error');
      return;
    }

    // Basic phone validation (only numbers, optional +, -, (), spaces)
    const phonePattern = /^[+\d\s()-]{7,20}$/;
    if (!phonePattern.test(formData.phone)) {
      showFormMessage('Please enter a valid phone number.', 'error');
      return;
    }

    // Disable submit button during processing
    submitBtn.disabled = true;
    showFormMessage('Submitting your message...', 'processing');

    // Send request
    fetch('https://backend2-bclm.onrender.com/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(async res => {
        const data = await res.json();
        console.log('Response:', data);
        if (data.success) {
          showFormMessage('Thank you! Your message has been submitted.', 'success');
          contactForm.reset();
        } else {
          showFormMessage(data.error || 'Something went wrong.', 'error');
        }
        setTimeout(hideFormMessage, 5000);
      })
      .catch(err => {
        console.error('❌ Error:', err);
        showFormMessage('Failed to contact server. Try again later.', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });

  function showFormMessage(message, type) {
    const msg = document.getElementById('form-message');
    msg.textContent = message;
    msg.style.display = 'block';
    msg.className = 'form-message ' + type;
    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function hideFormMessage() {
    document.getElementById('form-message').style.display = 'none';
  }
});
