#!/bin/bash

# 详细的Nginx和前端文件调试脚本
echo "=== Nginx和前端部署调试脚本 ==="
echo "运行时间: $(date)"
echo ""

# 检查Nginx配置文件
echo "1. 检查Nginx配置文件:"
echo "   - 所有配置文件列表:"
sudo ls -la /etc/nginx/

# 检查conf.d目录中的配置文件
echo "   - /etc/nginx/conf.d/ 目录内容:"
sudo ls -la /etc/nginx/conf.d/

# 检查sites-available和sites-enabled目录（如果存在）
if [ -d /etc/nginx/sites-available ]; then
  echo "   - /etc/nginx/sites-available/ 目录内容:"
  sudo ls -la /etc/nginx/sites-available/
fi

if [ -d /etc/nginx/sites-enabled ]; then
  echo "   - /etc/nginx/sites-enabled/ 目录内容:"
  sudo ls -la /etc/nginx/sites-enabled/
fi

echo ""

# 显示我们的Nginx配置内容
echo "2. 查看我们的Nginx配置内容 (/etc/nginx/conf.d/charonspace.conf):"
sudo cat /etc/nginx/conf.d/charonspace.conf 2>/dev/null || echo "   - 配置文件不存在!"

echo ""

# 检查默认Nginx配置
echo "3. 查看默认Nginx配置:"
if [ -f /etc/nginx/nginx.conf ]; then
  echo "   - /etc/nginx/nginx.conf 中的 http 块:"
  sudo grep -A 20 "http {" /etc/nginx/nginx.conf
fi

# 检查默认站点配置
if [ -f /etc/nginx/sites-available/default ]; then
  echo "   - 默认站点配置 (/etc/nginx/sites-available/default):"
  sudo cat /etc/nginx/sites-available/default
elif [ -f /etc/nginx/conf.d/default.conf ]; then
  echo "   - 默认站点配置 (/etc/nginx/conf.d/default.conf):"
  sudo cat /etc/nginx/conf.d/default.conf
fi

echo ""

# 检查前端文件目录
echo "4. 检查前端文件目录 (/var/www/html/):"
echo "   - 目录内容:"
sudo ls -la /var/www/html/

# 检查index.html文件是否存在
echo "   - index.html文件内容（前20行）:"
sudo head -20 /var/www/html/index.html 2>/dev/null || echo "   - index.html文件不存在!"

echo ""

# 检查文件权限
echo "5. 检查前端文件权限:"
echo "   - /var/www/html/ 目录权限:"
ls -ld /var/www/html/

echo "   - 前端文件权限:"
sudo ls -la /var/www/html/ | grep -E "(index.html|app.js|styles.css)"

echo ""

# 检查Nginx服务状态
echo "6. 检查Nginx服务状态:"
sudo systemctl status nginx --no-pager

echo ""

# 检查Nginx错误日志
echo "7. 查看Nginx错误日志（最近10行）:"
sudo tail -10 /var/log/nginx/error.log 2>/dev/null || echo "   - 无法读取错误日志"

echo ""

# 检查Nginx访问日志
echo "8. 查看Nginx访问日志（最近10行）:"
sudo tail -10 /var/log/nginx/access.log 2>/dev/null || echo "   - 无法读取访问日志"

echo ""

# 检查后端服务状态
echo "9. 检查后端服务状态:"
sudo systemctl status charonspace-backend --no-pager

echo ""

echo "=== 调试完成 ==="
