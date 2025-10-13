document.addEventListener('DOMContentLoaded', () => {
    const nome = localStorage.getItem('nomeUsuario');
    const titulo = document.getElementById('titulo-usuario');

    if (nome) {
        titulo.textContent = `Olá, ${nome}!`;
    } else {
        titulo.textContent = 'Olá!';
    }
});
