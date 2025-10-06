const express = require('express');
const path = require('path');
const app = express();
const authRoutes = require('./routes/auth');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve arquivos estáticos

app.use(authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
