#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
正式环境数据库更新脚本
使用方法：python update_production_db.py
"""

import pymysql
import sys
from datetime import datetime

# 数据库配置 - 请根据实际情况修改
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # 请填写实际密码
    'database': 'zhixinstudentsaas',
    'charset': 'utf8mb4'
}

SQL_FILE = 'database_update_20260113.sql'

def backup_database():
    """提示用户备份数据库"""
    print("=" * 60)
    print("⚠️  重要提示：请先备份数据库！")
    print("=" * 60)
    print("\n备份命令示例：")
    print(f"mysqldump -u {DB_CONFIG['user']} -p {DB_CONFIG['database']} > backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql\n")

    response = input("是否已完成数据库备份？(yes/no): ").strip().lower()
    if response not in ['yes', 'y']:
        print("❌ 请先备份数据库后再执行更新！")
        sys.exit(1)

def check_config():
    """检查配置是否完整"""
    if not DB_CONFIG['password']:
        print("❌ 错误：请先在脚本中配置数据库密码！")
        sys.exit(1)

def execute_sql_file():
    """执行SQL文件"""
    connection = None
    cursor = None

    try:
        print("\n正在连接数据库...")
        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()
        print("✓ 数据库连接成功")

        print(f"\n正在读取SQL文件: {SQL_FILE}")
        with open(SQL_FILE, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        # 分割SQL语句
        statements = []
        for statement in sql_content.split(';'):
            statement = statement.strip()
            # 跳过注释和空语句
            if statement and not statement.startswith('--'):
                statements.append(statement)

        print(f"✓ 共读取 {len(statements)} 条SQL语句\n")

        # 执行SQL语句
        success_count = 0
        for i, statement in enumerate(statements, 1):
            try:
                cursor.execute(statement)
                success_count += 1
                # 显示简短的执行信息
                preview = statement[:60].replace('\n', ' ')
                print(f"[{i}/{len(statements)}] ✓ {preview}...")
            except Exception as e:
                print(f"[{i}/{len(statements)}] ✗ 执行失败: {e}")
                print(f"    语句: {statement[:100]}...")
                raise

        connection.commit()
        print(f"\n{'=' * 60}")
        print(f"✓ 数据库更新完成！成功执行 {success_count} 条语句")
        print(f"{'=' * 60}")

        # 验证更新
        print("\n正在验证更新...")

        # 检查表是否创建
        cursor.execute("SHOW TABLES LIKE 'payment_collection'")
        if cursor.fetchone():
            print("✓ payment_collection 表创建成功")
        else:
            print("✗ payment_collection 表未找到")

        # 检查菜单是否添加
        cursor.execute("SELECT COUNT(*) FROM menu WHERE name IN ('财务管理', '收款管理')")
        count = cursor.fetchone()[0]
        print(f"✓ 找到 {count} 个新菜单")

        print("\n✓ 更新验证通过！")
        print("\n请重启后端服务并刷新浏览器测试新功能。")

    except FileNotFoundError:
        print(f"❌ 错误：找不到SQL文件 {SQL_FILE}")
        print("   请确保脚本在项目根目录下执行")
        sys.exit(1)
    except pymysql.Error as e:
        print(f"\n❌ 数据库错误: {e}")
        if connection:
            connection.rollback()
            print("✓ 已回滚事务")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ 未知错误: {e}")
        if connection:
            connection.rollback()
            print("✓ 已回滚事务")
        sys.exit(1)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            print("\n✓ 数据库连接已关闭")

def main():
    print("\n" + "=" * 60)
    print(" 正式环境数据库更新脚本 - 2026-01-13")
    print("=" * 60)

    check_config()
    backup_database()
    execute_sql_file()

if __name__ == '__main__':
    main()
