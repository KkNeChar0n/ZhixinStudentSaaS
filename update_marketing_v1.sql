-- =====================================================
-- 营销管理模块数据库更新脚本
-- 版本: v1.0
-- 日期: 2026-01-08
-- 说明: 新增活动模板和活动管理功能
-- =====================================================

-- 设置字符集
SET NAMES utf8mb4;

-- =====================================================
-- 第一部分：创建新表
-- =====================================================

-- 1. 创建活动模板表
CREATE TABLE IF NOT EXISTS activity_template (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '模板ID',
    name VARCHAR(100) NOT NULL COMMENT '模板名称',
    type INT NOT NULL COMMENT '类型：2满折 4换购',
    select_type INT NOT NULL COMMENT '选择方式：1按类型 2按商品',
    status INT DEFAULT 0 COMMENT '状态：0启用 1禁用',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动模板表';

-- 2. 创建活动模板商品关联表
CREATE TABLE IF NOT EXISTS activity_template_goods (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    template_id INT NOT NULL COMMENT '模板ID',
    goods_id INT COMMENT '商品ID（select_type=2时使用）',
    classify_id INT COMMENT '类型ID（select_type=1时使用）',
    FOREIGN KEY (template_id) REFERENCES activity_template(id) ON DELETE CASCADE,
    FOREIGN KEY (goods_id) REFERENCES goods(id) ON DELETE CASCADE,
    FOREIGN KEY (classify_id) REFERENCES classify(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动模板商品关联表';

-- 3. 创建活动表
CREATE TABLE IF NOT EXISTS activity (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '活动ID',
    name VARCHAR(100) NOT NULL COMMENT '活动名称',
    template_id INT NOT NULL COMMENT '关联模板ID',
    start_time DATETIME NOT NULL COMMENT '开始时间',
    end_time DATETIME NOT NULL COMMENT '结束时间',
    status INT DEFAULT 1 COMMENT '状态：0启用 1禁用（默认禁用）',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (template_id) REFERENCES activity_template(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动表';

-- 4. 创建活动明细表（满折规则）
CREATE TABLE IF NOT EXISTS activity_detail (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
    activity_id INT NOT NULL COMMENT '活动ID',
    threshold_amount DECIMAL(10,2) NOT NULL COMMENT '数量（购买数量达到XX）',
    discount_value DECIMAL(10,2) NOT NULL COMMENT '折扣值（打几折）',
    FOREIGN KEY (activity_id) REFERENCES activity(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动明细表（满折规则）';

-- =====================================================
-- 第二部分：新增菜单数据
-- =====================================================

-- 1. 新增营销管理一级菜单
INSERT INTO menu (name, parent_id, route, sort_order)
SELECT '营销管理', NULL, NULL, 4
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE name = '营销管理');

-- 2. 新增活动模板二级菜单
INSERT INTO menu (name, parent_id, route, sort_order)
SELECT '活动模板', id, 'activity_template', 1
FROM menu
WHERE name = '营销管理'
AND NOT EXISTS (SELECT 1 FROM menu WHERE route = 'activity_template');

-- 3. 新增活动管理二级菜单
INSERT INTO menu (name, parent_id, route, sort_order)
SELECT '活动管理', id, 'activity_management', 2
FROM menu
WHERE name = '营销管理'
AND NOT EXISTS (SELECT 1 FROM menu WHERE route = 'activity_management');

-- =====================================================
-- 执行完成提示
-- =====================================================
SELECT '营销管理模块数据库更新完成!' AS result;
