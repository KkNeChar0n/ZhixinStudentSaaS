-- 创建数据库
CREATE DATABASE IF NOT EXISTS testconnect251219 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE testconnect251219;

-- 创建表
CREATE TABLE IF NOT EXISTS testword (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- 插入初始数据
INSERT INTO testword (name) VALUES ('hallo world') ON DUPLICATE KEY UPDATE name = VALUES(name);
