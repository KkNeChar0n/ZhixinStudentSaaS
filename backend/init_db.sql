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

-- 创建教练表
CREATE TABLE IF NOT EXISTS coach (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    sex VARCHAR(10) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

-- 插入测试教练数据
INSERT INTO coach (name, sex, phone) VALUES 
('王教练', '男', '13900139000'),
('李教练', '女', '13900139001'),
('张教练', '男', '13900139002') ON DUPLICATE KEY UPDATE 
name = VALUES(name), sex = VALUES(sex), phone = VALUES(phone);

-- 创建学生与教练的多对多关联表
CREATE TABLE IF NOT EXISTS student_coach (
    student_id INT NOT NULL,
    coach_id INT NOT NULL,
    PRIMARY KEY (student_id, coach_id),
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES coach(id) ON DELETE CASCADE
);

-- 插入学生与教练的关联数据
INSERT INTO student_coach (student_id, coach_id) VALUES 
(1, 1),  -- 张三 - 王教练
(1, 2),  -- 张三 - 李教练
(2, 1),  -- 李四 - 王教练
(3, 3),  -- 王五 - 张教练
(4, 2),  -- 赵六 - 李教练
(4, 3);  -- 赵六 - 张教练

