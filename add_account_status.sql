-- 数据库迁移脚本：为 useraccount 表添加 status 字段
-- 执行时间：2025-12-24
-- 用途：支持账号管理功能的启用/禁用状态

USE ZhixinStudentSaas;

-- 检查并添加 status 字段
-- 如果字段已存在则跳过
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ZhixinStudentSaas'
    AND TABLE_NAME = 'useraccount'
    AND COLUMN_NAME = 'status'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `useraccount` ADD COLUMN `status` TINYINT NOT NULL DEFAULT 0 COMMENT ''0:启用 1:禁用'' AFTER `password`',
    'SELECT ''Column status already exists in useraccount table'' AS message');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 插入测试账号（如果不存在）
INSERT INTO `useraccount` (`username`, `password`, `status`)
VALUES ('eduzhixin', '123456', 0)
ON DUPLICATE KEY UPDATE username=username;

-- 显示结果
SELECT '=== 迁移完成 ===' AS status;
SELECT '账号表结构:' AS info;
DESC useraccount;
SELECT '账号列表:' AS info;
SELECT username, password, status FROM useraccount;
