-- ============================================
-- 淘宝收款模块数据库更新脚本
-- 更新日期: 2026-01-13
-- 说明: 用于创建和更新taobao_payment表结构
-- ============================================

-- 检查表是否存在，如果不存在则创建
CREATE TABLE IF NOT EXISTS `taobao_payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_id` int(11) DEFAULT NULL COMMENT '订单ID',
  `student_id` int(11) DEFAULT NULL COMMENT '学生ID',
  `payer` varchar(100) DEFAULT NULL COMMENT '付款方',
  `zhifubao_account` varchar(100) DEFAULT NULL COMMENT '支付宝账号',
  `payment_amount` decimal(10,2) NOT NULL COMMENT '金额（已收款时为交易金额，待认领时为到账金额）',
  `order_time` datetime DEFAULT NULL COMMENT '下单时间（已收款使用）',
  `arrival_time` datetime DEFAULT NULL COMMENT '到账时间（待认领使用）',
  `merchant_order` varchar(100) DEFAULT NULL COMMENT '商户订单号',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态：0-已下单，10-待认领，20-已认领，30-已到账，40-已退单',
  `claimer` int(11) DEFAULT NULL COMMENT '认领人ID',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_merchant_order` (`merchant_order`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='淘宝收款表';

-- 如果表已存在，确保所有字段都已正确添加
-- 以下语句会在字段不存在时添加，如果已存在会报错但不影响后续执行

-- 添加 zhifubao_account 字段（如果不存在）
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'taobao_payment'
    AND COLUMN_NAME = 'zhifubao_account'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `taobao_payment` ADD COLUMN `zhifubao_account` varchar(100) DEFAULT NULL COMMENT ''支付宝账号'' AFTER `payer`',
    'SELECT ''Column zhifubao_account already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 添加 arrival_time 字段（如果不存在）
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'taobao_payment'
    AND COLUMN_NAME = 'arrival_time'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `taobao_payment` ADD COLUMN `arrival_time` datetime DEFAULT NULL COMMENT ''到账时间（待认领使用）'' AFTER `order_time`',
    'SELECT ''Column arrival_time already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 添加 claimer 字段（如果不存在）
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'taobao_payment'
    AND COLUMN_NAME = 'claimer'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `taobao_payment` ADD COLUMN `claimer` int(11) DEFAULT NULL COMMENT ''认领人ID'' AFTER `status`',
    'SELECT ''Column claimer already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 确保索引存在
-- 检查并创建 idx_order_id 索引
SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'taobao_payment'
    AND INDEX_NAME = 'idx_order_id'
);

SET @sql = IF(@index_exists = 0,
    'ALTER TABLE `taobao_payment` ADD KEY `idx_order_id` (`order_id`)',
    'SELECT ''Index idx_order_id already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 检查并创建 idx_student_id 索引
SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'taobao_payment'
    AND INDEX_NAME = 'idx_student_id'
);

SET @sql = IF(@index_exists = 0,
    'ALTER TABLE `taobao_payment` ADD KEY `idx_student_id` (`student_id`)',
    'SELECT ''Index idx_student_id already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 检查并创建 idx_merchant_order 索引
SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'taobao_payment'
    AND INDEX_NAME = 'idx_merchant_order'
);

SET @sql = IF(@index_exists = 0,
    'ALTER TABLE `taobao_payment` ADD KEY `idx_merchant_order` (`merchant_order`)',
    'SELECT ''Index idx_merchant_order already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 检查并创建 idx_status 索引
SET @index_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'taobao_payment'
    AND INDEX_NAME = 'idx_status'
);

SET @sql = IF(@index_exists = 0,
    'ALTER TABLE `taobao_payment` ADD KEY `idx_status` (`status`)',
    'SELECT ''Index idx_status already exists'' AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 完成提示
SELECT '淘宝收款表结构更新完成！' AS message;
