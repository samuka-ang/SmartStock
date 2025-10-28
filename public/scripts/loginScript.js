const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const mensagem = document.getElementById('mensagem');
const etapaEmail = document.getElementById('etapa-email');
const etapaSenha = document.getElementById('etapa-password');
const etapaToken = document.getElementById('etapa-token');
const tokenInputs = document.querySelectorAll('.token-input');
const btnUnico = document.getElementById('btn-unico');

let etapaAtual = 1;

function exibirMensagem(texto) {
    mensagem.textContent = texto;
}

// =====================
// ANIMAÇÕES
// =====================
function fadeOut(element, duration = 300) {
    return new Promise((resolve) => {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = 0;
        setTimeout(() => {
            element.classList.add('oculto');
            element.style.opacity = 1;
            resolve();
        }, duration);
    });
}

function fadeIn(element, duration = 300, delay = 200) {
    return new Promise((resolve) => {
        setTimeout(() => {
            element.classList.remove('oculto');
            element.style.opacity = 0;
            element.style.transition = `opacity ${duration}ms`;
            requestAnimationFrame(() => {
                element.style.opacity = 1;
            });
            setTimeout(() => resolve(), duration);
        }, delay);
    });
}

// =====================
// RESETAR AO VOLTAR
// =====================
window.addEventListener('pageshow', (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        localStorage.clear();
        emailInput.value = '';
        passwordInput.value = '';
        tokenInputs.forEach(input => input.value = '');
        etapaAtual = 1;
        etapaSenha.classList.add('oculto');
        etapaToken.classList.add('oculto');
        etapaEmail.classList.remove('oculto');
        emailInput.disabled = false;
        passwordInput.disabled = true;
        tokenInputs.forEach(input => input.disabled = true);
        btnUnico.disabled = false;
        btnUnico.textContent = 'ENTRAR';
        exibirMensagem('');
    }
});

// =====================
// CONFIGURAÇÃO TOKEN
// =====================
tokenInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        const value = e.target.value;
        if (!/^\d$/.test(value)) {
            e.target.value = '';
            return;
        }
        if (index < tokenInputs.length - 1) tokenInputs[index + 1].focus();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            tokenInputs[index - 1].focus();
        }
    });

    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/\D/g, '');
        if (paste.length === 6) {
            tokenInputs.forEach((tokenInput, i) => tokenInput.value = paste[i] || '');
            tokenInputs[tokenInputs.length - 1].focus();
        }
    });
});

// =====================
// ETAPA 1 - VALIDAR EMAIL
// =====================
async function validarEmail() {
    const email = emailInput.value.trim();
    exibirMensagem('');

    if (!email || !email.includes('@')) {
        exibirMensagem('Por favor, insira um e-mail válido');
        return;
    }

    btnUnico.disabled = true;
    btnUnico.textContent = 'Aguarde...';

    try {
        const response = await fetch('http://localhost:3000/validate-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            etapaAtual = 2;
            await fadeOut(etapaEmail);
            await fadeIn(etapaSenha);
            emailInput.disabled = true;
            passwordInput.disabled = false;
            passwordInput.focus();
        } else {
            exibirMensagem(data.message || 'E-mail não cadastrado ou inválido');
        }
    } catch (error) {
        exibirMensagem('Erro de conexão com o servidor ao validar e-mail');
        console.error(error);
    } finally {
        btnUnico.disabled = false;
        btnUnico.textContent = 'ENTRAR';
    }
}

// =====================
// ETAPA 2 - VALIDAR SENHA
// =====================
async function validarSenha() {
    const email = emailInput.value;
    const password = passwordInput.value.trim();
    exibirMensagem('');

    if (password.length < 6) {
        exibirMensagem('A senha deve ter pelo menos 6 caracteres');
        return;
    }

    btnUnico.disabled = true;
    btnUnico.textContent = 'Aguarde...';

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.requires2FA) {
            etapaAtual = 3;
            await fadeOut(etapaSenha);
            await fadeIn(etapaToken);
            tokenInputs.forEach(input => input.disabled = false);
            tokenInputs[0].focus();
        } else {
            exibirMensagem(data.message || 'E-mail ou senha incorretos');
        }
    } catch (error) {
        exibirMensagem('Erro de conexão com o servidor');
        console.error(error);
    } finally {
        btnUnico.disabled = false;
        btnUnico.textContent = 'ENTRAR';
    }
}

// =====================
// ETAPA 3 - VALIDAR TOKEN (DINÂMICO)
// =====================
async function validarToken() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const token = Array.from(tokenInputs).map(input => input.value).join('');

    exibirMensagem('');

    if (!/^\d{6}$/.test(token)) {
        exibirMensagem('O token deve ter 6 dígitos');
        return;
    }

    btnUnico.disabled = true;
    btnUnico.textContent = 'Verificando...';

    try {
        const response = await fetch('http://localhost:3000/login-with-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, token })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('nomeUsuario', data.nome);
            localStorage.setItem('tokenJWT', data.tokenJWT);
            localStorage.setItem('tabelasLiberadas', JSON.stringify(data.tabelasLiberadas || []));

            // 🔐 Redirecionamento seguro conforme backend
            window.location.href = data.dashboard || 'dashboard.html';
        } else {
            exibirMensagem(data.message || 'Token inválido.');
        }
    } catch (error) {
        exibirMensagem('Erro de conexão ao validar o token');
        console.error(error);
    } finally {
        btnUnico.disabled = false;
        btnUnico.textContent = 'ENTRAR';
    }
}

// =====================
// CONTROLE DO BOTÃO
// =====================
if (btnUnico) {
    btnUnico.addEventListener('click', async (e) => {
        e.preventDefault();
        switch (etapaAtual) {
            case 1:
                await validarEmail();
                break;
            case 2:
                await validarSenha();
                break;
            case 3:
                await validarToken();
                break;
            default:
                exibirMensagem('Erro de estado. Recarregue a página.');
        }
    });
}
