const db = require('../config/db');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = (await db.query('SELECT * FROM categories ORDER BY id')).rows;
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
