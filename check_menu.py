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
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    cursor.execute("SELECT * FROM menu WHERE name IN ('财务管理', '收款管理') ORDER BY id")
    menus = cursor.fetchall()

    for menu in menus:
        print(f"ID: {menu['id']}, Name: {menu['name']}, Parent: {menu['parent_id']}, Route: {menu['route']}")

except Exception as e:
    print(f"Error: {e}")
finally:
    if cursor:
        cursor.close()
    if connection:
        connection.close()
