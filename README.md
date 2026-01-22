# 智信学生SaaS管理系统

一个基于Flask和Vue.js的学生管理SaaS系统。

## 技术栈

- **后端**: Flask (Python)
- **前端**: Vue.js 3
- **数据库**: MySQL
- **样式**: CSS

## 项目结构

```
ZhixinStudentSaaS/
├── backend/          # Flask后端
│   └── app.py       # 主应用文件
├── frontend/         # Vue.js前端
│   ├── index.html   # 主页面
│   ├── app.js       # Vue应用逻辑
│   └── styles.css   # 样式文件
└── README.md        # 项目说明
```

## 主要功能

- 学生管理
- 教练管理
- 订单管理
- 商品管理
- 品牌管理
- 属性管理
- 分类管理
- 审批流程管理
- 活动管理
- 合同管理
- 收款管理
- 分账管理
- 退款管理
- 账号管理
- 角色权限管理
- 菜单管理

## 启动项目

### 后端

```bash
cd backend
python app.py
```

后端服务默认运行在 `http://127.0.0.1:5001`

### 前端

打开 `frontend/index.html` 文件即可访问前端页面。

## 数据库配置

在 `backend/app.py` 中配置数据库连接：

```python
db_config = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', 'password'),
    'database': os.environ.get('DB_NAME', 'zhixinstudentsaas'),
    'charset': 'utf8mb4'
}
```

## 权限系统

系统支持基于角色的权限控制（RBAC）：

- 用户 → 角色 → 权限 → 菜单
- 超级管理员拥有所有权限
- 角色变更后自动同步，无需重新登录
