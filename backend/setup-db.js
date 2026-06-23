const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(process.env.DB_PATH || './ecocampus.db');
console.log('Veritabanı yolu:', dbPath);

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const { createSchema, seedDemoData } = require('./db/schema');

function setupDatabase() {
  try {
    console.log('\nVeritabanı kurulumu başlıyor...\n');

    console.log('Tablolar oluşturuluyor...');
    createSchema(db);
    console.log('  OK users tablosu oluşturuldu');
    console.log('  OK categories tablosu oluşturuldu');
    console.log('  OK products tablosu oluşturuldu\n');

    console.log('Örnek veriler ekleniyor...');
    seedDemoData(db);
    console.log('  OK 3 kategori eklendi');
    console.log('  OK Test kullanıcı eklendi (email: test@university.edu, sifre: test123)');
    console.log('  OK 3 test ürünü eklendi\n');

    console.log('Veritabanı kurulumu başarıyla tamamlandı!\n');
    console.log('Test Bilgileri:');
    console.log('   Email: test@university.edu');
    console.log('   Sifre: test123\n');

    db.close();
  } catch (error) {
    console.error('Hata:', error.message);
    process.exit(1);
  }
}

setupDatabase();
