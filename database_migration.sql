-- 数据库迁移脚本
-- 用于更新服务器上的数据库结构以支持新增教练和学生功能
-- 执行前请备份数据库！

USE ZhixinStudentSaas;

-- =============================================
-- 1. 创建学科常量表
-- =============================================
CREATE TABLE IF NOT EXISTS `subject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subject` (`subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入学科数据
INSERT INTO `subject` (`subject`) VALUES
('语文'),
('数学'),
('英语'),
('物理'),
('化学'),
('生物'),
('历史'),
('地理'),
('政治'),
('科学')
ON DUPLICATE KEY UPDATE subject=VALUES(subject);

-- =============================================
-- 2. 给student表添加status字段
-- =============================================
-- 检查字段是否存在,如果不存在则添加
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ZhixinStudentSaas'
    AND TABLE_NAME = 'student'
    AND COLUMN_NAME = 'status'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `student` ADD COLUMN `status` varchar(10) NOT NULL DEFAULT ''启用''',
    'SELECT ''Column status already exists in student table''');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =============================================
-- 3. 修改coach表结构
-- =============================================

-- 3.1 添加status字段
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ZhixinStudentSaas'
    AND TABLE_NAME = 'coach'
    AND COLUMN_NAME = 'status'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `coach` ADD COLUMN `status` varchar(10) NOT NULL DEFAULT ''启用''',
    'SELECT ''Column status already exists in coach table''');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3.2 修改subject字段为subject_id外键
-- 检查subject_id字段是否存在
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ZhixinStudentSaas'
    AND TABLE_NAME = 'coach'
    AND COLUMN_NAME = 'subject_id'
);

-- 如果subject_id不存在,则需要进行迁移
-- 注意：这个迁移会根据现有的subject文本值匹配到subject表的ID
SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `coach` ADD COLUMN `subject_id` int NULL AFTER `sex_id`',
    'SELECT ''Column subject_id already exists in coach table''');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 如果有旧的subject字段,将数据迁移到subject_id
SET @old_column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ZhixinStudentSaas'
    AND TABLE_NAME = 'coach'
    AND COLUMN_NAME = 'subject'
    AND DATA_TYPE = 'varchar'
);

-- 迁移数据：将subject文本映射到subject_id
UPDATE `coach` c
INNER JOIN `subject` s ON c.subject = s.subject
SET c.subject_id = s.id
WHERE @old_column_exists = 1 AND c.subject_id IS NULL;

-- 删除旧的subject字段（如果存在）
SET @sql = IF(@old_column_exists = 1,
    'ALTER TABLE `coach` DROP COLUMN `subject`',
    'SELECT ''Old subject column does not exist''');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 设置subject_id为NOT NULL
ALTER TABLE `coach` MODIFY COLUMN `subject_id` int NOT NULL;

-- 添加外键约束（如果不存在）
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = 'ZhixinStudentSaas'
    AND TABLE_NAME = 'coach'
    AND CONSTRAINT_NAME = 'coach_ibfk_2'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE `coach` ADD CONSTRAINT `coach_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`)',
    'SELECT ''Foreign key coach_ibfk_2 already exists''');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =============================================
-- 4. 验证迁移结果
-- =============================================
SELECT '=== 迁移完成 ===' AS status;
SELECT 'subject表记录数:' AS info, COUNT(*) AS count FROM subject;
SELECT 'student表包含status字段' AS info FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'ZhixinStudentSaas' AND TABLE_NAME = 'student' AND COLUMN_NAME = 'status';
SELECT 'coach表包含status字段' AS info FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'ZhixinStudentSaas' AND TABLE_NAME = 'coach' AND COLUMN_NAME = 'status';
SELECT 'coach表包含subject_id字段' AS info FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'ZhixinStudentSaas' AND TABLE_NAME = 'coach' AND COLUMN_NAME = 'subject_id';
