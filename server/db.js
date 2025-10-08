const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '172.17.0.1',
  port: 3307,
  user: 'root',
  password: 'admin',
  database: 'usuario',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;

//beekeeper, mcp postgres