import pymysql

# 数据库连接配置
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'qweasd123Q!',
    'database': 'zhixinstudentsaas',
    'charset': 'utf8mb4'
}

# 创建收款表
create_table_sql = """
CREATE TABLE IF NOT EXISTS `payment_collection` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '收款ID',
  `order_id` INT NOT NULL COMMENT '关联订单ID',
  `student_id` INT NOT NULL COMMENT '学生ID（UID）',
  `payment_scenario` TINYINT NOT NULL DEFAULT 1 COMMENT '付款场景：0-线上，1-线下',
  `payment_method` TINYINT NOT NULL DEFAULT 0 COMMENT '付款方式：0-微信，1-支付宝，2-优利支付，3-零零购支付，9-对公转账',
  `payment_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '付款金额',
  `payer` VARCHAR(100) DEFAULT NULL COMMENT '付款方',
  `payee_entity` TINYINT NOT NULL DEFAULT 0 COMMENT '收款主体：0-北京，1-西安',
  `trading_hours` DATETIME DEFAULT NULL COMMENT '交易时间',
  `arrival_time` DATETIME DEFAULT NULL COMMENT '到账时间',
  `status` TINYINT NOT NULL DEFAULT 10 COMMENT '状态：0-待支付，10-未核验，20-已支付',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_student_id` (`student_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_payment_scenario` (`payment_scenario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收款信息表'
"""

try:
    connection = pymysql.connect(**db_config)
    cursor = connection.cursor()

    # 创建表
    cursor.execute(create_table_sql)
    print("payment_collection 表创建成功")

    # 检查财务管理菜单是否已存在
    cursor.execute("SELECT id FROM menu WHERE name = '财务管理' AND parent_id IS NULL")
    existing = cursor.fetchone()

    if existing:
        parent_id = existing[0]
        print(f"财务管理菜单已存在，ID: {parent_id}")
    else:
        # 插入一级菜单
        cursor.execute("INSERT INTO menu (name, parent_id, route, sort_order) VALUES ('财务管理', NULL, NULL, 8)")
        parent_id = cursor.lastrowid
        print(f"财务管理菜单创建成功，ID: {parent_id}")

    # 检查收款管理二级菜单是否已存在
    cursor.execute("SELECT id FROM menu WHERE name = '收款管理' AND parent_id = %s", (parent_id,))
    sub_existing = cursor.fetchone()

    if sub_existing:
        print(f"收款管理菜单已存在，ID: {sub_existing[0]}")
    else:
        # 插入二级菜单
        cursor.execute("INSERT INTO menu (name, parent_id, route, sort_order) VALUES ('收款管理', %s, 'payment_collection', 1)", (parent_id,))
        print(f"收款管理菜单创建成功，ID: {cursor.lastrowid}")

    connection.commit()
    print("所有操作执行成功！")

except Exception as e:
    print(f"执行失败: {e}")
finally:
    if cursor:
        cursor.close()
    if connection:
        connection.close()
