(() => {
  const form = document.getElementById('admin-login-form');
  const error = document.getElementById('admin-login-error');
  const submit = document.getElementById('admin-login-submit');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.hidden = true;
    submit.disabled = true;
    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.value, password: form.password.value }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || (response.status === 429 ? 'Too many attempts. Try again soon.' : 'Sign-in failed'));
      location.assign('/admin');
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
      submit.disabled = false;
    }
  });
})();
