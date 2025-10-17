const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers['x-auth-token'];
    if (!authHeader) return res.status(401).json({ message: 'No token' });

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = auth;
