const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const btnMenuToggle = document.getElementById('btn-menu-toggle');
const btnSidebarLogout = document.getElementById('btn-sidebar-logout');
const titulo = document.getElementById('titulo-usuario');

// Toggle do menu
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

// Fechar clicando no overlay
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

// Criação dinâmica de boxes
window.addEventListener('DOMContentLoaded', () => {
    const tabelasLiberadas = JSON.parse(localStorage.getItem('tabelasLiberadas') || '[]');
    const container = document.getElementById('parceiros-container');

    if (!container) return;
    if (tabelasLiberadas.length === 0) {
        container.innerHTML = '<p>Nenhuma empresa liberada para este token.</p>';
        return;
    }

    tabelasLiberadas.forEach(nome => {
        const box = document.createElement('div');
        box.classList.add('parceiro-box');

        const overlay = document.createElement('div');
        overlay.classList.add('parceiro-overlay');
        overlay.textContent = nome;

        const img = document.createElement('img');
        img.classList.add('parceiro-logo');
        img.src = `./imagesDash/${nome.toLowerCase().replace(/\s+/g, '')}.png`;
        img.alt = nome;

        img.onload = () => overlay.style.display = 'none';
        img.onerror = () => img.remove();

        box.appendChild(img);
        box.appendChild(overlay);

        box.addEventListener('click', () => alert(`Você clicou na empresa: ${nome}`));

        container.appendChild(box);
    });
});
