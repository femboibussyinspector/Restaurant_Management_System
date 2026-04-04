-- SmartDine RMS MySQL Schema
CREATE DATABASE IF NOT EXISTS smartdine_rms;
USE smartdine_rms;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(120) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  image VARCHAR(200),
  available BOOLEAN DEFAULT TRUE
);

-- Add other tables similarly...

-- Initial data
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@smartdine.com', '$2b$12$Kix9K', 'admin'); -- password: admin

