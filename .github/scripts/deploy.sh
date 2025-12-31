#!/bin/bash
set -e  # 遇到错误立即退出
set -x  # 显示每一条执行的命令

# 设置项目路径
PROJECT_PATH="/home/charonspace"
FRONTEND_PATH="${PROJECT_PATH}/frontend"
BACKEND_PATH="${PROJECT_PATH}/backend"

echo "=========================================="
echo "开始部署 CharonSpace 项目"
echo "=========================================="

# 确保项目目录存在
mkdir -p "${PROJECT_PATH}"

# 配置GitHub SSH密钥（用于服务器访问GitHub）
echo "=== 配置GitHub SSH密钥 ==="
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 检查是否已存在GitHub deploy key
if [ ! -f ~/.ssh/github_deploy_key ]; then
  echo "生成GitHub SSH密钥..."
  ssh-keygen -t ed25519 -C "github-deploy-key" -f ~/.ssh/github_deploy_key -N ""

  echo "=========================================="
  echo "⚠️ 请将以下公钥添加到GitHub Deploy Keys:"
  echo "=========================================="
  cat ~/.ssh/github_deploy_key.pub
  echo "=========================================="
  echo "访问: https://github.com/KkNeChar0n/ZhixinStudentSaaS/settings/keys"
  echo "点击 'Add deploy key' 并粘贴上面的公钥"
  echo "=========================================="
  exit 1
else
  echo "✅ GitHub SSH密钥已存在"
fi

# 配置SSH config
if ! grep -q "Host github.com" ~/.ssh/config 2>/dev/null; then
  echo "配置SSH config..."
  {
    echo ""
    echo "# GitHub 配置"
    echo "Host github.com"
    echo "    HostName github.com"
    echo "    User git"
    echo "    IdentityFile ~/.ssh/github_deploy_key"
    echo "    StrictHostKeyChecking no"
    echo "    UserKnownHostsFile /dev/null"
  } >> ~/.ssh/config
  chmod 600 ~/.ssh/config
  echo "✅ SSH config 配置完成"
fi

# 设置密钥权限
chmod 600 ~/.ssh/github_deploy_key 2>/dev/null || true
chmod 644 ~/.ssh/github_deploy_key.pub 2>/dev/null || true

# 测试GitHub连接
echo "=== 测试GitHub SSH连接 ==="
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
  echo "✅ GitHub SSH连接正常"
else
  echo "❌ GitHub SSH连接失败"
  ssh -T git@github.com 2>&1 || true
  exit 1
fi

# 检查项目路径
echo "=== 检查项目路径 ==="
echo "项目路径: ${PROJECT_PATH}"
if [ -d "${PROJECT_PATH}" ]; then
  echo "✅ 项目目录存在"
  ls -la "${PROJECT_PATH}" || true
else
  echo "❌ 项目目录不存在: ${PROJECT_PATH}"
fi

# 如果项目已存在，拉取最新代码
echo "=== 检查是否为Git仓库 ==="
if [ -d "${PROJECT_PATH}/.git" ]; then
  echo "✅ 检测到Git仓库"
  echo "尝试进入项目目录: ${PROJECT_PATH}"
  cd "${PROJECT_PATH}" || { echo "❌ 无法进入项目目录"; exit 1; }
  echo "✅ 成功进入目录: $(pwd)"

  echo "=== 更新代码 ==="
  echo "当前分支："
  git branch || { echo "❌ git branch 命令失败"; exit 1; }

  echo "显示当前提交："
  git log -1 --oneline || true

  # 检查是否有本地修改
  if ! git diff-index --quiet HEAD --; then
    echo "检测到本地修改，自动暂存..."
    if git stash push -m "Auto-stash by GitHub Actions $(date +%Y%m%d_%H%M%S)"; then
      echo "✅ 本地修改已暂存"
    else
      echo "⚠️ 暂存失败，尝试重置..."
      git reset --hard HEAD
    fi
  else
    echo "✅ 没有本地修改"
  fi

  echo "拉取最新代码..."
  # 确保使用SSH URL
  CURRENT_REMOTE=$(git config --get remote.origin.url)
  echo "当前remote URL: $CURRENT_REMOTE"
  if [[ "$CURRENT_REMOTE" == https://* ]]; then
    echo "检测到HTTPS URL，切换为SSH URL..."
    git remote set-url origin git@github.com:KkNeChar0n/ZhixinStudentSaaS.git
    echo "✅ 已切换为SSH URL: $(git config --get remote.origin.url)"
  fi

  # 尝试fetch
  echo "执行 git fetch..."
  git fetch origin || { echo "❌ git fetch 失败"; exit 1; }
  echo "✅ git fetch 成功"

  # 自动检测并拉取当前分支
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  echo "当前分支: $CURRENT_BRANCH"

  # 拉取代码
  echo "执行 git pull..."
  if git pull origin "$CURRENT_BRANCH"; then
    echo "✅ 从 $CURRENT_BRANCH 分支拉取成功"
  elif git pull origin main; then
    echo "✅ 从 main 分支拉取成功"
  elif git pull origin master; then
    echo "✅ 从 master 分支拉取成功"
  else
    echo "❌ 代码拉取失败"
    exit 1
  fi

  echo "✅ 代码更新完成"
  echo "最新提交："
  git log -1 --oneline || true
  echo "当前HEAD: $(git rev-parse HEAD)"
  echo "当前HEAD(短): $(git rev-parse --short HEAD)"

else
  echo "❌ 未检测到Git仓库，准备首次克隆"
  echo "=== 首次克隆仓库 ==="

  if git clone git@github.com:KkNeChar0n/ZhixinStudentSaaS.git "${PROJECT_PATH}"; then
    echo "✅ 克隆成功"
    cd "${PROJECT_PATH}" || { echo "❌ 无法进入克隆的项目目录"; exit 1; }
    git log -1 --oneline || true
  else
    echo "❌ 仓库克隆失败"
    exit 1
  fi
fi

# 安装后端依赖
echo "=== 安装后端依赖 ==="
echo "后端路径: ${BACKEND_PATH}"
cd "${BACKEND_PATH}" || { echo "❌ 无法进入后端目录"; exit 1; }
echo "✅ 成功进入后端目录: $(pwd)"

if [ -f "requirements.txt" ]; then
  echo "开始安装Python依赖..."
  pip3 install -r requirements.txt || { echo "⚠️ 依赖安装失败，继续执行"; }
  echo "✅ Python依赖安装完成"
else
  echo "⚠️ 未找到requirements.txt文件"
fi

# 数据库初始化和迁移
echo "=== 检查数据库 ==="
echo "检查数据库是否存在..."
DB_EXISTS=$(mysql -u root -p"qweasd123Q!" -e "SHOW DATABASES LIKE 'zhixinstudentsaas';" 2>&1 | grep zhixinstudentsaas || true)
if [ -z "$DB_EXISTS" ]; then
  echo "⚠️ 数据库不存在，执行初始化..."
  if [ -f "${PROJECT_PATH}/init_database.sql" ]; then
    mysql -u root -p"qweasd123Q!" < "${PROJECT_PATH}/init_database.sql"
    echo "✅ 数据库初始化完成"
  else
    echo "⚠️ init_database.sql 文件不存在"
  fi
else
  echo "✅ 数据库已存在，执行迁移脚本..."
  cd "${PROJECT_PATH}"

  # 执行各个迁移脚本
  for sql_file in add_account_status.sql migrate_status_fields.sql create_order_table.sql create_menu_table.sql create_attribute_table.sql add_product_menu.sql create_classify_table.sql fix_classify_parentid.sql add_classify_menu.sql; do
    if [ -f "${sql_file}" ]; then
      echo "执行 ${sql_file}..."
      mysql -u root -p"qweasd123Q!" < "${sql_file}" 2>&1 || echo "⚠️ ${sql_file} 执行失败或已执行过"
    fi
  done
  echo "✅ 数据库迁移完成"
fi

# 配置systemd服务
echo "=== 配置后端服务 ==="
cat > /tmp/charonspace-backend.service <<SERVICEEOF
[Unit]
Description=CharonSpace Backend Service
After=network.target

[Service]
User=charon
WorkingDirectory=${BACKEND_PATH}
Environment="DB_USER=root"
Environment="DB_PASSWORD=qweasd123Q!"
Environment="DB_HOST=localhost"
Environment="DB_NAME=zhixinstudentsaas"
ExecStart=/usr/bin/python3 ${BACKEND_PATH}/app.py
Restart=always

[Install]
WantedBy=multi-user.target
SERVICEEOF

echo "✅ systemd服务文件已创建"

# 部署服务文件
echo "部署systemd服务..."
sudo mv /tmp/charonspace-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable charonspace-backend
sudo systemctl restart charonspace-backend
echo "✅ 后端服务配置完成"

# 检查服务状态
echo "后端服务状态："
sudo systemctl status charonspace-backend --no-pager || true

# 前端部署
echo "=== 开始前端部署 ==="
echo "前端文件路径：${FRONTEND_PATH}"
ls -la "${FRONTEND_PATH}"

# 确保/var/www/html目录存在
sudo mkdir -p /var/www/html

# 复制前端文件
echo "复制前端文件到/var/www/html..."
sudo cp -r "${FRONTEND_PATH}"/* /var/www/html/
echo "✅ 前端文件复制完成"

# 设置权限
echo "设置文件权限..."
NGINX_USER=$(ps aux | grep nginx | grep -v grep | grep -v root | head -1 | awk '{print $1}')
if [ -z "$NGINX_USER" ]; then
  NGINX_USER="nginx"
fi
echo "Nginx运行用户：$NGINX_USER"
sudo chown -R $NGINX_USER:$NGINX_USER /var/www/html/
echo "✅ 权限设置完成"

# 配置Nginx
echo "=== 配置Nginx ==="
if [ -f "${BACKEND_PATH}/nginx.conf" ]; then
  sudo cp "${BACKEND_PATH}/nginx.conf" /etc/nginx/conf.d/charonspace.conf
  echo "✅ Nginx配置文件已复制"
else
  echo "⚠️ nginx.conf 文件不存在"
fi

# 删除默认配置
if [ -f /etc/nginx/conf.d/default.conf ]; then
  sudo rm /etc/nginx/conf.d/default.conf
  echo "✅ 已删除默认配置"
fi

# 检查Nginx语法
echo "检查Nginx配置语法..."
sudo nginx -t || { echo "❌ Nginx配置语法错误"; exit 1; }

# 重启Nginx服务
echo "重启Nginx服务..."
sudo systemctl restart nginx
echo "✅ Nginx重启完成"

# 检查Nginx服务状态
echo "Nginx服务状态："
sudo systemctl status nginx --no-pager

# 测试访问
echo "=== 测试访问 ==="
curl -s http://localhost | head -30 || echo "⚠️ 本地访问测试失败"

echo "=========================================="
echo "✅✅✅ 部署完成！✅✅✅"
echo "=========================================="
echo "项目路径: ${PROJECT_PATH}"
echo "前端路径: /var/www/html"
echo "后端路径: ${BACKEND_PATH}"
echo "当前代码版本: $(cd ${PROJECT_PATH} && git rev-parse --short HEAD)"
echo "=========================================="
