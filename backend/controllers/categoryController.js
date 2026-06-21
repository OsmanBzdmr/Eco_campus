const db = require('../config/db');

exports.getCategories = (req, res, next) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
