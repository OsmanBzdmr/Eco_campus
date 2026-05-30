-- Veritabanı oluştur (varsa silinir)
DROP DATABASE IF EXISTS ecocampus_db;
CREATE DATABASE ecocampus_db;

-- Bağlantıyı değiştir
\c ecocampus_db

-- Tabloları oluştur
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    image_url TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id)
);

-- Örnek veriler ekle
INSERT INTO categories (name, icon) VALUES 
('Ders Materyalleri', 'book'),
('Elektronik', 'laptop'),
('Eşya', 'home');

-- Test kullanıcısı ekle (şifre: test123)
INSERT INTO users (username, email, password) VALUES 
('testuser', 'test@example.com', '$2b$10$YOvVUlh9d.M1t2ZXPzz7luDtXtjlKvUVTvlnvVKLH5SU5OJjhFmFe');

-- Test ürünü ekle
INSERT INTO products (title, price, description, image_url, user_id, category_id) VALUES 
('Örnek Laptop', 500, 'Çalışan bir laptop', 'https://via.placeholder.com/300', 1, 2),
('Bağış: Kullanılmış Kitap', 0, 'Bedava dağıtılıyor', 'https://via.placeholder.com/300', 1, 1);
