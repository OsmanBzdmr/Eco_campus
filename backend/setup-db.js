const { Client } = require('pg');
require('dotenv').config();

const adminClient = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: 'postgres' // Admin database
});

const dbClient = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

async function setupDatabase() {
  try {
    console.log('🔧 Veritabanı kurulumu başlıyor...\n');

    // Admin bağlantısı aç
    await adminClient.connect();
    console.log('✓ PostgreSQL admin bağlantısı başarılı');

    // Mevcut veritabanını sil (isteğe bağlı)
    await adminClient.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    console.log(`✓ Eski ${process.env.DB_NAME} veritabanı silindi`);

    // Yeni veritabanı oluştur
    await adminClient.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`✓ ${process.env.DB_NAME} veritabanı oluşturuldu`);

    await adminClient.end();

    // Yeni veritabanına bağlan
    await dbClient.connect();
    console.log(`✓ ${process.env.DB_NAME} veritabanına bağlantı kuruldu\n`);

    // Tabloları oluştur
    console.log('📋 Tablolar oluşturuluyor...');

    await dbClient.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
    console.log('  ✓ users tablosu oluşturuldu');

    await dbClient.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        icon VARCHAR(50)
      )
    `);
    console.log('  ✓ categories tablosu oluşturuldu');

    await dbClient.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) DEFAULT 0,
        description TEXT,
        image_url TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id)
      )
    `);
    console.log('  ✓ products tablosu oluşturuldu\n');

    // Örnek veriler ekle
    console.log('📊 Örnek veriler ekleniyor...');

    await dbClient.query(`
      INSERT INTO categories (name, icon) VALUES 
      ('Ders Materyalleri', 'book'),
      ('Elektronik', 'laptop'),
      ('Eşya', 'home')
    `);
    console.log('  ✓ 3 kategori eklendi');

    // Test kullanıcısı ekle
    // Şifre: test123 (bcrypt hashed)
    await dbClient.query(`
      INSERT INTO users (username, email, password) VALUES 
      ('testuser', 'test@university.edu', '$2b$10$lU0uWjkpTh/G8eK2a4hWIutkncnrMfBbBLwblBXn8VebHWysi0aYu')
    `);
    console.log('  ✓ Test kullanıcı eklendi (email: test@university.edu, şifre: test123)');

    // Test ürünleri ekle
    await dbClient.query(`
      INSERT INTO products (title, price, description, image_url, user_id, category_id) VALUES 
      ('Kullanılmış Laptop', 500, 'Dell laptop, çalışıyor', 'https://via.placeholder.com/300', 1, 2),
      ('Bağış: Fizik Ders Notları', 0, 'Bedava dağıtılıyor', 'https://via.placeholder.com/300', 1, 1),
      ('USB Kablo', 25, 'Type-C kablo', 'https://via.placeholder.com/300', 1, 2)
    `);
    console.log('  ✓ 3 test ürünü eklendi\n');

    console.log('✅ Veritabanı kurulumu başarıyla tamamlandı!\n');
    console.log('📝 Test Bilgileri:');
    console.log('   Email: test@university.edu');
    console.log('   Şifre: test123\n');

    await dbClient.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

setupDatabase();
