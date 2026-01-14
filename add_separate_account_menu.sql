-- 添加分账明细菜单项到财务管理下
-- 首先查找财务管理（收款管理）的父菜单ID
-- 假设财务管理是一个父菜单，需要先找到它的ID

-- 方式1：如果财务管理是一个独立的父菜单
-- 找到财务管理的ID并插入分账明细
INSERT INTO menu (name, parent_id, route, sort_order)
SELECT '分账明细', id, 'separate_account', 140
FROM menu
WHERE name = '财务管理' AND parent_id IS NULL
LIMIT 1;

-- 方式2：如果没有财务管理父菜单，收款管理是直接的二级菜单
-- 可以将分账明细添加为与收款管理平级的菜单
-- 首先获取收款管理的parent_id
INSERT INTO menu (name, parent_id, route, sort_order)
SELECT '分账明细', parent_id, 'separate_account',
       (SELECT MAX(sort_order) + 10 FROM menu WHERE parent_id = (SELECT parent_id FROM menu WHERE route = 'payment_collection' LIMIT 1))
FROM menu
WHERE route = 'payment_collection'
LIMIT 1;
