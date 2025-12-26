# 域名配置指南 - charonspace.asia

## 第一步: DNS配置

在你的域名注册商（阿里云、腾讯云等）的DNS管理界面配置：

### A记录配置

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|--------|-----|
| A | @ | 你的服务器IP | 600 |
| A | www | 你的服务器IP | 600 |

**示例**:
```
类型: A
主机记录: @
记录值: 123.456.789.123  (替换为你的阿里云服务器IP)
TTL: 600

类型: A
主机记录: www
记录值: 123.456.789.123  (替换为你的阿里云服务器IP)
TTL: 600
```

### 验证DNS解析

等待几分钟后，在本地测试DNS解析：

```bash
# Windows (CMD/PowerShell)
nslookup charonspace.asia
nslookup www.charonspace.asia

# Linux/Mac
dig charonspace.asia
dig www.charonspace.asia

# 或使用在线工具
# https://dns.google/
```

## 第二步: 服务器Nginx配置

Nginx配置已更新，包含以下内容：

1. ✅ 监听80端口
2. ✅ 配置域名: `charonspace.asia` 和 `www.charonspace.asia`
3. ✅ API反向代理到 `localhost:5001`
4. ✅ 前端静态文件服务
5. ✅ 静态资源缓存优化

### 在服务器上应用配置

SSH登录服务器后执行：

```bash
# 1. 进入项目目录
cd /home/charonspace

# 2. 更新代码（获取最新的nginx.conf）
git stash
git pull origin main

# 3. 复制Nginx配置
sudo cp backend/nginx.conf /etc/nginx/conf.d/charonspace.conf

# 4. 测试Nginx配置
sudo nginx -t

# 5. 重启Nginx
sudo systemctl restart nginx

# 6. 查看Nginx状态
sudo systemctl status nginx
```

## 第三步: 测试访问

### 测试HTTP访问

```bash
# 在服务器上测试
curl -I http://charonspace.asia
curl -I http://www.charonspace.asia

# 测试API
curl http://charonspace.asia/api/current-user
```

### 浏览器访问

1. 打开浏览器
2. 访问: http://charonspace.asia
3. 应该能看到登录页面

## 第四步: 配置HTTPS（可选但推荐）

使用Let's Encrypt免费SSL证书：

### 安装Certbot

```bash
# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y

# Ubuntu/Debian
sudo apt-get install certbot python3-certbot-nginx -y
```

### 获取SSL证书

```bash
# 自动配置Nginx并获取证书
sudo certbot --nginx -d charonspace.asia -d www.charonspace.asia

# 按提示输入邮箱
# 同意服务条款
# 选择是否重定向HTTP到HTTPS（推荐选择重定向）
```

### 自动续期

```bash
# 测试自动续期
sudo certbot renew --dry-run

# 查看定时任务
sudo systemctl status certbot.timer
```

### 验证HTTPS

```bash
# 测试HTTPS访问
curl -I https://charonspace.asia

# 浏览器访问
# https://charonspace.asia
```

## 配置后的Nginx配置（带HTTPS）

Certbot会自动修改配置，大致如下：

```nginx
# HTTP - 重定向到HTTPS
server {
    listen 80;
    server_name charonspace.asia www.charonspace.asia;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name charonspace.asia www.charonspace.asia;

    ssl_certificate /etc/letsencrypt/live/charonspace.asia/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/charonspace.asia/privkey.pem;

    # ... 其他配置保持不变 ...
}
```

## 常见问题

### Q1: DNS解析失败
**解决方案**:
- 等待DNS传播（最多48小时，通常几分钟到几小时）
- 检查DNS配置是否正确
- 清除本地DNS缓存: `ipconfig /flushdns` (Windows)

### Q2: 访问域名显示默认Nginx页面
**解决方案**:
```bash
# 删除默认配置
sudo rm /etc/nginx/sites-enabled/default
sudo rm /etc/nginx/conf.d/default.conf

# 重启Nginx
sudo systemctl restart nginx
```

### Q3: 502 Bad Gateway
**解决方案**:
```bash
# 检查后端服务是否运行
sudo systemctl status charonspace-backend

# 重启后端服务
sudo systemctl restart charonspace-backend

# 查看后端日志
sudo journalctl -u charonspace-backend -n 50
```

### Q4: Certbot证书申请失败
**解决方案**:
- 确保域名已正确解析到服务器IP
- 确保80端口和443端口对外开放
- 检查防火墙设置
- 检查Nginx是否正常运行

## 防火墙配置

确保以下端口对外开放：

```bash
# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Ubuntu/Debian (ufw)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload

# 阿里云安全组
# 在阿里云控制台 -> ECS -> 安全组 中添加规则:
# 入方向: 80/tcp, 443/tcp, 来源: 0.0.0.0/0
```

## 验证清单

完成配置后，验证以下项目：

- [ ] DNS解析正确 (`nslookup charonspace.asia`)
- [ ] HTTP访问正常 (`curl http://charonspace.asia`)
- [ ] HTTPS访问正常 (`curl https://charonspace.asia`)
- [ ] 前端页面显示正常
- [ ] API接口工作正常 (`curl http://charonspace.asia/api/current-user`)
- [ ] 登录功能正常
- [ ] 学生管理功能正常
- [ ] 教练管理功能正常
- [ ] 账号管理功能正常

## 部署后配置

更新GitHub Actions secrets，添加域名信息（可选）：

1. GitHub仓库 -> Settings -> Secrets and variables -> Actions
2. 添加新secret: `DOMAIN_NAME` = `charonspace.asia`
3. 在部署脚本中可以使用这个变量

## 监控和日志

### 查看访问日志
```bash
sudo tail -f /var/log/nginx/charonspace_access.log
```

### 查看错误日志
```bash
sudo tail -f /var/log/nginx/charonspace_error.log
```

### 查看后端日志
```bash
sudo journalctl -u charonspace-backend -f
```

## 备份配置

定期备份重要配置：

```bash
# 备份Nginx配置
sudo cp /etc/nginx/conf.d/charonspace.conf ~/backups/charonspace.conf.$(date +%Y%m%d)

# 备份SSL证书（如果使用HTTPS）
sudo tar -czf ~/backups/letsencrypt_$(date +%Y%m%d).tar.gz /etc/letsencrypt/
```

## 下一步

1. ✅ 推送代码到GitHub
2. ⏳ 等待GitHub Actions自动部署
3. ⏳ 配置DNS解析
4. ⏳ 在服务器上应用Nginx配置
5. ⏳ （可选）配置HTTPS证书
6. ⏳ 访问 http://charonspace.asia 验证
