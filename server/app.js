const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Configurações do app
app.use(bodyParser.json());

// Banco de dados
const db = new sqlite3.Database('./db/users.db');

// Criação da tabela de usuários (apenas se ela não existir)
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, role TEXT)');
});

// Função para gerar token JWT
function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });
}

// Rota de Cadastro (somente admin pode cadastrar)
app.post('/admin/register', (req, res) => {
  const { email, password, role } = req.body;
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Apenas administradores podem cadastrar usuários.' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao criptografar a senha' });
    }

    const stmt = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
    stmt.run(email, hashedPassword, 'user', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao cadastrar o usuário' });
      }
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    });
  });
});

// Rota de Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err || !row) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    bcrypt.compare(password, row.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos' });
      }

      const token = generateToken(row);
      res.json({ message: 'Login bem-sucedido', token });
    });
  });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
