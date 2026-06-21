const express = require('express');
const cors = require('cors');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('HATA: JWT_SECRET ortam değişkeni tanımlı değil. .env dosyanızı kontrol edin (.env.example üzerinden oluşturabilirsiniz).');
  process.exit(1);
}

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);

// 404 - tanımsız route'lar için
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint bulunamadı' });
});

// Merkezi hata yönetimi middleware'i (her zaman son middleware olmalı)
app.use((err, req, res, next) => {
  console.error('Hata yakalandı:', err);

  const isDev = process.env.NODE_ENV !== 'production';
  res.status(err.status || 500).json({
    message: isDev ? err.message : 'Sunucuda bir hata oluştu',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));
