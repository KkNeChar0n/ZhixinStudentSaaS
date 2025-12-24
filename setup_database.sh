#!/bin/bash
# 数据库快速部署脚本
# 用于在服务器上快速创建和配置ZhixinStudentSaas数据库

set -e  # 遇到错误立即退出

echo "=== ZhixinStudentSaas 数据库部署脚本 ==="
echo ""

# 检查参数
if [ "$#" -lt 1 ]; then
    echo "使用方法: $0 <MySQL密码> [用户名]"
    echo "示例: $0 your_password root"
    exit 1
fi

DB_PASSWORD=$1
DB_USER=${2:-root}
DB_NAME="ZhixinStudentSaas"

echo "数据库配置:"
echo "  用户名: $DB_USER"
echo "  数据库名: $DB_NAME"
echo ""

# 1. 创建数据库
echo "[1/3] 创建数据库..."
mysql -u$DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✓ 数据库创建成功"
else
    echo "✗ 数据库创建失败"
    exit 1
fi

# 2. 执行迁移脚本
echo "[2/3] 执行数据库迁移脚本..."
if [ -f "database_migration.sql" ]; then
    mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME < database_migration.sql 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✓ 迁移脚本执行成功"
    else
        echo "✗ 迁移脚本执行失败"
        exit 1
    fi
else
    echo "⚠ 未找到 database_migration.sql 文件,跳过迁移"
fi

# 3. 验证表结构
echo "[3/3] 验证数据库表..."
TABLE_COUNT=$(mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ $TABLE_COUNT -gt 1 ]; then
    echo "✓ 数据库包含 $((TABLE_COUNT-1)) 个表"
    echo ""
    echo "表列表:"
    mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME -e "SHOW TABLES;" 2>/dev/null
else
    echo "⚠ 数据库中没有表"
fi

echo ""
echo "=== 部署完成 ==="
echo ""
echo "下一步:"
echo "1. 设置环境变量:"
echo "   export DB_HOST=localhost"
echo "   export DB_USER=$DB_USER"
echo "   export DB_PASSWORD=$DB_PASSWORD"
echo "   export DB_NAME=$DB_NAME"
echo ""
echo "2. 启动Flask应用:"
echo "   cd backend"
echo "   python app.py"
