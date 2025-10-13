function fazerLogout() {
    localStorage.removeItem('nomeUsuario');
    window.location.href = 'login.html'; 
}

window.addEventListener('pageshow', function (event) {
    const nome = localStorage.getItem('nomeUsuario');
    const titulo = document.getElementById('titulo-usuario');
    
    if (!nome) {
        window.location.href = 'login.html'; 
        return; 
    }
    
    if (titulo) {
        titulo.textContent = `Olá, ${nome}!`;
    }
});


document.addEventListener('DOMContentLoaded', () => {
    
    const parceiroBoxes = document.querySelectorAll('.parceiro-box');
    
    const btnMenuLogout = document.getElementById('btn-menu-logout');
    if (btnMenuLogout) {
        btnMenuLogout.addEventListener('click', () => {
            alert('Atenção: O menu de configurações está em construção!');
        });
    }

    const nome = localStorage.getItem('nomeUsuario');
    const titulo = document.getElementById('titulo-usuario');
    if (nome && titulo) {
        titulo.textContent = `Olá, ${nome}!`;
    }

    parceiroBoxes.forEach(box => {
        box.addEventListener('click', (e) => {
            let parceiro;
            if (box.classList.contains('senai-bg')) {
                parceiro = 'SENAI';
            } else if (box.classList.contains('henkel-bg')) {
                parceiro = 'Henkel';
            } else if (box.classList.contains('dell-bg')) {
                parceiro = 'DELL';
            }

            if (parceiro) {
                alert(`Você clicou no parceiro: ${parceiro}`);
            }
        });
    });
});