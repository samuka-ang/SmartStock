const bcrypt = require('bcrypt');
const loginSchema = require('../schemas/login');
const registerSchema = require('../schemas/register');
const pool = require('../server/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '30m';

async function validateEmail(req, res) {
    try {
        const { email } = req.body;
        if (!email || !email.includes('@')) return res.status(400).json({ message: 'Formato de e-mail inválido' });

        const [rows] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(404).json({ message: 'E-mail não cadastrado' });

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
        if (rows.length === 0) return res.status(401).json({ message: 'E-mail ou senha incorretos' });

        const isMatch = await bcrypt.compare(password, rows[0].senha);
        if (!isMatch) return res.status(401).json({ message: 'E-mail ou senha incorretos' });

        return res.status(200).json({ requires2FA: true });
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
        console.error(err);
        return res.status(500).json({ message: 'Ocorreu um erro no servidor' });
    }
}

async function loginWithToken(req, res) {
    try {
        const { email, password, token } = req.body;

        const [rows] = await pool.query('SELECT nome, senha, token FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ message: 'Credenciais inválidas' });

        const user = rows[0];
        const senhaCorreta = await bcrypt.compare(password, user.senha);
        if (!senhaCorreta) return res.status(401).json({ message: 'Credenciais inválidas' });

        if (token !== String(user.token).trim()) return res.status(401).json({ message: 'Token inválido' });

        const payload = { id: email, nome: user.nome };
        const tokenJWT = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        return res.status(200).json({ nome: user.nome, tokenJWT });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao validar token' });
    }
}

async function register(req, res) {
    try {
        await registerSchema.validate(req.body);
        const { nome, email, password, token } = req.body;

        const [rows] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
        if (rows.length > 0) return res.status(409).json({ message: 'Usuário já cadastrado' });

        const passwordHash = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (nome, email, senha, token) VALUES (?, ?, ?, ?)', [nome, email, passwordHash, token]);

        return res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
        console.error(err);
        return res.status(500).json({ message: 'Ocorreu um erro no servidor' });
    }
}

module.exports = { login, register, loginWithToken, validateEmail };
