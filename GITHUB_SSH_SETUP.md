# GitHub SSH 配置指南

本文档说明如何在服务器上配置GitHub SSH密钥，以解决HTTPS连接超时问题。

## 问题说明

GitHub Actions部署时出现以下错误：
```
fatal: unable to access 'https://github.com/...': Failed to connect to github.com port 443: Connection timed out
```

这是因为服务器网络环境无法稳定访问GitHub的HTTPS端口（443），改用SSH方式（22端口）可以解决此问题。

## 快速配置（推荐）

### 方法一：使用自动配置脚本

1. **下载并运行配置脚本**

```bash
# 在服务器上执行
cd ~
wget https://raw.githubusercontent.com/KkNeChar0n/ZhixinStudentSaaS/main/setup_github_ssh.sh
chmod +x setup_github_ssh.sh
./setup_github_ssh.sh
```

2. **按照脚本提示添加公钥到GitHub**
   - 脚本会显示生成的公钥
   - 访问 https://github.com/KkNeChar0n/ZhixinStudentSaaS/settings/keys
   - 点击 "Add deploy key"
   - 粘贴公钥并保存

3. **如果项目已存在，切换remote URL**

```bash
cd /home/charonspace
git remote set-url origin git@github.com:KkNeChar0n/ZhixinStudentSaaS.git
```

## 手动配置步骤

### 1. 生成SSH密钥

```bash
# 在服务器上执行
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/github_deploy_key
```

按提示操作（直接回车跳过密码设置）

### 2. 查看公钥

```bash
cat ~/.ssh/github_deploy_key.pub
```

复制输出的内容。

### 3. 添加公钥到GitHub

1. 访问仓库的Deploy Keys页面：
   https://github.com/KkNeChar0n/ZhixinStudentSaaS/settings/keys

2. 点击 **"Add deploy key"**

3. 填写表单：
   - **Title**: `Deploy Key from Server`（或任意名称）
   - **Key**: 粘贴刚才复制的公钥
   - **Allow write access**: 不需要勾选（只需要读权限）

4. 点击 **"Add key"** 保存

### 4. 配置SSH config

```bash
cat >> ~/.ssh/config << 'EOF'

# GitHub 配置
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_deploy_key
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
EOF
```

### 5. 设置正确的权限

```bash
chmod 600 ~/.ssh/github_deploy_key
chmod 644 ~/.ssh/github_deploy_key.pub
chmod 600 ~/.ssh/config
```

### 6. 测试连接

```bash
ssh -T git@github.com
```

成功的话会看到类似消息：
```
Hi xxx! You've successfully authenticated, but GitHub does not provide shell access.
```

### 7. 切换现有仓库为SSH方式

如果项目目录已存在（使用HTTPS克隆的），需要切换remote URL：

```bash
cd /home/charonspace
git remote set-url origin git@github.com:KkNeChar0n/ZhixinStudentSaaS.git
git remote -v  # 验证URL已更改
```

## 验证配置

配置完成后，可以测试拉取代码：

```bash
cd /home/charonspace
git fetch origin
git pull origin main
```

如果没有报错，说明配置成功！

## 常见问题

### Q: 提示 "Permission denied (publickey)"

**A**: 检查以下几点：
1. 公钥是否正确添加到GitHub
2. SSH config文件中的IdentityFile路径是否正确
3. 私钥文件权限是否为600

```bash
ls -l ~/.ssh/github_deploy_key  # 应该显示 -rw-------
```

### Q: 仍然提示连接超时

**A**: 可能是服务器防火墙阻止了SSH端口（22），尝试：

```bash
# 测试22端口是否可达
nc -zv github.com 22
# 或
telnet github.com 22
```

如果22端口也无法访问，需要联系服务器管理员或网络管理员。

### Q: GitHub Actions还是失败

**A**: 确保：
1. 服务器上的SSH密钥已配置
2. 已经将最新的workflow代码推送到GitHub
3. 如果项目已存在，已切换为SSH URL

可以手动在服务器上测试：
```bash
cd /home/charonspace
git fetch origin  # 应该成功
```

## 技术说明

- **HTTPS方式**: 使用443端口，容易被防火墙拦截
- **SSH方式**: 使用22端口，通常更稳定
- **Deploy Key**: 只读密钥，更安全（不需要完整的账号权限）

## 回退到HTTPS（如果需要）

如果想回退到HTTPS方式：

```bash
cd /home/charonspace
git remote set-url origin https://github.com/KkNeChar0n/ZhixinStudentSaaS.git
```

但需要配置GitHub Personal Access Token来进行身份验证。
