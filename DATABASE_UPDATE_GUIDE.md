# 数据库更新指南 - 待认领收款功能

**更新日期**: 2026-01-12
**功能**: 添加待认领收款管理功能

## 更新内容

本次更新添加了 `unclaimed` 表，用于记录待认领的收款信息。

### 新增表结构

- **表名**: `unclaimed`
- **字段**:
  - `id`: 自增主键
  - `payment_method`: 付款方式（0-微信，1-支付宝，2-优利支付，3-零零购支付，9-对公转账）
  - `payment_amount`: 付款金额
  - `payer`: 付款方
  - `payee_entity`: 收款主体（0-北京，1-西安）
  - `arrival_time`: 到账时间
  - `claimer`: 认领人ID
  - `status`: 状态（0-待认领，1-已认领）
  - `create_time`: 创建时间
  - `update_time`: 更新时间

## 更新步骤

### 方式1: 使用Python脚本（推荐）

```bash
# 1. 进入项目目录
cd /path/to/ZhixinStudentSaaS

# 2. 设置数据库环境变量（可选）
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=your_password
export DB_NAME=zhixinstudentsaas

# 3. 执行更新脚本
python3 update_database_20260112.py
```

**脚本特点**:
- 自动提醒备份数据库
- 检查表是否已存在，避免重复创建
- 验证更新结果
- 出错时自动回滚

### 方式2: 直接执行SQL

```bash
# 1. 备份数据库（重要！）
mysqldump -u root -p zhixinstudentsaas > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. 执行SQL脚本
mysql -u root -p zhixinstudentsaas < database_update_20260112.sql
```

## 验证更新

更新完成后，验证表是否创建成功：

```sql
-- 检查表是否存在
SHOW TABLES LIKE 'unclaimed';

-- 查看表结构
DESCRIBE unclaimed;

-- 查看索引
SHOW INDEX FROM unclaimed;
```

## 回滚方案

如果需要回滚更新：

```sql
-- 删除unclaimed表
DROP TABLE IF EXISTS unclaimed;

-- 恢复备份（如果已备份）
mysql -u root -p zhixinstudentsaas < backup_20260112_XXXXXX.sql
```

## 注意事项

1. **务必先备份数据库**，以防更新失败
2. 建议在测试环境先执行一次，确认无误后再在生产环境执行
3. 更新期间建议停止后端服务，避免数据不一致
4. 更新完成后需要重启后端服务

## 后续操作

数据库更新完成后：

1. **安装Python依赖**:
   ```bash
   pip3 install openpyxl
   ```

2. **重启后端服务**:
   ```bash
   sudo systemctl restart charonspace-backend
   ```

3. **验证服务**:
   ```bash
   # 查看服务状态
   sudo systemctl status charonspace-backend

   # 测试API
   curl http://localhost:5001/api/unclaimed
   ```

## 问题排查

### 问题1: 表已存在

如果提示表已存在，说明之前已经执行过更新，可以跳过。

### 问题2: 权限不足

确保数据库用户有CREATE TABLE权限：
```sql
GRANT CREATE ON zhixinstudentsaas.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### 问题3: 字符集问题

确保数据库使用utf8mb4字符集：
```sql
ALTER DATABASE zhixinstudentsaas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 联系支持

如有问题，请查看日志：
```bash
sudo journalctl -u charonspace-backend -n 50
```
