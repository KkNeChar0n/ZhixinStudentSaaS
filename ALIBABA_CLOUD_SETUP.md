# 阿里云服务器配置指南

本文档详细介绍如何在阿里云ECS服务器上配置CharonSpace网站项目。

## 1. 服务器初始化配置

### 1.1 连接服务器

使用SSH连接到您的阿里云ECS服务器：

```bash
ssh root@your-server-ip
```

### 1.2 创建用户

创建一个专门用于部署的用户：

```bash
adduser charon
usermod -aG sudo charon
```

### 1.3 更新系统

```bash
sudo apt update
sudo apt upgrade -y
```

## 2. 安装必要的软件

### 2.1 安装MySQL

```bash
sudo apt install mysql-server -y

# 运行安全配置向导
sudo mysql_secure_installation
```

### 2.2 安装Nginx

```bash
sudo apt install nginx -y
```

### 2.3 安装Python和pip

```bash
sudo apt install python3 python3-pip python3-venv -y
```

## 3. 配置MySQL

### 3.1 登录MySQL

```bash
sudo mysql
```

### 3.2 创建数据库和用户

```sql
-- 创建数据库
CREATE DATABASE testconnect251219 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户（替换your_password为安全密码）
CREATE USER 'charon'@'localhost' IDENTIFIED BY 'your_password';

-- 授予权限
GRANT ALL PRIVILEGES ON testconnect251219.* TO 'charon'@'localhost';
FLUSH PRIVILEGES;

-- 退出MySQL
EXIT;
```

### 3.3 初始化表结构

上传并执行数据库初始化脚本：

```bash
# 从GitHub下载脚本
curl -o init_db.sql https://raw.githubusercontent.com/yourusername/your-repository/main/backend/init_db.sql

# 执行脚本
mysql -u charon -p testconnect251219 < init_db.sql
```

## 4. 配置Nginx

### 4.1 创建Nginx配置文件

```bash
sudo nano /etc/nginx/sites-available/charonspace.asia
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name charonspace.asia www.charonspace.asia;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # 配置后端API代理
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4.2 启用配置

```bash
sudo ln -s /etc/nginx/sites-available/charonspace.asia /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

## 5. 配置防火墙

### 5.1 配置UFW防火墙

```bash
# 允许SSH
ufw allow ssh

# 允许HTTP和HTTPS
ufw allow 'Nginx Full'

# 启用防火墙
ufw enable
```

### 5.2 配置阿里云安全组

在阿里云控制台中，为您的ECS实例添加以下安全组规则：
- 允许80端口（HTTP）
- 允许443端口（HTTPS，可选）
- 允许22端口（SSH）
- 允许3306端口（MySQL，仅允许本地访问）

## 6. 配置域名解析

在您的域名注册商处，添加以下DNS记录：

| 类型 | 主机记录 | 记录值 | TTL |
|------|----------|--------|-----|
| A | @ | 您的服务器IP | 600 |
| A | www | 您的服务器IP | 600 |

## 7. 部署项目

### 7.1 配置GitHub Secrets

在您的GitHub仓库的`Settings > Secrets and variables > Actions`中配置以下Secrets：
- `SERVER_HOST`: 您的服务器IP地址或域名
- `SERVER_USER`: charon（或您创建的部署用户）
- `SSH_PRIVATE_KEY`: 您的服务器SSH私钥

### 7.2 更新部署工作流

确保`.github/workflows/deploy.yml`文件中的配置与您的服务器环境一致，特别是：
- 数据库密码
- 仓库地址
- Nginx网站根目录

### 7.3 触发部署

将代码推送到GitHub的`main`分支，工作流将自动执行部署。

## 8. 验证部署

### 8.1 检查后端服务

```bash
sudo systemctl status charonspace-backend
```

### 8.2 检查Nginx服务

```bash
sudo systemctl status nginx
```

### 8.3 访问网站

在浏览器中访问`http://charonspace.asia`，您应该能看到网站正常运行并显示后端数据。

## 9. 常见问题排查

### 9.1 数据库连接失败

- 检查环境变量中的数据库密码是否正确
- 确保MySQL用户有正确的权限
- 检查MySQL服务是否正常运行

### 9.2 后端服务无法启动

- 查看服务日志：`sudo journalctl -u charonspace-backend.service`
- 检查Python依赖是否安装正确
- 确保端口5000没有被占用

### 9.3 前端页面无法访问

- 检查Nginx配置是否正确
- 确保前端文件已正确复制到Nginx根目录
- 检查防火墙和安全组设置

### 9.4 API接口无法访问

- 检查Nginx代理配置是否正确
- 确保后端服务正在运行
- 检查CORS配置是否正确

## 10. 安全建议

1. 定期更新系统和软件包
2. 为MySQL设置强密码
3. 使用HTTPS（可通过Let's Encrypt免费获取SSL证书）
4. 限制SSH访问（仅允许特定IP或使用密钥认证）
5. 定期备份数据库和代码

## 11. 扩展建议

1. 使用虚拟环境隔离Python依赖
2. 配置日志收集和监控
3. 实现自动化测试
4. 配置持续集成/持续部署（CI/CD）
5. 考虑使用Docker容器化部署
