# -*- coding: utf-8 -*-
import pymysql

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'qweasd123Q!',
    'database': 'zhixinstudentsaas',
    'charset': 'utf8mb4'
}

try:
    connection = pymysql.connect(**db_config)
    cursor = connection.cursor()

    # 更新菜单名称
    cursor.execute("UPDATE menu SET name = '财务管理' WHERE id = 26")
    cursor.execute("UPDATE menu SET name = '收款管理' WHERE id = 27")

    connection.commit()
    print("Menu names updated successfully!")

except Exception as e:
    print(f"Error: {e}")
finally:
    if cursor:
        cursor.close()
    if connection:
        connection.close()
