const db = require('./mockDbSingleton');
const { createSchema, seedDemoData } = require('../../db/schema');

/**
 * Mock veritabanını temizler, şemayı yeniden kurar ve demo verileri
 * (3 kategori, test kullanıcısı, 3 ürün) ekler. Testlerde beforeEach
 * içinde çağrılarak her testin temiz/öngörülebilir bir durumdan
 * başlaması sağlanır.
 */
function resetAndSeed() {
  db.__reset();
  createSchema(db);
  return seedDemoData(db);
}

module.exports = { db, resetAndSeed };
