const db = require('../config/db');

exports.getProducts = (req, res, next) => {
  try {
    const { search, category_id, page, limit, sort, order } = req.query;

    let whereClauses = [];
    let params = [];

    if (search) {
      whereClauses.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category_id) {
      whereClauses.push('category_id = ?');
      params.push(category_id);
    }

    const whereSQL = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    // Sıralama: izin verilen kolonlar dışında varsayılan kullan (SQL injection önlemi)
    const allowedSortCols = ['id', 'title', 'price', 'created_at'];
    const sortCol = allowedSortCols.includes(sort) ? sort : 'id';
    const sortDir = order && order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const orderSQL = `ORDER BY ${sortCol} ${sortDir}`;

    // Sayfalama parametreleri varsa sayfalı, yoksa tümünü düz dizi olarak döndür
    if (page && limit) {
      const countRow = db.prepare(`SELECT COUNT(*) as cnt FROM products ${whereSQL}`).get(...params);
      const total = countRow.cnt;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const totalPages = Math.ceil(total / limitNum);
      const offset = (pageNum - 1) * limitNum;

      const products = db.prepare(`SELECT * FROM products ${whereSQL} ${orderSQL} LIMIT ? OFFSET ?`).all(...params, limitNum, offset);

      res.set({
        'X-Total-Count': total,
        'X-Page': pageNum,
        'X-Limit': limitNum,
        'X-Total-Pages': totalPages,
      });
      return res.json(products);
    }

    // Geriye dönük uyumluluk: parametre yoksa düz dizi
    const products = db.prepare(`SELECT * FROM products ${whereSQL} ${orderSQL}`).all(...params);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.createProduct = (req, res, next) => {
  try {
    const user_id = req.user_id;
    const { title, price, description, image_url, category_id } = req.body;

    const stmt = db.prepare(
      'INSERT INTO products (title, price, description, image_url, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const info = stmt.run(title, price, description, image_url, category_id || 1, user_id);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = (req, res, next) => {
  try {
    const user_id = req.user_id;
    const { id } = req.params;
    const { title, price, description, image_url, category_id } = req.body;

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    if (product.user_id !== user_id) return res.status(403).json({ message: 'Bu ürünü düzenleme yetkiniz yok' });

    const fields = [];
    const params = [];

    if (title !== undefined) { fields.push('title = ?'); params.push(title); }
    if (price !== undefined) { fields.push('price = ?'); params.push(price); }
    if (description !== undefined) { fields.push('description = ?'); params.push(description); }
    if (image_url !== undefined) { fields.push('image_url = ?'); params.push(image_url); }
    if (category_id !== undefined) { fields.push('category_id = ?'); params.push(category_id); }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Güncellenecek alan bulunamadı' });
    }

    params.push(id);
    db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`).run(...params);
    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json(updated);
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
