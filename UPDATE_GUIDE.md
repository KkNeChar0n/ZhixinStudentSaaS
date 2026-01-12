# 正式环境更新指南

## 本次更新内容（2026-01-13）

### 新功能
1. **收款管理模块**
   - 支持线上/线下收款
   - 收款录入、确认到账、删除功能
   - 订单状态根据收款情况自动更新

2. **订单状态优化**
   - 状态含义调整：
     - 20: 未支付（原"审核中"）
     - 30: 部分支付（原"已通过"）
     - 40: 已支付（原"已驳回"）
   - 新增订单提交功能

### 数据库变更
- 新增 `payment_collection` 表
- 新增财务管理菜单及子菜单

---

## 更新步骤

### 1. 备份数据库
```bash
# 导出完整数据库备份（强烈建议！）
mysqldump -u root -p zhixinstudentsaas > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. 拉取最新代码
```bash
cd /path/to/ZhixinStudentSaaS
git pull origin main
```

### 3. 更新数据库
```bash
# 方式1：使用MySQL命令行
mysql -u root -p zhixinstudentsaas < database_update_20260113.sql

# 方式2：使用Python脚本（推荐，更安全）
python3 << 'EOF'
import pymysql

# 数据库配置（请根据实际情况修改）
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '你的密码',
    'database': 'zhixinstudentsaas',
    'charset': 'utf8mb4'
}

try:
    connection = pymysql.connect(**db_config)
    cursor = connection.cursor()

    # 读取SQL文件
    with open('database_update_20260113.sql', 'r', encoding='utf-8') as f:
        sql_content = f.read()

    # 分割并执行SQL语句
    statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().startswith('--')]

    for statement in statements:
        if statement:
            cursor.execute(statement)
            print(f"✓ 执行成功: {statement[:50]}...")

    connection.commit()
    print("\n✓ 数据库更新完成！")

except Exception as e:
    print(f"✗ 更新失败: {e}")
    if connection:
        connection.rollback()
finally:
    if cursor:
        cursor.close()
    if connection:
        connection.close()
EOF
```

### 4. 重启服务
```bash
# 重启Flask后端
# 根据你的部署方式，可能是以下之一：

# 如果使用systemd
sudo systemctl restart zhixin-backend

# 如果使用supervisor
sudo supervisorctl restart zhixin-backend

# 如果是直接运行
pkill -f "python.*app.py"
cd backend && nohup python app.py > app.log 2>&1 &

# 重启Nginx（如果需要）
sudo systemctl restart nginx
```

### 5. 验证更新
访问系统检查以下功能：

1. **菜单显示**
   - 确认左侧菜单中出现"财务管理"一级菜单
   - 确认"收款管理"二级菜单正常显示

2. **收款管理功能**
   - 点击"收款管理"进入页面
   - 测试新增收款功能
   - 测试确认到账功能

3. **订单状态**
   - 进入订单管理，查看状态列显示是否正确
   - 测试编辑订单的"提交"按钮功能

---

## 常见问题

### Q1: 菜单显示乱码
**A:** 检查MySQL字符集设置，确保使用utf8mb4
```sql
ALTER DATABASE zhixinstudentsaas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Q2: 收款管理菜单不显示
**A:** 手动检查菜单表
```sql
-- 查看菜单
SELECT * FROM menu WHERE name IN ('财务管理', '收款管理');

-- 如果不存在，手动插入
INSERT INTO menu (name, parent_id, route, sort_order) VALUES ('财务管理', NULL, NULL, 8);
SET @menu_id = LAST_INSERT_ID();
INSERT INTO menu (name, parent_id, route, sort_order) VALUES ('收款管理', @menu_id, 'payment_collection', 1);
```

### Q3: 现有订单状态需要更新吗？
**A:** 不需要。系统会根据收款情况自动更新订单状态。但如果需要批量初始化，可以将所有草稿订单状态改为未支付：
```sql
-- 谨慎操作！建议先在测试环境验证
UPDATE orders SET status = 20 WHERE status = 10;
```

---

## 回滚方案

如果更新出现问题，可以回滚：

```bash
# 1. 恢复数据库
mysql -u root -p zhixinstudentsaas < backup_你的备份文件.sql

# 2. 回退代码
git checkout c3cfe6e  # 上一个版本的commit hash

# 3. 重启服务
sudo systemctl restart zhixin-backend nginx
```

---

## 技术支持

如遇问题，请提供以下信息：
1. 错误日志（backend日志、MySQL错误日志）
2. 浏览器F12控制台错误
3. 操作步骤描述

联系方式：[在此填写联系方式]
