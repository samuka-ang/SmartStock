const mysql = require('mysql2/promise'); // Usamos a versão com promises
require('../dotenv').config(); // Carrega as variáveis de ambiente

// Cria o pool de conexões com o banco de dados
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10, // Limite de conexões no pool
    queueLimit: 0
});

module.exports = pool;