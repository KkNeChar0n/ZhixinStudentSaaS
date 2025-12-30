-- 添加商品管理菜单
SET NAMES utf8mb4;
USE zhixinstudentsaas;

-- 插入一级菜单：商品管理（如果不存在）
INSERT INTO `menu` (`name`, `parent_id`, `route`, `sort_order`)
SELECT '商品管理', NULL, NULL, 10
WHERE NOT EXISTS (SELECT 1 FROM `menu` WHERE `name` = '商品管理' AND `parent_id` IS NULL);

-- 获取商品管理菜单ID并插入二级菜单：属性管理
INSERT INTO `menu` (`name`, `parent_id`, `route`, `sort_order`)
SELECT '属性管理', m.id, 'attributes', 1
FROM `menu` m
WHERE m.`name` = '商品管理' AND m.`parent_id` IS NULL
AND NOT EXISTS (SELECT 1 FROM `menu` WHERE `name` = '属性管理' AND `route` = 'attributes');
