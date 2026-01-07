# 菜单数据插入指南

## 菜单结构说明

本系统的菜单采用两级结构：

```
商品管理 (一级菜单, ID: 15)
├── 品牌管理 (二级菜单, ID: 16, route: brands)
├── 属性管理 (二级菜单, ID: 17, route: attributes)
├── 类型管理 (二级菜单, ID: 18, route: classifies)
└── 商品管理 (二级菜单, ID: 19, route: goods)
```

## 方法1：单独执行菜单插入（推荐）

如果你只需要插入菜单数据，使用这个独立脚本：

```bash
# Windows
cd "d:\claude space\ZhixinStudentSaaS"
mysql -h [正式环境IP] -u [用户名] -p zhixinstudentsaas < insert_menu_data.sql

# Linux/Mac
cd /path/to/ZhixinStudentSaaS
mysql -h [正式环境IP] -u [用户名] -p zhixinstudentsaas < insert_menu_data.sql
```

## 方法2：完整同步（包含菜单）

如果你要同步整个数据库结构和菜单，使用完整的同步脚本：

```bash
# Windows
cd "d:\claude space\ZhixinStudentSaaS"
mysql -h [正式环境IP] -u [用户名] -p zhixinstudentsaas < sync_to_production.sql

# Linux/Mac
cd /path/to/ZhixinStudentSaaS
mysql -h [正式环境IP] -u [用户名] -p zhixinstudentsaas < sync_to_production.sql
```

这个脚本会：
1. 创建4个新表（brand, goods, goods_attributevalue, goods_goods）
2. 更新attribute表（添加classify字段）
3. **插入菜单数据**
4. 插入示例品牌数据

## 方法3：手动执行SQL

### 使用MySQL命令行

```sql
-- 1. 登录数据库
mysql -h [正式环境IP] -u [用户名] -p zhixinstudentsaas

-- 2. 设置字符集
SET NAMES utf8mb4;

-- 3. 插入一级菜单：商品管理
INSERT IGNORE INTO `menu` (`id`, `name`, `parent_id`, `route`, `sort_order`) VALUES
(15, '商品管理', NULL, NULL, 4);

-- 4. 插入二级菜单
INSERT IGNORE INTO `menu` (`id`, `name`, `parent_id`, `route`, `sort_order`) VALUES
(16, '品牌管理', 15, 'brands', 1),
(17, '属性管理', 15, 'attributes', 2),
(18, '类型管理', 15, 'classifies', 3),
(19, '商品管理', 15, 'goods', 4);

-- 5. 验证插入结果
SELECT * FROM menu WHERE id >= 15 ORDER BY id;
```

### 使用Navicat/MySQL Workbench

1. 连接到正式环境数据库
2. 选择 `zhixinstudentsaas` 数据库
3. 打开SQL编辑器
4. 复制以下SQL并执行：

```sql
SET NAMES utf8mb4;

-- 插入一级菜单：商品管理
INSERT IGNORE INTO `menu` (`id`, `name`, `parent_id`, `route`, `sort_order`) VALUES
(15, '商品管理', NULL, NULL, 4);

-- 插入二级菜单
INSERT IGNORE INTO `menu` (`id`, `name`, `parent_id`, `route`, `sort_order`) VALUES
(16, '品牌管理', 15, 'brands', 1),
(17, '属性管理', 15, 'attributes', 2),
(18, '类型管理', 15, 'classifies', 3),
(19, '商品管理', 15, 'goods', 4);
```

## 验证菜单是否插入成功

### 查看所有菜单

```sql
SELECT
    m1.id AS '一级菜单ID',
    m1.name AS '一级菜单',
    m1.sort_order AS '排序',
    m2.id AS '二级菜单ID',
    m2.name AS '二级菜单',
    m2.route AS '路由',
    m2.sort_order AS '子排序'
FROM menu m1
LEFT JOIN menu m2 ON m1.id = m2.parent_id
WHERE m1.parent_id IS NULL
ORDER BY m1.sort_order, m2.sort_order;
```

### 只查看商品管理菜单

```sql
SELECT
    m1.id AS '一级菜单ID',
    m1.name AS '一级菜单',
    m2.id AS '二级菜单ID',
    m2.name AS '二级菜单',
    m2.route AS '路由'
FROM menu m1
LEFT JOIN menu m2 ON m1.id = m2.parent_id
WHERE m1.id = 15;
```

期望输出：
```
一级菜单ID | 一级菜单   | 二级菜单ID | 二级菜单   | 路由
----------|-----------|-----------|-----------|------------
15        | 商品管理   | 16        | 品牌管理   | brands
15        | 商品管理   | 17        | 属性管理   | attributes
15        | 商品管理   | 18        | 类型管理   | classifies
15        | 商品管理   | 19        | 商品管理   | goods
```

## 前端验证

菜单插入成功后，刷新前端页面，应该能看到：

1. **左侧菜单栏**出现"商品管理"一级菜单
2. 点击展开后显示4个子菜单：
   - 品牌管理
   - 属性管理
   - 类型管理
   - 商品管理

## 故障排除

### 问题1：菜单显示为乱码

**原因：** 字符集不匹配

**解决方案：**

```sql
-- 检查表字符集
SHOW CREATE TABLE menu;

-- 如果需要，转换字符集
ALTER TABLE menu CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- 重新插入菜单数据（先删除旧数据）
DELETE FROM menu WHERE id >= 15;
-- 然后重新执行插入脚本
```

### 问题2：菜单不显示

**可能原因：**
1. 前端缓存问题
2. 用户权限问题
3. 菜单数据未插入

**解决方案：**

```sql
-- 1. 检查菜单是否存在
SELECT COUNT(*) FROM menu WHERE id >= 15;
-- 应该返回 5（1个一级菜单 + 4个二级菜单）

-- 2. 检查数据内容
SELECT * FROM menu WHERE id >= 15 ORDER BY id;

-- 3. 清除浏览器缓存或强制刷新（Ctrl+F5）

-- 4. 检查前端控制台是否有错误
```

### 问题3：菜单ID冲突

**错误信息：** Duplicate entry '15' for key 'PRIMARY'

**解决方案：**

```sql
-- 方法1：使用不同的ID
-- 查看当前最大ID
SELECT MAX(id) FROM menu;

-- 使用新ID插入（假设最大ID是20）
INSERT INTO `menu` (`id`, `name`, `parent_id`, `route`, `sort_order`) VALUES
(21, '商品管理', NULL, NULL, 4);

INSERT INTO `menu` (`id`, `name`, `parent_id`, `route`, `sort_order`) VALUES
(22, '品牌管理', 21, 'brands', 1),
(23, '属性管理', 21, 'attributes', 2),
(24, '类型管理', 21, 'classifies', 3),
(25, '商品管理', 21, 'goods', 4);

-- 方法2：删除冲突数据后重新插入
DELETE FROM menu WHERE id >= 15;
-- 然后重新执行插入脚本
```

## 完整的菜单数据参考

如果需要完整的系统菜单结构，这是建议的配置：

```sql
-- 一级菜单
INSERT IGNORE INTO `menu` (`id`, `name`, `parent_id`, `route`, `sort_order`) VALUES
(1, '学生管理', NULL, NULL, 1),
(2, '教练管理', NULL, NULL, 2),
(3, '订单管理', NULL, NULL, 3),
(15, '商品管理', NULL, NULL, 4),
(4, '系统设置', NULL, NULL, 5);

-- 二级菜单
INSERT IGNORE INTO `menu` (`id`, `name`, `parent_id`, `route`, `sort_order`) VALUES
(5, '学生管理', 1, 'students', 1),
(6, '教练管理', 2, 'coaches', 1),
(7, '订单管理', 3, 'orders', 1),
(16, '品牌管理', 15, 'brands', 1),
(17, '属性管理', 15, 'attributes', 2),
(18, '类型管理', 15, 'classifies', 3),
(19, '商品管理', 15, 'goods', 4),
(8, '账号管理', 4, 'accounts', 1);
```

---

**最后更新：** 2026-01-06
**相关文件：**
- `insert_menu_data.sql` - 独立的菜单插入脚本
- `sync_to_production.sql` - 完整的数据库同步脚本（包含菜单）
