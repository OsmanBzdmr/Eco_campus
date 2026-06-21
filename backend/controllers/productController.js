const db = require('../config/db');

exports.getProducts = (req, res, next) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.createProduct = (req, res, next) => {
  try {
    const user_id = req.user_id;
    const { title, price, description, image_url, category_id } = req.body;

    if (!title || price === undefined || price === '') {
      return res.status(400).json({ message: 'Başlık ve fiyat zorunludur' });
    }

    const stmt = db.prepare(
      'INSERT INTO products (title, price, description, image_url, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const info = stmt.run(title, price, description, image_url, category_id || 1, user_id);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = (req, res, next) => {
  try {
    const user_id = req.user_id;
    const { id } = req.params;

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    if (product.user_id !== user_id) return res.status(403).json({ message: 'Bu ürünü silme yetkiniz yok' });

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ message: 'Ürün silindi' });
  } catch (err) {
    next(err);
  }
};
