const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Kullanıcı adı, e-posta ve şifre zorunludur' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ message: 'Bu e-posta ile zaten bir hesap var' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(username, email, hashedPassword);
    const user = db.prepare('SELECT id, username, email FROM users WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-posta ve şifre zorunludur' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    const validPassword = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !validPassword) {
      return res.status(401).json({ message: 'E-posta veya şifre hatalı' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err);
  }
};
