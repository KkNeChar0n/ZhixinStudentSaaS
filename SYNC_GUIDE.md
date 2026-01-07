# 数据库同步指南

## 概述
本文档说明如何将本地开发环境的数据库结构同步到正式生产环境。

## 新增表说明

本次同步将在正式环境中创建以下4个新表：

| 表名 | 说明 | 用途 |
|------|------|------|
| `brand` | 品牌表 | 存储商品品牌信息 |
| `goods` | 商品表 | 存储商品基本信息 |
| `goods_attributevalue` | 商品-属性值关系表 | 关联商品与属性值（多对多） |
| `goods_goods` | 商品组合关系表 | 关联组合商品与子商品 |

## 同步前准备

### 1. 备份正式环境数据库

**重要提示：在执行同步前，务必先备份正式环境数据库！**

```bash
# 方法1：使用mysqldump备份整个数据库
mysqldump -h [正式环境IP] -u [用户名] -p zhixinstudentsaas > backup_before_sync_$(date +%Y%m%d_%H%M%S).sql

# 方法2：如果只想备份现有表（不包含新表）
mysqldump -h [正式环境IP] -u [用户名] -p zhixinstudentsaas \
  attribute attribute_value classify coach grade menu orders \
  sex student student_coach subject useraccount \
  > backup_existing_tables_$(date +%Y%m%d_%H%M%S).sql
```

### 2. 验证备份文件

```bash
# 检查备份文件是否存在且大小合理
ls -lh backup_*.sql
```

## 同步步骤

### 方法1：使用命令行执行（推荐）

#### Windows系统

```cmd
# 1. 打开命令提示符（CMD）

# 2. 进入项目目录
cd d:\claude space\ZhixinStudentSaaS

# 3. 执行同步脚本
mysql -h [正式环境IP] -u [用户名] -p zhixinstudentsaas < sync_to_production.sql

# 示例（假设正式环境在本机）：
mysql -h localhost -u root -p zhixinstudentsaas < sync_to_production.sql
```

#### Linux/Mac系统

```bash
# 1. 进入项目目录
cd /path/to/ZhixinStudentSaaS

# 2. 执行同步脚本
mysql -h [正式环境IP] -u [用户名] -p zhixinstudentsaas < sync_to_production.sql
```

### 方法2：使用MySQL客户端工具

#### 使用Navicat / MySQL Workbench / phpMyAdmin

1. 连接到正式环境数据库
2. 选择 `zhixinstudentsaas` 数据库
3. 打开SQL执行窗口
4. 复制 `sync_to_production.sql` 文件的全部内容
5. 粘贴并执行

#### 使用命令行客户端

```bash
# 1. 登录MySQL
mysql -h [正式环境IP] -u [用户名] -p

# 2. 选择数据库
USE zhixinstudentsaas;

# 3. 执行脚本
SOURCE d:/claude space/ZhixinStudentSaaS/sync_to_production.sql;
# 或（Linux/Mac）
SOURCE /path/to/ZhixinStudentSaaS/sync_to_production.sql;
```

## 同步验证

同步完成后，执行以下SQL验证新表是否创建成功：

```sql
-- 1. 查看所有表
SHOW TABLES;

-- 2. 查看新表结构
DESC brand;
DESC goods;
DESC goods_attributevalue;
DESC goods_goods;

-- 3. 验证 attribute 表是否有 classify 字段
DESC attribute;

-- 4. 查看表记录数
SELECT 'brand' AS table_name, COUNT(*) AS row_count FROM brand
UNION ALL
SELECT 'goods', COUNT(*) FROM goods
UNION ALL
SELECT 'goods_attributevalue', COUNT(*) FROM goods_attributevalue
UNION ALL
SELECT 'goods_goods', COUNT(*) FROM goods_goods;
```

## 同步后配置

### 1. 更新后端配置

确保正式环境的后端应用配置文件（`backend/app.py`）中的数据库连接信息正确：

```python
def get_db_connection():
    return pymysql.connect(
        host='[正式环境数据库IP]',
        user='[数据库用户名]',
        password='[数据库密码]',
        database='zhixinstudentsaas',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
```

### 2. 重启后端服务

```bash
# Windows
# 停止现有Python进程
taskkill /F /IM python.exe

# 启动新的后端服务
cd d:\claude space\ZhixinStudentSaaS\backend
python app.py

# Linux/Mac
# 停止现有服务（假设使用systemd）
sudo systemctl stop zhixin-backend

# 启动服务
sudo systemctl start zhixin-backend
```

### 3. 重启Nginx（如果使用）

```bash
# Windows
nginx -s reload

# Linux/Mac
sudo systemctl reload nginx
# 或
sudo nginx -s reload
```

## 故障排除

### 问题1：表已存在错误

如果看到类似 "Table 'brand' already exists" 的错误：

```sql
-- 检查现有表
SHOW TABLES LIKE 'brand';

-- 如果确定要重新创建，先删除（谨慎！）
DROP TABLE IF EXISTS brand;
-- 然后重新执行同步脚本
```

### 问题2：字符集问题

如果出现中文乱码：

```sql
-- 检查数据库字符集
SHOW CREATE DATABASE zhixinstudentsaas;

-- 如果需要，修改数据库字符集
ALTER DATABASE zhixinstudentsaas CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

### 问题3：权限不足

如果提示权限错误：

```sql
-- 使用root或有足够权限的用户登录
-- 授予用户所需权限
GRANT CREATE, ALTER, INSERT, UPDATE, DELETE, SELECT ON zhixinstudentsaas.* TO '用户名'@'主机';
FLUSH PRIVILEGES;
```

## 回滚方案

如果同步后发现问题，需要回滚：

### 完全回滚（删除新表）

```sql
-- 按照依赖顺序删除表
DROP TABLE IF EXISTS goods_attributevalue;
DROP TABLE IF EXISTS goods_goods;
DROP TABLE IF EXISTS goods;
DROP TABLE IF EXISTS brand;

-- 如果添加了 classify 字段到 attribute 表
ALTER TABLE attribute DROP COLUMN IF EXISTS classify;
```

### 恢复备份

```bash
# 使用备份文件恢复
mysql -h [正式环境IP] -u [用户名] -p zhixinstudentsaas < backup_before_sync_YYYYMMDD_HHMMSS.sql
```

## 数据迁移（可选）

如果需要将本地开发环境的测试数据也同步到正式环境：

```bash
# 1. 导出本地数据
mysqldump -h localhost -u root -pqweasd123Q! zhixinstudentsaas \
  brand goods goods_attributevalue goods_goods \
  --no-create-info --skip-add-drop-table \
  > data_export.sql

# 2. 导入到正式环境
mysql -h [正式环境IP] -u [用户名] -p zhixinstudentsaas < data_export.sql
```

## 联系支持

如有问题，请联系技术支持团队。

---

**最后更新：** 2026-01-06
**版本：** 1.0
