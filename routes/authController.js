// controllers/authController.js
const crypto = require('crypto');
const loginSchema = require('../schemas/login');
const registerSchema = require('../schemas/register');
const pool = require('../server/db');

async function login(req, res) {
  try {
    await loginSchema.validate(req.body);
    const { email, password } = req.body;

    const [rows] = await pool.query('SELECT email, senha FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const user = rows[0];
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    if (passwordHash !== user.senha) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    return res.status(200).json({ message: 'Login bem-sucedido!' });

  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: 'Ocorreu um erro no servidor, tente novamente.' });
  }
}

async function register(req, res) {
  try {
    await registerSchema.validate(req.body);
    const { email, password } = req.body;

    const [rows] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ message: 'Usuário já cadastrado.' });
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    await pool.query('INSERT INTO users (email, senha) VALUES (?, ?)', [email, passwordHash]);

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });

  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: 'Ocorreu um erro no servidor, tente novamente.' });
  }
}

module.exports = { login, register};
