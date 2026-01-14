-- 添加分账明细菜单到财务管理下
-- 执行此脚本将在财务管理菜单下添加"分账明细"二级菜单

-- 查找财务管理的菜单ID并插入分账明细菜单
INSERT INTO `menu` (`name`, `parent_id`, `route`, `sort_order`)
SELECT '分账明细', id, 'separate_account', 2
FROM menu
WHERE name = '财务管理' AND parent_id IS NULL
LIMIT 1;

-- 验证插入结果
SELECT
    m1.id AS '一级菜单ID',
    m1.name AS '一级菜单',
    m2.id AS '二级菜单ID',
    m2.name AS '二级菜单',
    m2.route AS '路由',
    m2.sort_order AS '排序'
FROM menu m1
LEFT JOIN menu m2 ON m1.id = m2.parent_id
WHERE m1.name = '财务管理'
ORDER BY m2.sort_order;
