#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据库更新脚本 - 待认领收款功能
日期: 2026-01-12
说明: 执行数据库更新，添加unclaimed表
"""

import pymysql
import sys
import os
from datetime import datetime

# 数据库配置（从环境变量读取）
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),
    'database': os.environ.get('DB_NAME', 'zhixinstudentsaas'),
    'charset': 'utf8mb4'
}

def backup_reminder():
    """提醒用户备份数据库"""
    print("=" * 60)
    print("⚠️  数据库更新前的重要提醒")
    print("=" * 60)
    print("\n请确保已经备份数据库！")
    print("\n备份命令示例：")
    print(f"mysqldump -u {DB_CONFIG['user']} -p {DB_CONFIG['database']} > backup_$(date +%Y%m%d_%H%M%S).sql")
    print("\n" + "=" * 60)

    response = input("\n是否已完成数据库备份？(yes/no): ").strip().lower()
    if response not in ['yes', 'y']:
        print("❌ 请先备份数据库后再执行更新！")
        sys.exit(1)
    print("✓ 确认已备份，继续执行更新...\n")

def check_table_exists(cursor, table_name):
    """检查表是否已存在"""
    cursor.execute("""
        SELECT COUNT(*) as count
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
        AND table_name = %s
    """, (table_name,))
    result = cursor.fetchone()
    return result['count'] > 0

def create_unclaimed_table(cursor):
    """创建unclaimed表"""
    sql = """
    CREATE TABLE IF NOT EXISTS `unclaimed` (
      `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '待认领ID',
      `payment_method` TINYINT NOT NULL DEFAULT 0 COMMENT '付款方式：0-微信，1-支付宝，2-优利支付，3-零零购支付，9-对公转账',
      `payment_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '付款金额',
      `payer` VARCHAR(100) DEFAULT NULL COMMENT '付款方',
      `payee_entity` TINYINT NOT NULL DEFAULT 0 COMMENT '收款主体：0-北京，1-西安',
      `arrival_time` DATETIME DEFAULT NULL COMMENT '到账时间',
      `claimer` INT DEFAULT NULL COMMENT '认领人ID',
      `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-待认领，1-已认领',
      `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      INDEX `idx_status` (`status`),
      INDEX `idx_payment_method` (`payment_method`),
      INDEX `idx_arrival_time` (`arrival_time`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='待认领收款表'
    """
    cursor.execute(sql)
    print("✓ unclaimed表创建成功")

def verify_update(cursor):
    """验证更新是否成功"""
    print("\n" + "=" * 60)
    print("验证更新结果")
    print("=" * 60)

    # 检查unclaimed表
    if check_table_exists(cursor, 'unclaimed'):
        print("✓ unclaimed表存在")

        # 检查表结构
        cursor.execute("DESCRIBE unclaimed")
        columns = cursor.fetchall()
        print(f"✓ unclaimed表包含 {len(columns)} 个字段")

        # 检查索引
        cursor.execute("SHOW INDEX FROM unclaimed")
        indexes = cursor.fetchall()
        print(f"✓ unclaimed表包含 {len(indexes)} 个索引")

        return True
    else:
        print("✗ unclaimed表不存在")
        return False

def main():
    """主函数"""
    print("\n" + "=" * 60)
    print("数据库更新脚本 - 待认领收款功能")
    print("更新日期: 2026-01-12")
    print("=" * 60 + "\n")

    # 备份提醒
    backup_reminder()

    connection = None
    cursor = None

    try:
        # 连接数据库
        print("正在连接数据库...")
        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        print(f"✓ 已连接到数据库: {DB_CONFIG['database']}\n")

        # 检查表是否已存在
        if check_table_exists(cursor, 'unclaimed'):
            print("⚠️  unclaimed表已存在，跳过创建")
        else:
            print("开始创建unclaimed表...")
            create_unclaimed_table(cursor)

        # 提交事务
        connection.commit()
        print("\n✓ 数据库更新已提交")

        # 验证更新
        if verify_update(cursor):
            print("\n" + "=" * 60)
            print("✓ 数据库更新成功完成！")
            print("=" * 60)
            return 0
        else:
            print("\n" + "=" * 60)
            print("✗ 数据库更新验证失败！")
            print("=" * 60)
            return 1

    except Exception as e:
        print(f"\n✗ 更新失败: {str(e)}")
        if connection:
            connection.rollback()
            print("✓ 已回滚事务")
        return 1

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            print("\n✓ 数据库连接已关闭")

if __name__ == '__main__':
    sys.exit(main())
