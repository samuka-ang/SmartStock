const express = require('express');
const bodyParser = require('body-parser');
const sha256 = require('sha256');
require('../dotenv').config();
const db = require('db'); // Importa o pool de conexões do db.js

const app = express();
const port = process.env.PORT || 1234;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', async (req, res) => {
    const { email, password, token } = req.body;

    // Verificação básica de input
    if (!email || !password || !token) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
    }

    try {
        // 2. Consulta o banco de dados usando Prepared Statement (evita SQL Injection)
        const [rows] = await db.execute('SELECT email, senha, token FROM login WHERE email = ?', [email]);
        
        // 3. Verifica se o usuário foi encontrado
        if (rows.length === 0) {
            // É uma boa prática de segurança retornar uma mensagem genérica para não indicar qual dado está incorreto (email ou senha)
            return res.status(401).json({ success: false, message: 'Email ou senha inválidos.' });
        }

        const user = rows[0];

        // 4. Compara a senha do input com o hash armazenado (ASSUMINDO que você está hasheando a senha durante o registro)
        // Se você não está hasheando a senha, o código abaixo deve ser ajustado, mas o hash é altamente recomendado.
        const passwordMatch = await bcrypt.compare(password, user.senha);

        // 5. Verifica a senha e o token
        if (passwordMatch && user.token === token) {
            // Login bem-sucedido
            return res.status(200).json({ success: true, message: 'Login realizado com sucesso!' });
        } else {
            // Senha ou token inválido
            return res.status(401).json({ success: false, message: 'Email ou senha inválidos.' });
        }

    } catch (error) {
        console.error('Erro no processo de login:', error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Exemplo de rota de teste (opcional)
app.get('/', (req, res) => {
    res.send('Servidor rodando. Use o formulário de login!');
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});