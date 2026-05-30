const pool = require('../config/db');
const jwt = require('jsonwebtoken');

exports.getProducts = async (req, res) => {
  try {
    const allProducts = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(allProducts.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.createProduct = async (req, res) => {
  try {
    // user_id'yi token'dan al (frontend'den gelmesine gerek yok)
    const token = req.headers.authorization;
    if (!token) return res.status(401).json('Token gerekli');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizlisifre');
    const user_id = decoded.id;

    const { title, price, description, image_url, category_id } = req.body;

    if (!title || price === undefined || price === '') {
      return res.status(400).json('Başlık ve fiyat zorunludur');
    }

    const newProduct = await pool.query(
      'INSERT INTO products (title, price, description, image_url, category_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, price, description, image_url, category_id || 1, user_id]
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json('Token gerekli');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizlisifre');
    const user_id = decoded.id;

    const { id } = req.params;

    // Sadece kendi ürününü silebilir
    const product = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (product.rows.length === 0) return res.status(404).json('Ürün bulunamadı');
    if (product.rows[0].user_id !== user_id) return res.status(403).json('Bu ürünü silme yetkiniz yok');

    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Ürün silindi' });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
