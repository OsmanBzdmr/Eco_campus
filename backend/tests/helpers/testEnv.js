// Jest `setupFiles` listesinde çalışır; her test dosyasındaki tüm
// import/require işlemlerinden ÖNCE tetiklenir. server.js, JWT_SECRET
// tanımlı değilse process.exit(1) çağırdığından bu değişken burada
// (gerçek .env dosyasına ihtiyaç duymadan) tanımlanır.
process.env.JWT_SECRET = 'test_jwt_secret_do_not_use_in_production';
process.env.NODE_ENV = 'test';
process.env.CORS_ORIGIN = 'http://localhost:5173';
