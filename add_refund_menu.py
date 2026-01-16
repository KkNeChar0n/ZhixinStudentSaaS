#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
添加退款订单菜单脚本
"""
import pymysql
import sys

def add_refund_menu():
    try:
        # 连接数据库（使用与app.py相同的配置）
        conn = pymysql.connect(
            host='localhost',
            user='root',
            password='password',
            database='zhixinstudentsaas',
            charset='utf8mb4'
        )
        cursor = conn.cursor()

        print("成功连接到数据库")

        # 检查菜单是否已存在
        cursor.execute("""
            SELECT COUNT(*) FROM menu
            WHERE name = '退款订单' AND route = 'refund_orders'
        """)
        count = cursor.fetchone()[0]

        if count > 0:
            print("退款订单菜单已存在，无需重复添加")
            cursor.close()
            conn.close()
            return

        # 查找订单管理的菜单ID并插入退款订单菜单
        cursor.execute("""
            INSERT INTO `menu` (`name`, `parent_id`, `route`, `sort_order`)
            SELECT '退款订单', id, 'refund_orders', 3
            FROM menu
            WHERE name = '订单管理' AND parent_id IS NULL
            LIMIT 1
        """)

        conn.commit()
        print(f"成功添加退款订单菜单，影响行数: {cursor.rowcount}")

        # 验证插入结果
        cursor.execute("""
            SELECT
                m1.id AS menu1_id,
                m1.name AS menu1_name,
                m2.id AS menu2_id,
                m2.name AS menu2_name,
                m2.route AS route,
                m2.sort_order AS sort_order
            FROM menu m1
            LEFT JOIN menu m2 ON m1.id = m2.parent_id
            WHERE m1.name = '订单管理'
            ORDER BY m2.sort_order
        """)

        results = cursor.fetchall()
        print("\n订单管理菜单结构:")
        print("=" * 80)
        print(f"{'一级菜单ID':<12} {'一级菜单':<12} {'二级菜单ID':<12} {'二级菜单':<12} {'路由':<18} {'排序':<6}")
        print("-" * 80)
        for row in results:
            print(f"{row[0]:<12} {row[1]:<12} {row[2] or '':<12} {row[3] or '':<12} {row[4] or '':<18} {row[5] or '':<6}")
        print("=" * 80)

        cursor.close()
        conn.close()
        print("\n菜单添加成功！")

    except pymysql.Error as e:
        print(f"数据库错误: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"错误: {e}")
        sys.exit(1)

if __name__ == '__main__':
    add_refund_menu()
