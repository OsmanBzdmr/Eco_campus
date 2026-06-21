/**
 * `config/db.js`'in yerini alan test-zamanı singleton'ı.
 * jest.config.js'teki moduleNameMapper, ".../config/db" ile biten her
 * require çağrısını bu dosyaya yönlendirir, böylece uygulama kodu
 * (controllers, db/schema.js) hiç değiştirilmeden gerçek better-sqlite3
 * yerine bu mock'u kullanır.
 */
const { createMockDb } = require('./mockDb');

module.exports = createMockDb();
