# 权限管理系统实现指南

## 概述

权限管理系统用于控制前端按钮和操作的显示与隐藏。通过启用/禁用权限，系统可以动态控制用户界面上的功能按钮。

## 数据库设计

### permissions 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int(11) | 主键ID，自增 |
| name | varchar(100) | 权限名称 |
| menu_id | int(11) | 所在菜单ID |
| action_id | varchar(100) | 前端触发行为ID |
| status | tinyint(4) | 状态：0-启用，1-禁用 |
| create_time | timestamp | 创建时间 |
| update_time | timestamp | 更新时间 |

**索引**：
- PRIMARY KEY: id
- KEY idx_menu_id: menu_id
- KEY idx_action_id: action_id
- KEY idx_status: status

## 内置权限数据

系统预置了以下权限（共58个）：

### 学生管理（5个）
- 新增学生 (add_student)
- 编辑学生 (edit_student)
- 禁用学生 (disable_student)
- 启用学生 (enable_student)
- 删除学生 (delete_student)

### 教练管理（5个）
- 新增教练 (add_coach)
- 编辑教练 (edit_coach)
- 禁用教练 (disable_coach)
- 启用教练 (enable_coach)
- 删除教练 (delete_coach)

### 订单管理（4个）
- 新增订单 (add_order)
- 编辑订单 (edit_order)
- 作废订单 (void_order)
- 申请退费 (apply_refund)

### 商品管理（4个）
- 新增商品 (add_goods)
- 编辑商品 (edit_goods)
- 启用商品 (enable_goods)
- 禁用商品 (disable_goods)

### 属性管理（5个）
- 新增属性 (add_attribute)
- 编辑属性 (edit_attribute)
- 编辑属性值 (edit_attribute_value)
- 禁用属性 (disable_attribute)
- 启用属性 (enable_attribute)

### 类型管理（4个）
- 新增类型 (add_classify)
- 编辑类型 (edit_classify)
- 禁用类型 (disable_classify)
- 启用类型 (enable_classify)

### 品牌管理（4个）
- 新增品牌 (add_brand)
- 编辑品牌 (edit_brand)
- 禁用品牌 (disable_brand)
- 启用品牌 (enable_brand)

### 账号管理（2个）
- 禁用账号 (disable_account)
- 启用账号 (enable_account)

### 审批流类型（2个）
- 禁用审批流类型 (disable_approval_type)
- 启用审批流类型 (enable_approval_type)

### 审批流模板（3个）
- 新增审批流模板 (add_approval_template)
- 禁用审批流模板 (disable_approval_template)
- 启用审批流模板 (enable_approval_template)

### 活动模板（3个）
- 新增活动模板 (add_activity_template)
- 禁用活动模板 (disable_activity_template)
- 启用活动模板 (enable_activity_template)

### 活动管理（4个）
- 新增活动 (add_activity)
- 禁用活动 (disable_activity)
- 启用活动 (enable_activity)
- 编辑活动 (edit_activity)

### 合同管理（1个）
- 新增合同 (add_contract)

### 收款管理（8个）
- 新增收款 (add_payment)
- 确认到账 (confirm_payment)
- 删除常规收款 (delete_normal_payment)
- 认领常规收款 (claim_normal_payment)
- 删除常规收款认领 (delete_normal_claim)
- 删除淘宝收款 (delete_taobao_payment)
- 认领淘宝收款 (claim_taobao_payment)
- 删除淘宝收款认领 (delete_taobao_claim)

## 后端API接口

### 1. 获取权限列表
**接口**: `GET /api/permissions`

**查询参数**:
- `id` - 权限ID（可选，精准搜索）

**返回数据**:
```json
{
  "permissions": [
    {
      "id": 1,
      "name": "新增学生",
      "menu_id": 2,
      "menu_name": "学生管理",
      "action_id": "add_student",
      "status": 0,
      "create_time": "2026-01-14 10:00:00",
      "update_time": "2026-01-14 10:00:00"
    }
  ]
}
```

### 2. 更新权限状态
**接口**: `PUT /api/permissions/<permission_id>/status`

**请求参数**:
```json
{
  "status": 0
}
```

**说明**:
- status: 0-启用，1-禁用
- 启用后，该权限绑定的按钮将展示于对应页面
- 禁用后，该权限绑定的按钮将隐藏于对应页面

## 前端实现

### 页面路由
`permissions` - 权限管理页面（系统设置 > 权限管理）

### 筛选区
- ID输入框（精准搜索）

### 列表区
显示字段：
- ID
- 权限名称
- 所在菜单
- 状态（启用/禁用）
- 操作（启用/禁用按钮）

### 操作按钮
- **启用**：仅当status=1时显示，点击后弹出确认弹窗
- **禁用**：仅当status=0时显示，点击后弹出确认弹窗

### 分页
每页显示10条记录

## 安装步骤

### 1. 创建数据库表
```bash
mysql -h localhost -u root -p zhixinstudentsaas < create_permissions_table.sql
```

### 2. 添加菜单项
```bash
mysql -h localhost -u root -p zhixinstudentsaas < add_permission_menu.sql
```

### 3. 插入内置权限数据
```bash
mysql -h localhost -u root -p zhixinstudentsaas < insert_default_permissions.sql
```

### 4. 重启后端服务
确保后端加载最新代码

### 5. 刷新前端
在浏览器中强制刷新（Ctrl+F5）

## 使用说明

### 启用权限
1. 进入"系统设置" > "权限管理"
2. 找到需要启用的权限
3. 点击"启用"按钮
4. 确认弹窗中点击"确认"
5. 权限状态变为"启用"，对应按钮将在相关页面显示

### 禁用权限
1. 进入"系统设置" > "权限管理"
2. 找到需要禁用的权限
3. 点击"禁用"按钮
4. 确认弹窗中点击"确认"
5. 权限状态变为"禁用"，对应按钮将在相关页面隐藏

## 前端集成指南

### 如何在页面中使用权限控制

权限系统通过 `action_id` 来标识每个操作按钮。前端需要根据权限状态来控制按钮的显示/隐藏。

**实现步骤**（待实现）：

1. **获取当前用户的权限列表**
```javascript
// 在用户登录后获取启用的权限列表
async fetchUserPermissions() {
    const response = await axios.get('/api/permissions?status=0');
    this.enabledPermissions = response.data.permissions.map(p => p.action_id);
}
```

2. **在按钮上使用 v-if 控制显示**
```html
<!-- 示例：新增学生按钮 -->
<button v-if="hasPermission('add_student')" @click="openAddStudentModal">
    新增学生
</button>
```

3. **添加权限检查方法**
```javascript
hasPermission(actionId) {
    return this.enabledPermissions.includes(actionId);
}
```

## 注意事项

1. 所有内置权限默认状态为**启用**（status=0）
2. 权限管理仅控制前端按钮显示，后端API仍需做权限校验
3. action_id 必须与前端代码中的标识保持一致
4. 修改权限状态后，用户需要刷新页面才能看到效果（可考虑实现实时推送）

## 开发状态

**已完成**:
- ✅ 数据库表设计
- ✅ SQL脚本创建（表、菜单、数据）
- ✅ 后端API实现
- ✅ 前端页面实现
- ✅ 启用/禁用功能
- ✅ 分页功能

**待实现**:
- ⏳ 前端按钮权限控制集成
- ⏳ 用户登录时加载权限列表
- ⏳ 实时权限更新（WebSocket或轮询）

---

**创建日期**: 2026-01-14
**模块版本**: 1.0
