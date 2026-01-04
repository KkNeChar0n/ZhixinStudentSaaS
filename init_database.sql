-- 完整的数据库初始化脚本
-- CharonSpace 学生管理系统

SET NAMES utf8mb4;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS zhixinstudentsaas DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE zhixinstudentsaas;

-- 1. 创建用户账号表
CREATE TABLE IF NOT EXISTS `useraccount` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '账号ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `password` VARCHAR(255) NOT NULL COMMENT '密码',
    `status` TINYINT NOT NULL DEFAULT 0 COMMENT '0:启用 1:禁用',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户账号表';

-- 插入默认管理员账号
INSERT INTO `useraccount` (`username`, `password`, `status`) VALUES ('eduzhixin', '123456', 0);

-- 2. 创建性别表
CREATE TABLE IF NOT EXISTS `sex` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '性别ID',
    `name` VARCHAR(10) NOT NULL COMMENT '性别名称',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='性别表';

INSERT INTO `sex` (`id`, `name`) VALUES (1, '男'), (2, '女');

-- 3. 创建年级表
CREATE TABLE IF NOT EXISTS `grade` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '年级ID',
    `name` VARCHAR(50) NOT NULL COMMENT '年级名称',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='年级表';

INSERT INTO `grade` (`id`, `name`) VALUES
(1, '一年级'), (2, '二年级'), (3, '三年级'),
(4, '四年级'), (5, '五年级'), (6, '六年级'),
(7, '初一'), (8, '初二'), (9, '初三'),
(10, '高一'), (11, '高二'), (12, '高三');

-- 4. 创建科目表
CREATE TABLE IF NOT EXISTS `subject` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '科目ID',
    `name` VARCHAR(50) NOT NULL COMMENT '科目名称',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='科目表';

INSERT INTO `subject` (`id`, `name`) VALUES
(1, '语文'), (2, '数学'), (3, '英语'),
(4, '物理'), (5, '化学'), (6, '生物'),
(7, '历史'), (8, '地理'), (9, '政治');

-- 5. 创建学生表
CREATE TABLE IF NOT EXISTS `student` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '学生ID',
    `name` VARCHAR(50) NOT NULL COMMENT '姓名',
    `sex_id` INT NOT NULL COMMENT '性别ID',
    `grade_id` INT NOT NULL COMMENT '年级ID',
    `subject_id` INT NOT NULL COMMENT '科目ID',
    `phone` VARCHAR(20) COMMENT '联系电话',
    `status` TINYINT NOT NULL DEFAULT 0 COMMENT '0:启用 1:禁用',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`sex_id`) REFERENCES `sex`(`id`),
    FOREIGN KEY (`grade_id`) REFERENCES `grade`(`id`),
    FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学生表';

-- 6. 创建教练表
CREATE TABLE IF NOT EXISTS `coach` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '教练ID',
    `name` VARCHAR(50) NOT NULL COMMENT '姓名',
    `sex_id` INT NOT NULL COMMENT '性别ID',
    `subject_id` INT NOT NULL COMMENT '科目ID',
    `phone` VARCHAR(20) COMMENT '联系电话',
    `status` TINYINT NOT NULL DEFAULT 0 COMMENT '0:启用 1:禁用',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`sex_id`) REFERENCES `sex`(`id`),
    FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='教练表';

-- 7. 创建学生-教练关联表
CREATE TABLE IF NOT EXISTS `student_coach` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `student_id` INT NOT NULL COMMENT '学生ID',
    `coach_id` INT NOT NULL COMMENT '教练ID',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`coach_id`) REFERENCES `coach`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_student_coach` (`student_id`, `coach_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学生教练关联表';

-- 8. 创建菜单表
CREATE TABLE IF NOT EXISTS `menu` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
    `name` VARCHAR(50) NOT NULL COMMENT '菜单名称',
    `parent_id` INT NULL DEFAULT NULL COMMENT '父级菜单ID，NULL表示一级菜单',
    `route` VARCHAR(50) NULL COMMENT '路由标识，用于前端页面切换',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序顺序',
    PRIMARY KEY (`id`),
    INDEX `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单表';

-- 插入菜单数据
INSERT INTO `menu` (`id`, `name`, `parent_id`, `route`, `sort_order`) VALUES
(1, '学生管理', NULL, NULL, 1),
(2, '教练管理', NULL, NULL, 2),
(3, '订单管理', NULL, NULL, 3),
(4, '系统设置', NULL, NULL, 4);

INSERT INTO `menu` (`name`, `parent_id`, `route`, `sort_order`) VALUES
('学生管理', 1, 'students', 1),
('教练管理', 2, 'coaches', 1),
('订单管理', 3, 'orders', 1),
('账号管理', 4, 'accounts', 1);

-- 9. 创建分类表
CREATE TABLE IF NOT EXISTS `classify` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
    `name` VARCHAR(100) NOT NULL COMMENT '分类名称',
    `parent_id` INT NULL DEFAULT NULL COMMENT '父级分类ID',
    `status` TINYINT NOT NULL DEFAULT 0 COMMENT '0:启用 1:禁用',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    INDEX `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- 10. 创建属性表
CREATE TABLE IF NOT EXISTS `attribute` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '属性ID',
    `name` VARCHAR(100) NOT NULL COMMENT '属性名称',
    `classify_id` INT NOT NULL COMMENT '所属分类ID',
    `status` TINYINT NOT NULL DEFAULT 0 COMMENT '0:启用 1:禁用',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`classify_id`) REFERENCES `classify`(`id`) ON DELETE CASCADE,
    INDEX `idx_classify_id` (`classify_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='属性表';

-- 显示创建结果
SELECT '=== 数据库初始化完成 ===' AS status;
SHOW TABLES;
