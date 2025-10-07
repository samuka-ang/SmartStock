// server.js - CÓDIGO COMPLETO (ANTIGO serverVal.js)

const express = require('express');
const path = require('path');
const cors = require('cors'); 
const app = express();
const authRoutes = require('./routes/auth');

// Habilita o CORS para todas as requisições (crucial para o frontend)
app.use(cors()); 

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(authRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});