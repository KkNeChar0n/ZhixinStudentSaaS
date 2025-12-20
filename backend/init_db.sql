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

-- 创建性别表
CREATE TABLE IF NOT EXISTS sex (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sex VARCHAR(10) NOT NULL UNIQUE
);

-- 插入性别数据
INSERT INTO sex (sex) VALUES ('男') ON DUPLICATE KEY UPDATE sex = VALUES(sex);
INSERT INTO sex (sex) VALUES ('女') ON DUPLICATE KEY UPDATE sex = VALUES(sex);

-- 创建年级表
CREATE TABLE IF NOT EXISTS grade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grade VARCHAR(20) NOT NULL UNIQUE
);

-- 插入年级数据
INSERT INTO grade (grade) VALUES ('初一') ON DUPLICATE KEY UPDATE grade = VALUES(grade);
INSERT INTO grade (grade) VALUES ('初二') ON DUPLICATE KEY UPDATE grade = VALUES(grade);
INSERT INTO grade (grade) VALUES ('初三') ON DUPLICATE KEY UPDATE grade = VALUES(grade);

-- 创建学生表
CREATE TABLE IF NOT EXISTS student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    sex VARCHAR(10) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    grade VARCHAR(20) NOT NULL
);

-- 插入测试学生数据
INSERT INTO student (name, sex, phone, grade) VALUES 
('张三', '男', '13800138000', '初一'),
('李四', '女', '13800138001', '初二'),
('王五', '男', '13800138002', '初三'),
('赵六', '女', '13800138003', '初一') ON DUPLICATE KEY UPDATE 
name = VALUES(name), sex = VALUES(sex), phone = VALUES(phone), grade = VALUES(grade);
