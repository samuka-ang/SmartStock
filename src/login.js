document.getElementById('loginform').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const token = document.getElementById('token').value;

  fetch('http://localhost:1234/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, token }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    }
  })
  .catch(error => {
    document.getElementById('error').style.display = 'block';
  });
});
