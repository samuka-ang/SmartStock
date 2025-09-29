const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'index.html';
}

fetch('http://localhost:1234/dashboard', {
  method: 'GET',
  headers: {
    'Authorization': token,
  },
})
.then(response => response.json())
.then(data => {
  document.getElementById('message').innerText = data.message;
})
.catch(error => {
  window.location.href = 'index.html';
});

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

//sha256, gerar hash