document.addEventListener('DOMContentLoaded', () => {
  const reviewForm = document.getElementById('review-form');
  const messageElement = document.getElementById('review-message');
  const imageInput = document.getElementById('review-image');

  // Your backend base URL
  const backendBaseUrl = 'https://database-ispat.onrender.com';

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(reviewForm);

      // Extract and trim form data for validation
      const data = {
        name: formData.get('review-name')?.trim() || '',
        company: formData.get('review-company')?.trim() || '',
        email: formData.get('review-email')?.trim() || '',
        position: formData.get('review-position')?.trim() || '',
        product: formData.get('review-product')?.trim() || '',
        rating: formData.get('rating')?.trim() || '',
        title: formData.get('review-title')?.trim() || '',
        message: formData.get('review-message')?.trim() || '',
      };

      if (!validateForm(data)) return;

      showMessage('Submitting your review...', 'processing');

      try {
        const response = await fetch(`${backendBaseUrl}/api/reviews`, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          showMessage('Thank you for your review! It has been submitted successfully and will be published after moderation.', 'success');
          reviewForm.reset();
          setTimeout(hideMessage, 10000);
        } else {
          showMessage(result.error || 'An error occurred while submitting your review.', 'error');
          setTimeout(hideMessage, 10000);
        }
      } catch (error) {
        console.error('Submission error:', error);
        showMessage('Failed to submit review. Please try again later.', 'error');
        setTimeout(hideMessage, 10000);
      }
    });
  }

  if (imageInput) {
    imageInput.addEventListener('change', () => {
      if (imageInput.files.length > 3) {
        showMessage('You can upload a maximum of 3 images.', 'error');
        imageInput.value = '';
        return;
      }

      for (const file of imageInput.files) {
        if (!file.type.startsWith('image/')) {
          showMessage('Please upload only image files.', 'error');
          imageInput.value = '';
          return;
        }

        if (file.size > 2 * 1024 * 1024) {
          showMessage('Image size should not exceed 2MB.', 'error');
          imageInput.value = '';
          return;
        }
      }

      hideMessage(); // Clear previous messages if validation passes
    });
  }

  // Validate required fields and email format
  function validateForm(data) {
    for (const [key, value] of Object.entries(data)) {
      if (!value) {
        showMessage('Please fill in all required fields.', 'error');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showMessage('Please enter a valid email address.', 'error');
      return false;
    }

    if (!data.rating) {
      showMessage('Please select a rating.', 'error');
      return false;
    }

    return true;
  }

  function showMessage(message, type) {
    if (!messageElement) return;

    messageElement.textContent = message;
    messageElement.style.display = 'block';
    messageElement.className = `form-message ${type}`;
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function hideMessage() {
    if (messageElement) {
      messageElement.style.display = 'none';
      messageElement.textContent = '';
      messageElement.className = '';
    }
  }
});
