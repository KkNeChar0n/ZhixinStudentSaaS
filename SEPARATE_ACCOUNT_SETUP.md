# 分账明细模块安装指南

## 概述

分账明细模块已完成开发，包含以下功能：
- 自动生成分账记录（当收款确认到账时）
- 支持常规收款和淘宝收款两种类型
- 分账明细查询和筛选（支持按收款类型筛选）
- 完整的前后端实现

## 安装步骤

### 1. 创建数据库表

执行以下SQL文件创建 `separate_account` 表：

```bash
# 方式1：使用mysql命令行
mysql -h [数据库地址] -u [用户名] -p zhixinstudentsaas < create_separate_account_table.sql

# 方式2：使用数据库管理工具（Navicat/MySQL Workbench）
# 打开 create_separate_account_table.sql 文件并执行
```

### 1.1 添加 payment_type 字段（如果表已存在）

如果之前已经创建过 `separate_account` 表，需要执行以下SQL文件添加 `payment_type` 字段：

```bash
# 方式1：使用mysql命令行
mysql -h [数据库地址] -u [用户名] -p zhixinstudentsaas < add_payment_type_to_separate_account.sql

# 方式2：使用数据库管理工具
# 打开 add_payment_type_to_separate_account.sql 文件并执行
```

### 2. 添加菜单项

执行以下SQL文件在"财务管理"下添加"分账明细"菜单：

```bash
# 方式1：使用mysql命令行
mysql -h [数据库地址] -u [用户名] -p zhixinstudentsaas < insert_separate_account_menu.sql

# 方式2：使用数据库管理工具
# 打开 insert_separate_account_menu.sql 文件并执行
```

### 3. 验证安装

#### 检查数据库表

```sql
-- 检查表是否创建成功
SHOW TABLES LIKE 'separate_account';

-- 查看表结构
DESC separate_account;
```

#### 检查菜单

```sql
-- 查看财务管理菜单及其子菜单
SELECT
    m1.id AS '一级菜单ID',
    m1.name AS '一级菜单',
    m2.id AS '二级菜单ID',
    m2.name AS '二级菜单',
    m2.route AS '路由'
FROM menu m1
LEFT JOIN menu m2 ON m1.id = m2.parent_id
WHERE m1.name = '财务管理';
```

期望输出：
```
一级菜单ID | 一级菜单   | 二级菜单ID | 二级菜单   | 路由
----------|-----------|-----------|-----------|-------------------
XX        | 财务管理   | YY        | 收款管理   | payment_collection
XX        | 财务管理   | ZZ        | 分账明细   | separate_account
```

### 4. 重启后端服务

确保后端应用已更新并重启：

```bash
# 停止现有进程
# Windows
taskkill /F /IM python.exe

# Linux/Mac
pkill -f "python.*app.py"

# 启动后端
cd "d:\claude space\ZhixinStudentSaaS\backend"
python app.py
```

### 5. 刷新前端

在浏览器中强制刷新前端页面（Ctrl+F5），应该能看到：
- 左侧菜单"财务管理"下出现"分账明细"选项
- 点击后显示分账明细页面

## 功能说明

### 自动生成分账记录

当收款记录确认到账（状态变为"已支付"）时，系统会自动：
1. 获取该订单的所有子订单（按ID排序）
2. 按顺序将收款金额分配给子订单
3. 生成相应的分账明细记录

**示例：**
- 订单有2个子订单：子订单1需要100元，子订单2需要200元
- 收款1：200元，收款2：100元
- 系统会自动生成3条分账记录：
  - 记录1：子订单1分配100元（来自收款1）
  - 记录2：子订单2分配100元（来自收款1）
  - 记录3：子订单2分配100元（来自收款2）

### 分账明细查询

在"分账明细"页面，可以通过以下条件筛选：
- ID：分账记录ID
- UID：学生ID
- 订单ID：主订单ID
- 子订单ID：子订单ID
- 商品ID：商品ID
- 收款类型：常规收款(0) 或 淘宝收款(1)
- 类型：售卖(0) 或 冲回(1)

查询结果显示：
- ID、UID、订单ID、子订单ID、收款ID、收款类型
- 商品ID、商品名称、分账金额、类型

支持分页浏览（每页10条记录）。

## 数据库字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 主键ID，自增 |
| uid | int | 学生ID |
| orders_id | int | 订单ID |
| childorders_id | int | 子订单ID |
| payment_id | int | 收款ID（常规收款或淘宝收款的ID） |
| payment_type | tinyint | 收款类型：0-常规收款，1-淘宝收款 |
| goods_id | int | 商品ID |
| goods_name | varchar(200) | 商品名称 |
| separate_amount | decimal(10,2) | 分账金额 |
| type | tinyint | 类型：0-售卖，1-冲回 |
| create_time | timestamp | 创建时间 |
| update_time | timestamp | 更新时间 |

## API接口

### 获取分账明细列表

**接口：** `GET /api/separate-accounts`

**查询参数：**
- `id` - 分账记录ID（可选）
- `uid` - 学生ID（可选）
- `orders_id` - 订单ID（可选）
- `childorders_id` - 子订单ID（可选）
- `goods_id` - 商品ID（可选）
- `payment_type` - 收款类型：0-常规收款，1-淘宝收款（可选）
- `type` - 类型：0-售卖，1-冲回（可选）

**返回格式：**
```json
{
  "separate_accounts": [
    {
      "id": 1,
      "uid": 123,
      "orders_id": 456,
      "childorders_id": 789,
      "payment_id": 101,
      "payment_type": 0,
      "goods_id": 202,
      "goods_name": "商品名称",
      "separate_amount": "150.00",
      "type": 0,
      "create_time": "2026-01-13 10:00:00"
    }
  ]
}
```

## 故障排除

### 问题1：菜单不显示

**可能原因：**
- 数据库菜单未插入成功
- 前端缓存问题

**解决方案：**
1. 检查数据库菜单数据（见上文验证步骤）
2. 清除浏览器缓存并强制刷新（Ctrl+F5）
3. 检查浏览器控制台是否有错误

### 问题2：分账记录未自动生成

**可能原因：**
- 后端代码未更新
- 收款状态未正确变更为20（已支付）

**解决方案：**
1. 确认后端app.py已包含 `generate_separate_accounts()` 函数
2. 确认收款确认接口中已调用该函数
3. 检查收款记录的status字段是否为20
4. 查看后端日志是否有错误信息

### 问题3：分账金额不正确

**可能原因：**
- 子订单金额设置错误
- 收款金额与子订单金额不匹配

**解决方案：**
1. 检查子订单的 actual_amount 字段
2. 检查收款记录的 payment_amount 字段
3. 查看 separate_account 表的所有记录，验证分配逻辑

## 相关文件

- `create_separate_account_table.sql` - 数据库表创建脚本
- `insert_separate_account_menu.sql` - 菜单插入脚本
- `backend/app.py` - 后端逻辑（包含自动生成和API）
- `frontend/app.js` - 前端逻辑（数据处理和方法）
- `frontend/index.html` - 前端UI（页面布局）

---

**创建日期：** 2026-01-13
**模块版本：** 1.0
