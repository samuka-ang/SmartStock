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

// Criação dinâmica de boxes com imagens ou nome da tabela
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

        // Overlay do nome da tabela
        const overlay = document.createElement('div');
        overlay.classList.add('parceiro-overlay');
        overlay.textContent = nome;
        overlay.style.display = 'flex'; // Exibe por padrão, será escondido se imagem existir

        const img = document.createElement('img');
        img.classList.add('parceiro-logo');

        // Nome da tabela → nome do arquivo de imagem (minusculo e sem espaços)
        const nomeImagem = nome.toLowerCase().replace(/\s+/g, '');
        img.src = `./imagesDash/${nomeImagem}.png`;
        img.alt = nome;

        // Se a imagem carregar, esconde o overlay (nome)
        img.onload = () => {
            overlay.style.display = 'none';
        };

        // Se não carregar (imagem não existe), overlay continua visível
        img.onerror = () => {
            img.remove(); // Remove a tag img quebrada
            overlay.style.display = 'flex';
        };

        box.appendChild(img);
        box.appendChild(overlay);

        box.addEventListener('click', () => alert(`Você clicou na empresa: ${nome}`));

        container.appendChild(box);
    });
});
