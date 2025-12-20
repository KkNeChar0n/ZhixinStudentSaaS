-- 创建数据库
CREATE DATABASE IF NOT EXISTS testconnect251219 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE testconnect251219;

-- 创建用户表
CREATE TABLE IF NOT EXISTS useraccount (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);

-- 插入测试数据
INSERT INTO useraccount (username, password) VALUES ('testuser', 'testpassword') ON DUPLICATE KEY UPDATE password = VALUES(password);
