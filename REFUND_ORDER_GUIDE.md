# 退款订单功能实现指南

## 概述

退款订单功能已完成后端API开发，前端实现需要在订单管理模块中添加"申请退费"功能和新的"退款订单"管理页面。

## 数据库表设计

### 1. refund_order（退款订单主表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 主键ID |
| order_id | int | 关联的订单ID |
| student_id | int | 学生ID |
| refund_amount | decimal(10,2) | 退费金额总额 |
| submitter | varchar(100) | 提交人 |
| submit_time | datetime | 提交时间 |
| status | tinyint | 状态：0-待审批，10-已通过，20-已驳回 |

### 2. refund_order_item（退款子订单明细表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 主键ID |
| refund_order_id | int | 退款订单ID |
| childorder_id | int | 子订单ID |
| goods_id | int | 商品ID |
| goods_name | varchar(200) | 商品名称 |
| refund_amount | decimal(10,2) | 退费金额 |

### 3. refund_payment（退款收款分配表）
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 主键ID |
| refund_order_id | int | 退款订单ID |
| payment_id | int | 收款ID |
| payment_type | tinyint | 收款类型：0-常规收款，1-淘宝收款 |
| refund_amount | decimal(10,2) | 退费金额 |

## 订单状态说明

新增订单状态：
- 10: 草稿
- 20: 未支付
- 30: 部分支付
- 40: 已支付
- **50: 退费中**（新增，提交退款申请后订单自动变更为此状态）
- **60: 已退费**（新增，退款审批通过后的最终状态）
- 99: 已作废

## 后端API接口

### 1. 获取订单退费信息
**接口**: `GET /api/orders/<order_id>/refund-info`

**功能**: 获取订单的退费信息，用于申请退费弹窗

**返回数据**:
```json
{
  "order": {
    "id": 1,
    "student_id": 123,
    "student_name": "张三",
    "grade": "三年级",
    "gender": "男",
    "status": 40
  },
  "child_orders": [
    {
      "childorder_id": 1,
      "goods_id": 10,
      "goods_name": "商品名称",
      "amount_received": "1000.00",
      "refunded_amount": "0.00",
      "available_refund": 1000.00
    }
  ],
  "payments": [
    {
      "payment_id": 1,
      "payment_type": 0,
      "payment_amount": "1000.00",
      "payee_entity": 0,
      "refunded_amount": "0.00",
      "available_refund": 1000.00
    }
  ]
}
```

### 2. 提交退款申请
**接口**: `POST /api/refund-orders`

**请求参数**:
```json
{
  "order_id": 1,
  "refund_items": [
    {
      "childorder_id": 1,
      "goods_id": 10,
      "goods_name": "商品名称",
      "refund_amount": "500.00"
    }
  ],
  "refund_payments": [
    {
      "payment_id": 1,
      "payment_type": 0,
      "refund_amount": "500.00"
    }
  ]
}
```

**返回数据**:
```json
{
  "message": "退款申请提交成功",
  "refund_order_id": 1
}
```

### 3. 获取退款订单列表
**接口**: `GET /api/refund-orders`

**查询参数**:
- `id` - 退款订单ID（可选）
- `uid` - 学生ID（可选）
- `order_id` - 订单ID（可选）

**返回数据**:
```json
{
  "refund_orders": [
    {
      "id": 1,
      "order_id": 1,
      "uid": 123,
      "refund_amount": "500.00",
      "submitter": "admin",
      "submit_time": "2026-01-14 10:00:00",
      "status": 0
    }
  ]
}
```

### 4. 获取退款订单详情
**接口**: `GET /api/refund-orders/<refund_order_id>`

**返回数据**:
```json
{
  "refund_order": {
    "id": 1,
    "order_id": 1,
    "student_id": 123,
    "student_name": "张三",
    "grade": "三年级",
    "gender": "男",
    "refund_amount": "500.00",
    "submitter": "admin",
    "submit_time": "2026-01-14 10:00:00",
    "status": 0
  },
  "refund_items": [...],
  "refund_payments": [...]
}
```

## 前端实现要点

### 1. 订单管理页面修改

在订单列表的操作列中添加"申请退费"按钮：

**显示条件**:
- 订单状态为 30（部分支付）或 40（已支付）

**点击事件**:
1. 调用 `GET /api/orders/<order_id>/refund-info` 获取退费信息
2. 如果返回错误（存在未验证收款），显示错误提示
3. 如果成功，打开申请退费弹窗

### 2. 申请退费弹窗实现

弹窗分为4个区域：

#### 基本信息区（只读）
- UID
- 学生姓名
- 年级
- 性别

#### 子订单列表区
表格字段：
- 选择按钮
- 子订单ID
- 商品ID
- 商品名称
- 可退金额

**交互逻辑**:
- 点击选择按钮，将该行数据添加到待退费区

#### 待退费区
标题右侧：
- 退费总额：显示所有退费金额之和
- 应用按钮：点击更新退费总额

表格字段：
- 子订单ID
- 商品ID
- 商品名称
- 可退金额
- 退费金额（输入框）
- 删除按钮

**交互逻辑**:
- 退费金额不能大于可退金额
- 点击删除按钮，从待退费区移除该行

#### 收款列表区
标题右侧：
- 待分配金额：初始等于退费总额，随退费金额填写递减

表格字段：
- 收款ID
- 收款类型（常规收款/淘宝收款）
- 收款金额
- 收款主体
- 可退金额
- 退费金额（输入框）

**交互逻辑**:
- 退费金额不能大于可退金额（超过时自动限制为可退金额并提示）
- 退费金额不能小于0
- 实时计算待分配金额

#### 提交按钮
**校验逻辑**:
1. 待退费区不能为空
2. 所有退费金额必须大于0
3. 待分配金额必须为0

**提交成功后**:
- 关闭弹窗
- 刷新订单列表
- 提示"退款申请提交成功"

### 3. 退款订单管理页面

新增二级菜单：订单管理 > 退款订单

#### 筛选区
- id（输入框）
- UID（输入框）
- 订单ID（输入框）

#### 列表区
表格字段：
- id
- UID
- 订单ID
- 退费金额
- 提交人
- 提交时间
- 状态（待审批/已通过/已驳回）
- 操作：详情按钮

#### 详情弹窗
点击详情按钮，调用 `GET /api/refund-orders/<refund_order_id>` 获取详情

弹窗内容：
- 右上角状态标签
- 基本信息（只读）
- 退费子订单列表（只读）
- 退费收款分配列表（只读）

## 前端数据结构示例

### app.js 数据结构
```javascript
// 申请退费弹窗数据
refundApplicationForm: {
    order_id: null,
    student_id: null,
    student_name: '',
    grade: '',
    gender: '',
    child_orders: [],          // 可选子订单列表
    selected_refunds: [],      // 待退费区数据
    payments: [],              // 收款列表
    refund_total: 0,          // 退费总额
    unallocated_amount: 0     // 待分配金额
},

// 退款订单管理数据
refundOrders: [],
refundOrderFilters: {
    id: '',
    uid: '',
    order_id: ''
}
```

## 安装步骤

### 1. 创建数据库表
```bash
mysql -h [数据库地址] -u [用户名] -p zhixinstudentsaas < create_refund_tables.sql
```

### 2. 添加菜单项
```bash
mysql -h [数据库地址] -u [用户名] -p zhixinstudentsaas < add_refund_order_menu.sql
```

### 3. 重启后端服务
确保后端加载最新代码

### 4. 前端开发
根据以上要点实现前端UI和交互逻辑

## 注意事项

1. **金额计算精度**: 使用 `toFixed(2)` 处理金额计算，避免精度问题
2. **状态校验**: 提交前务必校验待分配金额为0
3. **错误处理**: 每个API调用都要有错误处理逻辑
4. **用户体验**:
   - 添加loading状态
   - 表单校验提示要清晰
   - 成功/失败都要有明确提示
5. **数据刷新**: 提交成功后要刷新相关列表

## 状态码说明

### 退款订单状态
- 0: 待审批
- 10: 已通过
- 20: 已驳回

### 收款主体
- 0: 北京
- 1: 西安

### 性别
- 0: 女
- 1: 男

---

**创建日期**: 2026-01-14
**模块版本**: 1.0
