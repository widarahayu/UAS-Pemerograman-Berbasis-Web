const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!req.user) {
            return res.status(401).json({ message: 'Invalid token. User not found.' });
        }

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

module.exports = {
    authenticateToken,
    authorizeAdmin,
};
