-- 在商品管理下添加类型管理菜单
SET NAMES utf8mb4;
USE zhixinstudentsaas;

-- 获取商品管理的ID并添加类型管理子菜单
-- 假设商品管理菜单已存在，获取其ID
SET @product_menu_id = (SELECT id FROM menu WHERE name = '商品管理' AND parent_id IS NULL LIMIT 1);

-- 获取当前商品管理下最大的排序值
SET @max_sort = (SELECT IFNULL(MAX(sort_order), 0) FROM menu WHERE parent_id = @product_menu_id);

-- 添加类型管理菜单
INSERT INTO `menu` (`name`, `parent_id`, `route`, `sort_order`)
VALUES ('类型管理', @product_menu_id, 'classifies', @max_sort + 1);

-- 查看添加结果
SELECT * FROM menu WHERE parent_id = @product_menu_id ORDER BY sort_order;
