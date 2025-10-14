const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const btnMenuToggle = document.getElementById('btn-menu-toggle');
const btnCloseSidebar = document.getElementById('close-sidebar');
const btnSidebarLogout = document.getElementById('btn-sidebar-logout');

btnMenuToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
});

btnCloseSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

btnSidebarLogout.addEventListener('click', () => {
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('tokenJWT');
    window.location.href = 'login.html';
});

window.addEventListener('pageshow', function () {
    const nome = localStorage.getItem('nomeUsuario');
    const titulo = document.getElementById('titulo-usuario');

    if (!nome) {
        window.location.href = 'login.html';
        return;
    }

    if (titulo) titulo.textContent = `Olá, ${nome}!`;
});

document.addEventListener('DOMContentLoaded', () => {
    const parceiroBoxes = document.querySelectorAll('.parceiro-box');

    parceiroBoxes.forEach(box => {
        box.addEventListener('click', () => {
            let parceiro;
            if (box.classList.contains('senai-bg')) parceiro = 'SENAI';
            else if (box.classList.contains('henkel-bg')) parceiro = 'Henkel';
            else if (box.classList.contains('dell-bg')) parceiro = 'DELL';

            if (parceiro) alert(`Você clicou no parceiro: ${parceiro}`);
        });
    });
});
