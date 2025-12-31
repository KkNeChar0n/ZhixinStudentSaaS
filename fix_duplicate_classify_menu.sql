-- 清理重复的类型管理菜单项
SET NAMES utf8mb4;
USE zhixinstudentsaas;

-- 获取商品管理的ID
SET @product_menu_id = (SELECT id FROM menu WHERE name = '商品管理' AND parent_id IS NULL LIMIT 1);

-- 查看当前有多少个类型管理菜单
SELECT COUNT(*) INTO @classify_menu_count
FROM menu
WHERE name = '类型管理' AND parent_id = @product_menu_id;

-- 如果有多个，删除除了第一个之外的所有重复项
DELETE FROM menu
WHERE name = '类型管理'
  AND parent_id = @product_menu_id
  AND id NOT IN (
    SELECT * FROM (
      SELECT MIN(id) FROM menu
      WHERE name = '类型管理' AND parent_id = @product_menu_id
    ) AS temp
  );

-- 确保至少有一个类型管理菜单
INSERT IGNORE INTO menu (name, parent_id, route, sort_order)
SELECT '类型管理', @product_menu_id, 'classifies',
       IFNULL((SELECT MAX(sort_order) FROM menu WHERE parent_id = @product_menu_id), 0) + 1
WHERE NOT EXISTS (
  SELECT 1 FROM menu WHERE name = '类型管理' AND parent_id = @product_menu_id
);

-- 显示结果
SELECT '✅ 类型管理菜单清理完成' AS result;
SELECT * FROM menu WHERE parent_id = @product_menu_id ORDER BY sort_order;
