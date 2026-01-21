-- 添加账号管理相关权限
-- 注意：请先查询账号管理菜单的ID，然后替换下面的 <账号管理菜单ID>

-- 查询账号管理菜单ID（执行后获取ID）
SELECT id FROM menu WHERE name = '账号管理';

-- 假设账号管理菜单ID为8，请根据实际查询结果替换
-- 添加新增账号权限
INSERT INTO permissions (name, action_id, menu_id, status)
VALUES ('新增账号', 'add_account', 8, 0);

-- 添加启用账号权限
INSERT INTO permissions (name, action_id, menu_id, status)
VALUES ('启用账号', 'enable_account', 8, 0);

-- 添加禁用账号权限
INSERT INTO permissions (name, action_id, menu_id, status)
VALUES ('禁用账号', 'disable_account', 8, 0);
