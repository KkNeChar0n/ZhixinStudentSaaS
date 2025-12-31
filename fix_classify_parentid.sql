-- 修复classify表字段名：parent_id -> parentid
SET NAMES utf8mb4;
USE zhixinstudentsaas;

-- 检查parent_id字段是否存在
SELECT COUNT(*) INTO @column_exists
FROM information_schema.columns
WHERE table_schema = 'zhixinstudentsaas'
  AND table_name = 'classify'
  AND column_name = 'parent_id';

-- 如果parent_id字段存在，则进行修改
SET @sql = IF(@column_exists > 0,
    'ALTER TABLE `classify` CHANGE COLUMN `parent_id` `parentid` INT DEFAULT NULL COMMENT ''父级ID，NULL表示一级类型''',
    'SELECT ''Field parent_id does not exist, skipping'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 删除旧索引（如果存在）
SELECT COUNT(*) INTO @index_exists
FROM information_schema.statistics
WHERE table_schema = 'zhixinstudentsaas'
  AND table_name = 'classify'
  AND index_name = 'idx_parent_id';

SET @sql = IF(@index_exists > 0,
    'ALTER TABLE `classify` DROP INDEX `idx_parent_id`',
    'SELECT ''Index idx_parent_id does not exist, skipping'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 添加新索引（如果不存在）
SELECT COUNT(*) INTO @new_index_exists
FROM information_schema.statistics
WHERE table_schema = 'zhixinstudentsaas'
  AND table_name = 'classify'
  AND index_name = 'idx_parentid';

SET @sql = IF(@new_index_exists = 0,
    'ALTER TABLE `classify` ADD INDEX `idx_parentid` (`parentid`)',
    'SELECT ''Index idx_parentid already exists, skipping'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT '✅ classify表字段修复完成' AS result;
