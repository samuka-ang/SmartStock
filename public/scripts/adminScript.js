const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const btnMenuToggle = document.getElementById('btn-menu-toggle');
const btnSidebarLogout = document.getElementById('btn-sidebar-logout');
const titulo = document.getElementById('titulo-usuario');

// Toggle do menu lateral
btnMenuToggle.addEventListener('click', () => {
  const ativo = sidebar.classList.contains('active');
  if (ativo) {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    btnMenuToggle.textContent = '☰';
  } else {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    btnMenuToggle.textContent = '✖';
  }
});

// Fechar menu clicando fora
sidebarOverlay.addEventListener('click', () => {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
  btnMenuToggle.textContent = '☰';
});

// Logout
btnSidebarLogout.addEventListener('click', () => {
  localStorage.removeItem('nomeUsuario');
  localStorage.removeItem('tokenJWT');
  window.location.href = 'login.html';
});

// Carregar nome do usuário
window.addEventListener('pageshow', () => {
  const nome = localStorage.getItem('nomeUsuario');
  if (!nome) window.location.href = 'login.html';
  else titulo.textContent = `Olá, ${nome}!`;
});

// Ações dos botões
document.getElementById('btn-cadastrar-usuario').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'cadastro.html';
});

document.getElementById('btn-criar-lista').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'criarLista.html';
});
