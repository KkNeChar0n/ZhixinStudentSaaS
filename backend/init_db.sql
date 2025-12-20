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

-- 创建性别常量表
CREATE TABLE IF NOT EXISTS sex (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sex VARCHAR(10) NOT NULL UNIQUE
);

-- 创建年级常量表
CREATE TABLE IF NOT EXISTS grade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    grade VARCHAR(20) NOT NULL UNIQUE
);

-- 创建学生表
CREATE TABLE IF NOT EXISTS student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    sex_id INT NOT NULL,
    grade_id INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    FOREIGN KEY (sex_id) REFERENCES sex(id),
    FOREIGN KEY (grade_id) REFERENCES grade(id)
);

-- 创建教练表
CREATE TABLE IF NOT EXISTS coach (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    sex_id INT NOT NULL,
    subject VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    FOREIGN KEY (sex_id) REFERENCES sex(id)
);

-- 创建学生和教练的多对多关联表
CREATE TABLE IF NOT EXISTS student_coach (
    student_id INT NOT NULL,
    coach_id INT NOT NULL,
    PRIMARY KEY (student_id, coach_id),
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES coach(id) ON DELETE CASCADE
);

-- 插入性别测试数据
INSERT INTO sex (sex) VALUES ('男'), ('女') ON DUPLICATE KEY UPDATE sex = VALUES(sex);

-- 插入年级测试数据
INSERT INTO grade (grade) VALUES ('一年级'), ('二年级'), ('三年级'), ('四年级'), ('五年级'), ('六年级') ON DUPLICATE KEY UPDATE grade = VALUES(grade);

-- 插入学生测试数据
INSERT INTO student (name, sex_id, grade_id, phone) VALUES
('张三', 1, 1, '13800138001'),
('李四', 1, 2, '13800138002'),
('王五', 2, 3, '13800138003'),
('赵六', 1, 4, '13800138004'),
('钱七', 2, 5, '13800138005') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 插入教练测试数据
INSERT INTO coach (name, sex_id, subject, phone) VALUES
('王老师', 1, '数学', '13900139001'),
('李老师', 2, '语文', '13900139002'),
('张老师', 1, '英语', '13900139003'),
('刘老师', 2, '科学', '13900139004') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 插入学生教练关联测试数据
INSERT INTO student_coach (student_id, coach_id) VALUES
(1, 1), (1, 2),
(2, 1), (2, 3),
(3, 2), (3, 4),
(4, 1), (4, 2), (4, 3),
(5, 3), (5, 4);
