# 服务器部署故障排查指南

## 问题: GitHub Actions运行成功但服务器代码没有更新

### 可能的原因和解决方案:

#### 1. Git分支不匹配 ✅ 已修复
**问题**: Actions配置中使用固定分支名`git pull origin main`，但服务器上可能是`master`分支

**解决方案**:
已更新 `.github/workflows/deploy.yml` 第45行，自动检测当前分支:
```bash
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git pull origin $CURRENT_BRANCH || git pull origin main || git pull origin master
```

#### 2. 服务器上有未提交的修改
**检查方法**:
```bash
# SSH登录服务器
ssh your-user@your-server

# 进入项目目录
cd /home/charonspace

# 检查git状态
git status
```

**如果有未提交的修改**:
```bash
# 方法1: 暂存修改
git stash
git pull origin main
git stash pop

# 方法2: 放弃本地修改 (谨慎使用)
git reset --hard HEAD
git pull origin main
```

#### 3. Git权限问题
**检查方法**:
```bash
# 检查.git目录权限
ls -la /home/charonspace/.git

# 检查当前用户
whoami
```

**解决方案**:
```bash
# 修改所有者为当前用户
sudo chown -R $USER:$USER /home/charonspace
```

#### 4. 后端服务没有重启
**问题**: 代码已更新但后端服务使用的是旧代码

**解决方案**:
```bash
# 重启后端服务
sudo systemctl restart charonspace-backend

# 检查服务状态
sudo systemctl status charonspace-backend

# 查看服务日志
sudo journalctl -u charonspace-backend -f
```

#### 5. 前端静态文件缓存
**问题**: 浏览器缓存了旧的前端文件

**解决方案**:
- 方法1: 强制刷新浏览器 (Ctrl + Shift + R 或 Cmd + Shift + R)
- 方法2: 清除浏览器缓存
- 方法3: 使用隐私/无痕模式访问

#### 6. Nginx没有重启
**问题**: Nginx仍在使用旧的配置或静态文件

**解决方案**:
```bash
# 检查Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx

# 检查Nginx状态
sudo systemctl status nginx
```

## 如何验证代码是否已更新

### 1. 检查服务器上的代码版本
```bash
# SSH登录服务器
ssh your-user@your-server

# 进入项目目录
cd /home/charonspace

# 查看最新提交
git log -1 --oneline

# 查看某个文件的最后修改时间
stat backend/app.py
```

### 2. 对比GitHub上的最新提交
```bash
# 在GitHub上查看最新提交的SHA
# 对比服务器上的提交SHA

# 如果不一致，手动拉取
git fetch origin
git pull origin main
```

### 3. 检查Actions日志
1. 进入GitHub仓库
2. 点击 "Actions" 标签
3. 查看最新的workflow运行
4. 展开 "Deploy to server" 步骤
5. 查看以下关键输出:
   - "当前分支"
   - "拉取最新代码..."
   - "代码更新完成"
   - "最新提交"

## 手动部署命令

如果Actions一直失败，可以手动在服务器上执行:

```bash
# 1. 进入项目目录
cd /home/charonspace

# 2. 拉取最新代码
git pull origin main

# 3. 更新后端依赖
cd backend
pip3 install -r requirements.txt

# 4. 重启后端服务
sudo systemctl restart charonspace-backend

# 5. 更新前端文件
sudo cp -r ../frontend/* /var/www/html/

# 6. 重启Nginx
sudo systemctl restart nginx

# 7. 验证服务
curl http://localhost
sudo systemctl status charonspace-backend
sudo systemctl status nginx
```

## 常见错误和解决方案

### 错误: "fatal: Not possible to fast-forward, aborting"
**原因**: 服务器上有本地提交或冲突

**解决方案**:
```bash
cd /home/charonspace
git fetch origin
git reset --hard origin/main
```

### 错误: "Permission denied"
**原因**: SSH密钥或文件权限问题

**解决方案**:
```bash
# 检查SSH连接
ssh -T git@github.com

# 修改文件权限
sudo chown -R $USER:$USER /home/charonspace
chmod 755 /home/charonspace
```

### 错误: "systemctl: command not found"
**原因**: systemd服务未安装或使用其他init系统

**解决方案**:
```bash
# 手动启动Flask
cd /home/charonspace/backend
nohup python3 app.py > app.log 2>&1 &
```

## 调试技巧

### 1. 查看详细的Actions日志
在 `.github/workflows/deploy.yml` 中已添加详细的调试输出:
- 当前分支
- 拉取最新代码过程
- 最新提交信息
- 数据库检查
- 前端部署详情
- Nginx配置验证

### 2. 在服务器上实时查看日志
```bash
# 后端服务日志
sudo journalctl -u charonspace-backend -f

# Nginx访问日志
sudo tail -f /var/log/nginx/access.log

# Nginx错误日志
sudo tail -f /var/log/nginx/error.log
```

### 3. 测试API接口
```bash
# 测试后端健康检查
curl http://localhost:5001/api/current-user

# 测试前端
curl http://localhost | head -20
```

## 预防措施

1. **定期提交和推送**: 避免服务器上有未提交的修改
2. **使用分支保护**: 在GitHub上设置分支保护规则
3. **监控Actions**: 定期查看Actions运行状态
4. **备份数据**: 定期备份数据库和配置文件
5. **使用版本标签**: 为每次部署打标签，方便回滚

## 已修复的问题 (本次更新)

1. ✅ 修复了Git分支自动检测
2. ✅ 添加了数据库环境变量 DB_NAME
3. ✅ 修复了数据库初始化文件路径
4. ✅ 添加了详细的调试输出
5. ✅ 改进了错误处理

提交这些修改后，下次push应该能正常更新服务器代码了。
