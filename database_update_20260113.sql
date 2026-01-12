-- 数据库更新脚本 - 2026年1月13日
-- 说明：收款管理模块和订单状态优化

-- ========================================
-- 1. 创建收款管理表
-- ========================================
CREATE TABLE IF NOT EXISTS `payment_collection` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '收款ID',
  `order_id` INT NOT NULL COMMENT '关联订单ID',
  `student_id` INT NOT NULL COMMENT '学生ID（UID）',
  `payment_scenario` TINYINT NOT NULL DEFAULT 1 COMMENT '付款场景：0-线上，1-线下',
  `payment_method` TINYINT NOT NULL DEFAULT 0 COMMENT '付款方式：0-微信，1-支付宝，2-优利支付，3-零零购支付，9-对公转账',
  `payment_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '付款金额',
  `payer` VARCHAR(100) DEFAULT NULL COMMENT '付款方',
  `payee_entity` TINYINT NOT NULL DEFAULT 0 COMMENT '收款主体：0-北京，1-西安',
  `trading_hours` DATETIME DEFAULT NULL COMMENT '交易时间',
  `arrival_time` DATETIME DEFAULT NULL COMMENT '到账时间',
  `status` TINYINT NOT NULL DEFAULT 10 COMMENT '状态：0-待支付，10-未核验，20-已支付',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_student_id` (`student_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_payment_scenario` (`payment_scenario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收款信息表';

-- ========================================
-- 2. 添加菜单
-- ========================================

-- 检查财务管理菜单是否已存在
SET @finance_menu_exists = (SELECT COUNT(*) FROM menu WHERE name = '财务管理' AND parent_id IS NULL);

-- 如果不存在则插入一级菜单
INSERT INTO menu (name, parent_id, route, sort_order)
SELECT '财务管理', NULL, NULL, 8
WHERE @finance_menu_exists = 0;

-- 获取财务管理菜单ID
SET @finance_menu_id = (SELECT id FROM menu WHERE name = '财务管理' AND parent_id IS NULL LIMIT 1);

-- 检查收款管理菜单是否已存在
SET @payment_menu_exists = (SELECT COUNT(*) FROM menu WHERE name = '收款管理' AND parent_id = @finance_menu_id);

-- 如果不存在则插入二级菜单
INSERT INTO menu (name, parent_id, route, sort_order)
SELECT '收款管理', @finance_menu_id, 'payment_collection', 1
WHERE @payment_menu_exists = 0;

-- ========================================
-- 3. 订单状态说明（无需执行SQL）
-- ========================================
-- 订单状态字段含义已更新：
--   10 = 草稿
--   20 = 未支付（原"审核中"）
--   30 = 部分支付（原"已通过"）
--   40 = 已支付（原"已驳回"）
--   99 = 已作废
--
-- 注意：现有订单数据无需手动更新，系统会根据收款情况自动调整订单状态

-- ========================================
-- 执行完成提示
-- ========================================
SELECT '数据库更新完成！' AS message;
