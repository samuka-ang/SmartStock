const form = document.getElementById('form-cadastro');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const token = document.getElementById('token').value.trim();

  if (!nome || !email || !password || !token) {
    mensagem.textContent = 'Preencha todos os campos.';
    mensagem.style.color = 'red';
    return;
  }

  try {
    const resposta = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, password, token })
    });

    const data = await resposta.json();

    if (resposta.ok) {
      mensagem.textContent = data.message || 'Usuário cadastrado com sucesso!';
      mensagem.style.color = 'green';
      form.reset();
    } else {
      mensagem.textContent = data.message || 'Erro ao cadastrar usuário.';
      mensagem.style.color = 'red';
    }

  } catch (erro) {
    console.error('Erro ao cadastrar:', erro);
    mensagem.textContent = 'Erro de conexão com o servidor.';
    mensagem.style.color = 'red';
  }
});
