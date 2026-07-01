const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
require('dotenv').config({ path: path.join(__dirname, '.env') });

if (!process.env.JWT_SECRET) {
  console.error('HATA: JWT_SECRET ortam değişkeni tanımlı değil. .env dosyanızı kontrol edin (.env.example üzerinden oluşturabilirsiniz).');
  process.exit(1);
}
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Güvenlik header'ları (X-Frame-Options, X-Content-Type-Options, CSP vb.)
app.use(helmet());

// CORS yalnızca bilinen istemcilere (web paneli, mobil dev sunucusu) açılır.
// CORS_ORIGIN ortam değişkeni virgülle ayrılmış birden fazla origin alabilir.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // origin olmadan gelen istekler (Postman, mobil uygulama, curl) kabul edilir
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS politikası tarafından engellendi'));
  },
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Tüm API için genel rate limiter; auth uçları kendi içinde daha sıkı bir
// limit olan authLimiter'ı ayrıca kullanır (bkz. authRoutes.js).
app.use(generalLimiter);

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/favorites', favoriteRoutes);

// 404 - tanımsız route'lar için
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint bulunamadı' });
});

// Merkezi hata yönetimi middleware'i (her zaman son middleware olmalı)
app.use((err, req, res, _next) => {
  console.error('Hata yakalandı:', err);

  let statusCode = err.status || err.statusCode || 500;

  // Multer hata kodları
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        statusCode = 413;
        err.message = 'Dosya boyutu çok büyük (maksimum 5MB)';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        statusCode = 400;
        err.message = 'Beklenmeyen dosya alanı: ' + err.field;
        break;
      case 'LIMIT_PART_COUNT':
        statusCode = 400;
        err.message = 'Çok fazla form alanı';
        break;
      default:
        statusCode = 400;
        break;
    }
  }
  if (err.message && err.message.includes('Yalnızca resim dosyaları')) statusCode = 415;

  const isDev = process.env.NODE_ENV !== 'production';
  res.status(statusCode).json({
    message: isDev ? err.message : 'Sunucuda bir hata oluştu',
  });
});

const PORT = process.env.PORT || 5000;

// app.listen yalnızca bu dosya doğrudan çalıştırıldığında tetiklenir
// (`node server.js`). Testlerde `require('./server')` ile app import
// edilirken gerçek bir port dinlenmesini önler; supertest app'i
// doğrudan kullanır.
if (require.main === module) {
  app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));
}

module.exports = app;
