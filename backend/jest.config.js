/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./tests/helpers/testEnv.js'],
  // "../config/db", "../../config/db" gibi tüm yollar bu dosya ile
  // değiştirilir; uygulama kodu hiç değişmeden mock veritabanını kullanır.
  moduleNameMapper: {
    '(.*)config/db$': '<rootDir>/tests/helpers/mockDbSingleton.js',
  },
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
};
