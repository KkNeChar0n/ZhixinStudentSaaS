# CharonSpace Website

一个完整的前后端分离网站项目，域名为charonspace.asia。

## 技术栈

- **前端**: Vue 3 + JavaScript + CSS
- **后端**: Python + Flask
- **数据库**: MySQL

## 项目结构

```
ZhixinStudentSaaS/
├── frontend/          # 前端项目目录
│   ├── index.html     # HTML入口文件
│   ├── app.js         # Vue应用文件
│   └── styles.css     # 样式文件
├── backend/           # 后端项目目录
│   ├── app.py         # Flask应用主文件
│   ├── requirements.txt # 依赖包列表
│   └── init_db.sql    # 数据库初始化脚本
└── .github/workflows/ # GitHub Actions工作流
    └── deploy.yml     # 自动部署配置
```

## 功能说明

1. **数据库**: 创建数据库`testconnect251219`和表`testword`，插入数据`name='hallo world'`
2. **后端API**: 提供`/api/data`接口，返回id=1的数据
3. **前端展示**: 从后端获取数据并展示在页面上

## 快速开始

### 1. 配置数据库

首先确保MySQL服务已启动，然后执行数据库初始化脚本：

```bash
mysql -u root -p < backend/init_db.sql
```

### 2. 安装后端依赖

```bash
cd backend
pip install -r requirements.txt
```

### 3. 启动后端服务

```bash
# 根据实际情况配置环境变量
set DB_USER=root
set DB_PASSWORD=your_password
set DB_HOST=localhost

python app.py
```

后端服务将在`http://localhost:5000`启动

### 4. 运行前端

直接在浏览器中打开`frontend/index.html`文件，或使用本地服务器：

```bash
cd frontend
python -m http.server 8000
```

然后访问`http://localhost:8000`

## 部署说明

项目已配置GitHub Actions自动部署工作流。当代码推送到`main`或`master`分支时，工作流将自动执行部署。

### 配置要求

1. 在GitHub仓库的`Settings > Secrets and variables > Actions`中配置以下Secrets：
   - `SERVER_HOST`: 服务器主机地址
   - `SERVER_USER`: 服务器用户名
   - `SSH_PRIVATE_KEY`: SSH私钥

2. 根据服务器环境修改`.github/workflows/deploy.yml`中的部署命令

## 注意事项

1. 确保数据库配置正确，包括用户名、密码和主机地址
2. 后端默认使用5000端口，前端默认从该端口获取数据
3. 跨域访问已通过Flask-CORS配置
4. 生产环境建议使用Nginx或Apache等Web服务器部署
