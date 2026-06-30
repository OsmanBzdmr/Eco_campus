const db = require('../config/db');

exports.toggleFavorite = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const { productId } = req.params;

    const product = (await db.query('SELECT id FROM products WHERE id = $1', [productId])).rows[0];
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });

    const inserted = (await db.query(
      `INSERT INTO favorites (user_id, product_id) VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING
       RETURNING id`,
      [user_id, productId]
    )).rows[0];

    if (inserted) {
      res.json({ favorited: true });
    } else {
      await db.query('DELETE FROM favorites WHERE user_id = $1 AND product_id = $2', [user_id, productId]);
      res.json({ favorited: false });
    }
  } catch (err) {
    next(err);
  }
};

exports.getMyFavorites = async (req, res, next) => {
  try {
    const user_id = req.user_id;

    const products = (await db.query(
      `SELECT p.*, u.username, c.name as category_name
       FROM favorites f
       JOIN products p ON p.id = f.product_id
       JOIN users u ON p.user_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [user_id]
    )).rows;

    res.json(products.map(p => ({ ...p, is_favorited: true })));
  } catch (err) {
    next(err);
  }
};
