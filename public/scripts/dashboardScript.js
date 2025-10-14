function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

function verificarAcesso() {
    const token = sessionStorage.getItem('tokenJWT');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

window.addEventListener('DOMContentLoaded', verificarAcesso);
window.addEventListener('pageshow', verificarAcesso);

const token = sessionStorage.getItem('tokenJWT');
fetch('http://localhost:3000/dashboard-data', {
    headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(data => {
    const titulo = document.getElementById('titulo-usuario');
    if (titulo) titulo.textContent = `Olá, ${data.message.replace('Bem-vindo ', '')}!`;
})
.catch(err => {
    console.error(err);
    logout();
});

const btnMenuLogout = document.getElementById('btn-menu-logout');
if (btnMenuLogout) btnMenuLogout.addEventListener('click', logout);

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
