const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token gerekli' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token' });
  }
};
