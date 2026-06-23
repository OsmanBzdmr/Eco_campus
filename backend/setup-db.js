const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ecocampus',
});

const { createSchema, seedDemoData } = require('./db/schema');

async function setupDatabase() {
  try {
    console.log('\nVeritabanı kurulumu başlıyor...\n');

    console.log('Tablolar oluşturuluyor...');
    await createSchema(db);
    console.log('  OK users tablosu oluşturuldu');
    console.log('  OK categories tablosu oluşturuldu');
    console.log('  OK products tablosu oluşturuldu\n');

    console.log('Örnek veriler ekleniyor...');
    await seedDemoData(db);
    console.log('  OK 3 kategori eklendi');
    console.log('  OK Test kullanıcı eklendi (email: test@university.edu, sifre: test123)');
    console.log('  OK 3 test ürünü eklendi\n');

    console.log('Veritabanı kurulumu başarıyla tamamlandı!\n');
    console.log('Test Bilgileri:');
    console.log('   Email: test@university.edu');
    console.log('   Sifre: test123\n');

    await db.end();
  } catch (error) {
    console.error('Hata:', error.message);
    process.exit(1);
  }
}

setupDatabase();
