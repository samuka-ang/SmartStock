const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sua_chave_secreta_aqui';

function verificarJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Não autorizado' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: 'Token expirado ou inválido' });
    }
}

module.exports = verificarJWT;
