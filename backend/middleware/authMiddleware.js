const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token gerekli' });
  }

  // Hem Web (ham token) hem Mobil (Bearer <token>) isteklerini destekler
  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // authController içindeki { id: user.id } eşleşmesi için:
    req.user_id = decoded.id; 
    
    if (!req.user_id) {
      return res.status(401).json({ message: 'Token geçersiz veri içeriyor' });
    }

    next();
  } catch (error) {
    console.error("JWT Doğrulama Hatası:", error.message);
    return res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token' });
  }
};