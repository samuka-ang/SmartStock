const bcrypt = require('bcrypt');
const loginSchema = require('../schemas/login');
const registerSchema = require('../schemas/register');
const pool = require('../server/db');

async function validateEmail(req, res) {
    try {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Formato de e-mail inválido' });
        }

        const [rows] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'E-mail não cadastrado' });
        }

        return res.status(200).json({ message: 'E-mail válido' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao validar e-mail no servidor' });
    }
}

async function login(req, res) {
    try {
        await loginSchema.validate(req.body); 
        const { email, password } = req.body;

        const [rows] = await pool.query('SELECT senha FROM users WHERE email = ?', [email]);
        
        let storedHash = null;
        if (rows.length > 0) {
            storedHash = rows[0].senha;
        } else {
            storedHash = '$2b$10$abcdefghijklmnopqrstuvwxyzaBcDeFgHiJkL012345'; 
        }

        const isMatch = await bcrypt.compare(password, storedHash);

        if (!isMatch || rows.length === 0) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos' });
        }

        return res.status(401).json({ requires2FA: true});

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        console.error(err);
        return res.status(500).json({ message: 'Ocorreu um erro no servidor, tente novamente' });
    }
}

async function loginWithToken(req, res) {
    try {
        const { email, password, token } = req.body;
        
        const [rows] = await pool.query('SELECT senha FROM users WHERE email = ?', [email]);
        if (rows.length === 0 || !await bcrypt.compare(password, rows[0].senha)) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        if (token === '112233') {
            const [userRows] = await pool.query('SELECT nome FROM users WHERE email = ?', [email]);
            const nomeUsuario = userRows[0]?.nome || 'Usuário';

            return res.status(200).json({
                nome: nomeUsuario
            });
        } else {
            return res.status(401).json({ message: 'Token de segurança inválido' });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Ocorreu um erro ao validar o token' });
    }
}

async function register(req, res) {
    try {
        await registerSchema.validate(req.body);

        const { nome, email, password, token } = req.body;

        const [rows] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: 'Usuário já cadastrado' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        await pool.query(
            'INSERT INTO users (nome, email, senha, token) VALUES (?, ?, ?, ?)',
            [nome, email, passwordHash, token]
        );

        return res.status(201).json({ message: 'Usuário cadastrado com sucesso' });

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        console.error(err);
        return res.status(500).json({ message: 'Ocorreu um erro no servidor, tente novamente' });
    }
}

module.exports = { login, register, loginWithToken, validateEmail };
