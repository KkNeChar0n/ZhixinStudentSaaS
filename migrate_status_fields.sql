-- 数据库迁移脚本：修改status字段类型和添加新status字段
-- 执行时间：2025-12-26
-- 用途：
--   1. 将student和coach表的status字段从VARCHAR改为TINYINT（0=启用，1=禁用）
--   2. 为grade和subject表添加status字段（0=启用，1=禁用）

USE ZhixinStudentSaas;

-- ============================================
-- 1. 修改student表的status字段
-- ============================================
-- 检查student表是否有status字段
SET @student_status_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ZhixinStudentSaas'
    AND TABLE_NAME = 'student'
    AND COLUMN_NAME = 'status'
);

-- 如果status字段存在，删除并重新创建为TINYINT类型
SET @sql_student = IF(@student_status_exists > 0,
    'ALTER TABLE `student` DROP COLUMN `status`',
    'SELECT ''student表的status字段不存在，跳过删除'' AS message'
);

PREPARE stmt FROM @sql_student;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 添加新的status字段（TINYINT类型）
ALTER TABLE `student`
ADD COLUMN `status` TINYINT NOT NULL DEFAULT 0
COMMENT '0:启用 1:禁用';

-- ============================================
-- 2. 修改coach表的status字段
-- ============================================
-- 检查coach表是否有status字段
SET @coach_status_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ZhixinStudentSaas'
    AND TABLE_NAME = 'coach'
    AND COLUMN_NAME = 'status'
);

-- 如果status字段存在，删除并重新创建为TINYINT类型
SET @sql_coach = IF(@coach_status_exists > 0,
    'ALTER TABLE `coach` DROP COLUMN `status`',
    'SELECT ''coach表的status字段不存在，跳过删除'' AS message'
);

PREPARE stmt FROM @sql_coach;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 添加新的status字段（TINYINT类型）
ALTER TABLE `coach`
ADD COLUMN `status` TINYINT NOT NULL DEFAULT 0
COMMENT '0:启用 1:禁用';

-- ============================================
-- 3. 为grade表添加status字段
-- ============================================
-- 检查grade表是否已有status字段
SET @grade_status_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ZhixinStudentSaas'
    AND TABLE_NAME = 'grade'
    AND COLUMN_NAME = 'status'
);

-- 如果字段不存在则添加
SET @sql_grade = IF(@grade_status_exists = 0,
    'ALTER TABLE `grade` ADD COLUMN `status` TINYINT NOT NULL DEFAULT 0 COMMENT ''0:启用 1:禁用''',
    'SELECT ''grade表的status字段已存在'' AS message'
);

PREPARE stmt FROM @sql_grade;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 4. 为subject表添加status字段
-- ============================================
-- 检查subject表是否已有status字段
SET @subject_status_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'ZhixinStudentSaas'
    AND TABLE_NAME = 'subject'
    AND COLUMN_NAME = 'status'
);

-- 如果字段不存在则添加
SET @sql_subject = IF(@subject_status_exists = 0,
    'ALTER TABLE `subject` ADD COLUMN `status` TINYINT NOT NULL DEFAULT 0 COMMENT ''0:启用 1:禁用''',
    'SELECT ''subject表的status字段已存在'' AS message'
);

PREPARE stmt FROM @sql_subject;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 显示迁移结果
-- ============================================
SELECT '=== 数据库迁移完成 ===' AS status;

SELECT '学生表结构:' AS info;
DESC student;

SELECT '教练表结构:' AS info;
DESC coach;

SELECT '年级表结构:' AS info;
DESC grade;

SELECT '学科表结构:' AS info;
DESC subject;

-- 显示数据统计
SELECT '数据统计:' AS info;
SELECT
    (SELECT COUNT(*) FROM student) AS '学生总数',
    (SELECT COUNT(*) FROM student WHERE status = 0) AS '启用学生数',
    (SELECT COUNT(*) FROM coach) AS '教练总数',
    (SELECT COUNT(*) FROM coach WHERE status = 0) AS '启用教练数',
    (SELECT COUNT(*) FROM grade) AS '年级总数',
    (SELECT COUNT(*) FROM grade WHERE status = 0) AS '启用年级数',
    (SELECT COUNT(*) FROM subject) AS '学科总数',
    (SELECT COUNT(*) FROM subject WHERE status = 0) AS '启用学科数';
