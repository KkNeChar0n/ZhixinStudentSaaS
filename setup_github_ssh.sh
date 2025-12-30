#!/bin/bash
# GitHub SSH密钥配置脚本
# 用于配置服务器与GitHub的SSH连接

set -e

echo "=== GitHub SSH密钥配置脚本 ==="
echo ""

# 检查是否已存在密钥
if [ -f ~/.ssh/github_deploy_key ]; then
    echo "检测到已存在的GitHub部署密钥"
    read -p "是否要重新生成？(y/n): " REGENERATE
    if [ "$REGENERATE" != "y" ] && [ "$REGENERATE" != "Y" ]; then
        echo "使用现有密钥"
    else
        echo "重新生成密钥..."
        rm -f ~/.ssh/github_deploy_key ~/.ssh/github_deploy_key.pub
    fi
fi

# 生成SSH密钥（如果不存在）
if [ ! -f ~/.ssh/github_deploy_key ]; then
    echo "生成新的SSH密钥..."
    read -p "请输入您的邮箱地址: " EMAIL

    # 创建.ssh目录
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh

    # 生成密钥
    ssh-keygen -t ed25519 -C "$EMAIL" -f ~/.ssh/github_deploy_key -N ""

    echo "✅ SSH密钥生成成功！"
fi

# 配置SSH config
echo ""
echo "配置SSH config文件..."

SSH_CONFIG=~/.ssh/config
if ! grep -q "Host github.com" "$SSH_CONFIG" 2>/dev/null; then
    cat >> "$SSH_CONFIG" << 'EOF'

# GitHub 配置
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_deploy_key
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
EOF
    echo "✅ SSH config 配置完成！"
else
    echo "⚠️  SSH config 中已存在 github.com 配置，跳过"
fi

# 设置权限
chmod 600 ~/.ssh/github_deploy_key
chmod 644 ~/.ssh/github_deploy_key.pub
chmod 600 ~/.ssh/config

# 显示公钥
echo ""
echo "=========================================="
echo "📋 您的GitHub Deploy公钥如下："
echo "=========================================="
cat ~/.ssh/github_deploy_key.pub
echo "=========================================="
echo ""
echo "请按照以下步骤添加到GitHub："
echo "1. 复制上面的公钥内容"
echo "2. 访问 https://github.com/KkNeChar0n/ZhixinStudentSaaS/settings/keys"
echo "3. 点击 'Add deploy key'"
echo "4. 粘贴公钥，标题可以填写: Deploy Key from Server"
echo "5. 如果需要push权限，勾选 'Allow write access'"
echo "6. 点击 'Add key' 保存"
echo ""

# 测试连接
echo "测试GitHub SSH连接..."
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ GitHub SSH连接测试成功！"
else
    echo "⚠️  连接测试结果："
    ssh -T git@github.com 2>&1 || true
    echo ""
    echo "如果看到 'Hi xxx! You've successfully authenticated' 说明配置成功"
    echo "如果提示需要添加公钥，请按照上面的步骤添加到GitHub"
fi

echo ""
echo "=== 配置完成 ==="
echo ""
echo "📝 如果项目已存在HTTPS方式clone的仓库，运行以下命令切换为SSH："
echo "cd /home/charonspace"
echo "git remote set-url origin git@github.com:KkNeChar0n/ZhixinStudentSaaS.git"
echo ""
