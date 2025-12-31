-- 修复classify表字段名：parent_id -> parentid
SET NAMES utf8mb4;
USE zhixinstudentsaas;

-- 检查表是否存在
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables
                     WHERE table_schema = 'zhixinstudentsaas'
                     AND table_name = 'classify');

-- 如果表存在，进行字段重命名
SET @sql = IF(@table_exists > 0,
    'ALTER TABLE `classify`
     DROP FOREIGN KEY IF EXISTS `classify_ibfk_1`,
     DROP INDEX IF EXISTS `idx_parent_id`,
     CHANGE COLUMN `parent_id` `parentid` INT DEFAULT NULL COMMENT ''父级ID，NULL表示一级类型'',
     ADD INDEX `idx_parentid` (`parentid`),
     ADD CONSTRAINT `classify_ibfk_1` FOREIGN KEY (`parentid`) REFERENCES `classify`(`id`) ON DELETE SET NULL',
    'SELECT ''Table classify does not exist'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 显示修改结果
SHOW CREATE TABLE `classify`;
