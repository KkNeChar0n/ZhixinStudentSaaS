-- 为分账明细表添加收款类型字段
-- 执行此脚本将在 separate_account 表中添加 payment_type 字段

-- 添加 payment_type 字段
ALTER TABLE `separate_account`
ADD COLUMN `payment_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '收款类型：0-常规收款，1-淘宝收款'
AFTER `payment_id`;

-- 添加索引以提升查询性能
ALTER TABLE `separate_account`
ADD KEY `idx_payment_type` (`payment_type`);

-- 验证字段添加成功
SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'separate_account'
  AND COLUMN_NAME = 'payment_type';
