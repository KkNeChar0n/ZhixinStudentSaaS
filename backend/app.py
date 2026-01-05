from flask import Flask, jsonify, request, session
from flask_cors import CORS
import pymysql
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key')  # 用于会话加密
app.config['JSON_AS_ASCII'] = False  # 确保JSON响应不转义中文
CORS(app, supports_credentials=True)  # 配置跨域访问，支持凭证

# 数据库连接配置
db_config = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', 'password'),
    'database': os.environ.get('DB_NAME', 'zhixinstudentsaas'),
    'charset': 'utf8mb4'
}

# 创建数据库连接
def get_db_connection():
    connection = pymysql.connect(**db_config)
    return connection

# API接口：用户登录
@app.route('/api/login', methods=['POST'])
def login():
    connection = None
    cursor = None
    try:
        # 获取请求参数
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': '用户名和密码不能为空'}), 400
            
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        
        # 查询用户
        cursor.execute("SELECT username, status FROM useraccount WHERE username = %s AND password = %s", (username, password))
        user = cursor.fetchone()

        if user:
            # 检查账号状态
            if user['status'] == 1:
                return jsonify({'error': '该账号已被禁用'}), 403
            # 登录成功，保存到会话
            session['username'] = user['username']
            return jsonify({'message': '登录成功', 'username': user['username']}), 200
        else:
            return jsonify({'error': '用户名或密码错误'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：获取当前登录用户信息
@app.route('/api/profile', methods=['GET'])
def get_profile():
    if 'username' in session:
        return jsonify({'username': session['username']}), 200
    else:
        return jsonify({'error': '未登录'}), 401

# API接口：用户登出
@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'message': '登出成功'}), 200

# API接口：获取账号列表
@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 查询所有账号
        cursor.execute("SELECT id, username, password, status FROM useraccount ORDER BY id")
        accounts = cursor.fetchall()

        return jsonify({'accounts': accounts}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：更新账号状态
@app.route('/api/accounts/<int:id>/status', methods=['PUT'])
def update_account_status(id):
    connection = None
    cursor = None
    try:
        data = request.get_json()
        status = data.get('status')

        if status not in [0, 1]:
            return jsonify({'error': '状态值必须为0或1'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 更新账号状态
        cursor.execute("UPDATE useraccount SET status = %s WHERE id = %s", (status, id))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': '账号不存在'}), 404

        return jsonify({'message': '状态更新成功'}), 200
    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：获取学生列表
@app.route('/api/students', methods=['GET'])
def get_students():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        
        # 查询学生列表，包括关联的性别、年级和教练信息
        cursor.execute("""
            SELECT
                s.id,
                s.name AS student_name,
                s.sex_id,
                sx.name AS sex,
                s.grade_id,
                g.name AS grade,
                s.phone,
                s.status,
                GROUP_CONCAT(c.name SEPARATOR ', ') AS coach_names
            FROM
                student s
            JOIN
                sex sx ON s.sex_id = sx.id
            JOIN
                grade g ON s.grade_id = g.id
            LEFT JOIN
                student_coach sc ON s.id = sc.student_id
            LEFT JOIN
                coach c ON sc.coach_id = c.id
            GROUP BY
                s.id, s.name, s.sex_id, sx.name, s.grade_id, g.name, s.phone, s.status
        """)
        
        students = cursor.fetchall()
        return jsonify({'students': students}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：获取性别列表
@app.route('/api/sexes', methods=['GET'])
def get_sexes():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        cursor.execute("SELECT id, name FROM sex ORDER BY id")
        sexes = cursor.fetchall()

        return jsonify({'sexes': sexes}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：获取启用的年级列表
@app.route('/api/grades/active', methods=['GET'])
def get_active_grades():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 查询状态为启用(0)的年级
        cursor.execute("SELECT id, name AS grade FROM grade WHERE status = 0 ORDER BY id")
        grades = cursor.fetchall()

        return jsonify({'grades': grades}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：获取启用的学科列表
@app.route('/api/subjects/active', methods=['GET'])
def get_active_subjects():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 查询状态为启用(0)的学科
        cursor.execute("SELECT id, subject FROM subject WHERE status = 0 ORDER BY id")
        subjects = cursor.fetchall()

        return jsonify({'subjects': subjects}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：获取教练列表
@app.route('/api/coaches', methods=['GET'])
def get_coaches():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 查询教练列表，包括关联的性别和学科信息
        cursor.execute("""
            SELECT
                c.id,
                c.name AS coach_name,
                c.sex_id,
                sx.name AS sex,
                c.subject_id,
                sub.subject,
                c.phone,
                c.status
            FROM
                coach c
            JOIN
                sex sx ON c.sex_id = sx.id
            JOIN
                subject sub ON c.subject_id = sub.id
        """)

        coaches = cursor.fetchall()
        return jsonify({'coaches': coaches}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：更新学生信息
@app.route('/api/students/<int:id>', methods=['PUT'])
def update_student(id):
    connection = None
    cursor = None
    try:
        data = request.get_json()
        student_name = data.get('student_name')
        sex_id = data.get('sex_id')
        phone = data.get('phone')
        grade_id = data.get('grade_id')

        if not student_name or sex_id is None or not phone or grade_id is None:
            return jsonify({'error': '所有字段不能为空'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 更新学生信息
        cursor.execute("""
            UPDATE student
            SET name = %s, sex_id = %s, phone = %s, grade_id = %s
            WHERE id = %s
        """, (student_name, sex_id, phone, grade_id, id))

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': '学生不存在'}), 404

        return jsonify({'message': '学生信息更新成功'}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：更新学生状态
@app.route('/api/students/<int:id>/status', methods=['PUT'])
def update_student_status(id):
    connection = None
    cursor = None
    try:
        data = request.get_json()
        status = data.get('status')

        if status not in [0, 1]:
            return jsonify({'error': '状态值必须为0或1'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 更新学生状态
        cursor.execute("UPDATE student SET status = %s WHERE id = %s", (status, id))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': '学生不存在'}), 404

        return jsonify({'message': '状态更新成功'}), 200
    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：删除学生
@app.route('/api/students/<int:id>', methods=['DELETE'])
def delete_student(id):
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        # 删除学生与教练的关联
        cursor.execute("DELETE FROM student_coach WHERE student_id = %s", (id,))
        
        # 删除学生
        cursor.execute("DELETE FROM student WHERE id = %s", (id,))
        
        connection.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'error': '学生不存在'}), 404
            
        return jsonify({'message': '学生删除成功'}), 200
        
    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：更新教练信息
@app.route('/api/coaches/<int:id>', methods=['PUT'])
def update_coach(id):
    connection = None
    cursor = None
    try:
        data = request.get_json()
        coach_name = data.get('coach_name')
        sex_id = data.get('sex_id')
        phone = data.get('phone')
        subject_id = data.get('subject_id')

        if not coach_name or sex_id is None or not phone or subject_id is None:
            return jsonify({'error': '所有字段不能为空'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 更新教练信息
        cursor.execute("""
            UPDATE coach
            SET name = %s, sex_id = %s, phone = %s, subject_id = %s
            WHERE id = %s
        """, (coach_name, sex_id, phone, subject_id, id))

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': '教练不存在'}), 404

        return jsonify({'message': '教练信息更新成功'}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：更新教练状态
@app.route('/api/coaches/<int:id>/status', methods=['PUT'])
def update_coach_status(id):
    connection = None
    cursor = None
    try:
        data = request.get_json()
        status = data.get('status')

        if status not in [0, 1]:
            return jsonify({'error': '状态值必须为0或1'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 更新教练状态
        cursor.execute("UPDATE coach SET status = %s WHERE id = %s", (status, id))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': '教练不存在'}), 404

        return jsonify({'message': '状态更新成功'}), 200
    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：删除教练
@app.route('/api/coaches/<int:id>', methods=['DELETE'])
def delete_coach(id):
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # 删除教练与学生的关联
        cursor.execute("DELETE FROM student_coach WHERE coach_id = %s", (id,))

        # 删除教练
        cursor.execute("DELETE FROM coach WHERE id = %s", (id,))

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': '教练不存在'}), 404

        return jsonify({'message': '教练删除成功'}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：获取启用状态的教练列表
@app.route('/api/coaches/active', methods=['GET'])
def get_active_coaches():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 查询启用状态的教练列表
        cursor.execute("""
            SELECT
                c.id,
                c.name AS coach_name
            FROM
                coach c
            WHERE
                c.status = '启用'
        """)

        coaches = cursor.fetchall()
        return jsonify({'coaches': coaches}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：获取启用状态的学生列表
@app.route('/api/students/active', methods=['GET'])
def get_active_students():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 查询启用状态的学生列表
        cursor.execute("""
            SELECT
                s.id,
                s.name AS student_name
            FROM
                student s
            WHERE
                s.status = '启用'
        """)

        students = cursor.fetchall()
        return jsonify({'students': students}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：新增教练
@app.route('/api/coaches', methods=['POST'])
def add_coach():
    connection = None
    cursor = None
    try:
        data = request.get_json()
        coach_name = data.get('coach_name')
        sex_id = data.get('sex_id')
        phone = data.get('phone')
        subject_id = data.get('subject_id')
        student_ids = data.get('student_ids', [])  # 学生ID列表，非必填

        # 验证必填字段
        if not coach_name or sex_id is None or not phone or subject_id is None:
            return jsonify({'error': '姓名、性别、电话和学科不能为空'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 插入教练信息
        cursor.execute("""
            INSERT INTO coach (name, sex_id, subject_id, phone, status)
            VALUES (%s, %s, %s, %s, 0)
        """, (coach_name, sex_id, subject_id, phone))

        coach_id = cursor.lastrowid

        # 如果有选择学生，插入学生与教练的关联
        if student_ids:
            for student_id in student_ids:
                cursor.execute("""
                    INSERT INTO student_coach (student_id, coach_id)
                    VALUES (%s, %s)
                """, (student_id, coach_id))

        connection.commit()

        return jsonify({'message': '教练添加成功', 'coach_id': coach_id}), 201

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：新增学生
@app.route('/api/students', methods=['POST'])
def add_student():
    connection = None
    cursor = None
    try:
        data = request.get_json()
        student_name = data.get('student_name')
        sex_id = data.get('sex_id')
        phone = data.get('phone')
        grade_id = data.get('grade_id')
        coach_ids = data.get('coach_ids', [])  # 教练ID列表，非必填

        # 验证必填字段
        if not student_name or sex_id is None or not phone or grade_id is None:
            return jsonify({'error': '姓名、性别、电话和年级不能为空'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 插入学生信息
        cursor.execute("""
            INSERT INTO student (name, sex_id, grade_id, phone)
            VALUES (%s, %s, %s, %s)
        """, (student_name, sex_id, grade_id, phone))

        student_id = cursor.lastrowid

        # 如果有选择教练，插入学生与教练的关联
        if coach_ids:
            for coach_id in coach_ids:
                cursor.execute("""
                    INSERT INTO student_coach (student_id, coach_id)
                    VALUES (%s, %s)
                """, (student_id, coach_id))

        connection.commit()

        return jsonify({'message': '学生添加成功', 'student_id': student_id}), 201

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# ==================== 订单管理API ====================

# API接口：获取订单列表
@app.route('/api/orders', methods=['GET'])
def get_orders():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 查询订单列表，关联学生信息
        cursor.execute("""
            SELECT
                o.id,
                o.student_id AS uid,
                s.name AS student_name,
                o.amount_receivable,
                o.amount_received,
                o.create_time,
                o.status
            FROM
                `orders` o
            JOIN
                student s ON o.student_id = s.id
            ORDER BY
                o.create_time DESC
        """)

        orders = cursor.fetchall()
        return jsonify({'orders': orders}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：新增订单
@app.route('/api/orders', methods=['POST'])
def create_order():
    connection = None
    cursor = None
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        amount_receivable = data.get('amount_receivable')

        if not student_id or not amount_receivable:
            return jsonify({'error': '学生ID和应收金额不能为空'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 插入订单数据，状态默认为10（草稿）
        cursor.execute("""
            INSERT INTO `orders` (student_id, amount_receivable, status)
            VALUES (%s, %s, 10)
        """, (student_id, amount_receivable))

        connection.commit()
        order_id = cursor.lastrowid

        return jsonify({'message': '订单创建成功', 'order_id': order_id}), 201

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：更新订单
@app.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    connection = None
    cursor = None
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        amount_receivable = data.get('amount_receivable')

        if not student_id or not amount_receivable:
            return jsonify({'error': '学生ID和应收金额不能为空'}), 400

        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 检查订单状态是否为草稿
        cursor.execute("SELECT status FROM `orders` WHERE id = %s", (order_id,))
        order = cursor.fetchone()

        if not order:
            return jsonify({'error': '订单不存在'}), 404

        if order['status'] != 10:
            return jsonify({'error': '只能编辑草稿状态的订单'}), 400

        # 更新订单
        cursor.execute("""
            UPDATE `orders`
            SET student_id = %s, amount_receivable = %s
            WHERE id = %s
        """, (student_id, amount_receivable, order_id))

        connection.commit()

        return jsonify({'message': '订单更新成功'}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：作废订单
@app.route('/api/orders/<int:order_id>/cancel', methods=['PUT'])
def cancel_order(order_id):
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 检查订单状态是否为草稿
        cursor.execute("SELECT status FROM `orders` WHERE id = %s", (order_id,))
        order = cursor.fetchone()

        if not order:
            return jsonify({'error': '订单不存在'}), 404

        if order['status'] != 10:
            return jsonify({'error': '只能作废草稿状态的订单'}), 400

        # 将订单状态更新为99（已作废）
        cursor.execute("""
            UPDATE `orders`
            SET status = 99
            WHERE id = %s
        """, (order_id,))

        connection.commit()

        return jsonify({'message': '订单已作废'}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# ==================== 属性管理API ====================

# API接口：获取属性列表
@app.route('/api/attributes', methods=['GET'])
def get_attributes():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 查询所有属性
        cursor.execute("""
            SELECT id, name, classify, status, create_time, update_time
            FROM attribute
            ORDER BY id DESC
        """)
        attributes = cursor.fetchall()

        return jsonify({'attributes': attributes}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：新增属性
@app.route('/api/attributes', methods=['POST'])
def create_attribute():
    connection = None
    cursor = None
    try:
        data = request.get_json()
        name = data.get('name')
        classify = data.get('classify')

        if not name or classify is None:
            return jsonify({'error': '名称和分类不能为空'}), 400

        if classify not in [0, 1]:
            return jsonify({'error': '分类值必须为0或1'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 插入属性数据，状态默认为0（启用）
        cursor.execute("""
            INSERT INTO attribute (name, classify, status)
            VALUES (%s, %s, 0)
        """, (name, classify))

        connection.commit()
        attribute_id = cursor.lastrowid

        return jsonify({'message': '属性创建成功', 'attribute_id': attribute_id}), 201

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：更新属性
@app.route('/api/attributes/<int:attribute_id>', methods=['PUT'])
def update_attribute(attribute_id):
    connection = None
    cursor = None
    try:
        data = request.get_json()
        name = data.get('name')
        classify = data.get('classify')

        if not name or classify is None:
            return jsonify({'error': '名称和分类不能为空'}), 400

        if classify not in [0, 1]:
            return jsonify({'error': '分类值必须为0或1'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 更新属性
        cursor.execute("""
            UPDATE attribute
            SET name = %s, classify = %s
            WHERE id = %s
        """, (name, classify, attribute_id))

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': '属性不存在'}), 404

        return jsonify({'message': '属性更新成功'}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：更新属性状态
@app.route('/api/attributes/<int:attribute_id>/status', methods=['PUT'])
def update_attribute_status(attribute_id):
    connection = None
    cursor = None
    try:
        data = request.get_json()
        status = data.get('status')

        if status not in [0, 1]:
            return jsonify({'error': '状态值必须为0或1'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 更新属性状态
        cursor.execute("""
            UPDATE attribute
            SET status = %s
            WHERE id = %s
        """, (status, attribute_id))

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': '属性不存在'}), 404

        return jsonify({'message': '状态更新成功'}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# ==================== 类型管理API ====================

# API接口：获取类型列表
@app.route('/api/classifies', methods=['GET'])
def get_classifies():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 查询所有类型，关联父级名称
        cursor.execute("""
            SELECT c.id, c.name, c.level, c.parentid AS parent_id, c.status,
                   p.name AS parent_name
            FROM classify c
            LEFT JOIN classify p ON c.parentid = p.id
            ORDER BY c.level ASC, c.id DESC
        """)
        classifies = cursor.fetchall()

        return jsonify({'classifies': classifies}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：获取启用的一级类型列表（用于新增/编辑二级类型时选择父级）
@app.route('/api/classifies/parents', methods=['GET'])
def get_parent_classifies():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 查询状态为启用(0)且级别为一级(0)的类型
        cursor.execute("""
            SELECT id, name
            FROM classify
            WHERE status = 0 AND level = 0
            ORDER BY id ASC
        """)
        parents = cursor.fetchall()

        return jsonify({'parents': parents}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：新增类型
@app.route('/api/classifies', methods=['POST'])
def create_classify():
    connection = None
    cursor = None
    try:
        data = request.get_json()
        name = data.get('name')
        level = data.get('level')
        parent_id = data.get('parent_id')

        if not name or level is None:
            return jsonify({'error': '名称和级别不能为空'}), 400

        if level not in [0, 1]:
            return jsonify({'error': '级别值必须为0或1'}), 400

        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 校验名称是否重复
        if level == 0:
            # 一级类型：检查一级类型中名称是否已存在
            cursor.execute("""
                SELECT id FROM classify WHERE name = %s AND level = 0
            """, (name,))
            existing = cursor.fetchone()
            if existing:
                return jsonify({'error': '该一级类型名称已存在'}), 400
            parent_id = None  # 一级类型没有父级
        else:
            # 二级类型：检查同一父级下是否有同名的二级类型
            if not parent_id:
                return jsonify({'error': '二级类型必须选择父级类型'}), 400
            cursor.execute("""
                SELECT id FROM classify WHERE name = %s AND level = 1 AND parentid = %s
            """, (name, parent_id))
            existing = cursor.fetchone()
            if existing:
                return jsonify({'error': '该父级类型下已存在同名的二级类型'}), 400

        # 插入类型数据
        cursor.execute("""
            INSERT INTO classify (name, level, parentid, status)
            VALUES (%s, %s, %s, 0)
        """, (name, level, parent_id))

        connection.commit()
        classify_id = cursor.lastrowid

        return jsonify({'message': '类型创建成功', 'classify_id': classify_id}), 201

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：更新类型
@app.route('/api/classifies/<int:classify_id>', methods=['PUT'])
def update_classify(classify_id):
    connection = None
    cursor = None
    try:
        data = request.get_json()
        name = data.get('name')
        level = data.get('level')
        parent_id = data.get('parent_id')

        if not name or level is None:
            return jsonify({'error': '名称和级别不能为空'}), 400

        if level not in [0, 1]:
            return jsonify({'error': '级别值必须为0或1'}), 400

        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 检查类型是否存在
        cursor.execute("SELECT id, level FROM classify WHERE id = %s", (classify_id,))
        existing = cursor.fetchone()
        if not existing:
            return jsonify({'error': '类型不存在'}), 404

        # 校验名称是否重复（排除自身）
        if level == 0:
            # 一级类型：检查一级类型中名称是否已存在
            cursor.execute("""
                SELECT id FROM classify WHERE name = %s AND level = 0 AND id != %s
            """, (name, classify_id))
            duplicate = cursor.fetchone()
            if duplicate:
                return jsonify({'error': '该一级类型名称已存在'}), 400
            parent_id = None  # 一级类型没有父级
        else:
            # 二级类型：检查同一父级下是否有同名的二级类型
            if not parent_id:
                return jsonify({'error': '二级类型必须选择父级类型'}), 400
            cursor.execute("""
                SELECT id FROM classify WHERE name = %s AND level = 1 AND parentid = %s AND id != %s
            """, (name, parent_id, classify_id))
            duplicate = cursor.fetchone()
            if duplicate:
                return jsonify({'error': '该父级类型下已存在同名的二级类型'}), 400

        # 更新类型
        cursor.execute("""
            UPDATE classify
            SET name = %s, level = %s, parentid = %s
            WHERE id = %s
        """, (name, level, parent_id, classify_id))

        connection.commit()

        return jsonify({'message': '类型更新成功'}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# API接口：更新类型状态
@app.route('/api/classifies/<int:classify_id>/status', methods=['PUT'])
def update_classify_status(classify_id):
    connection = None
    cursor = None
    try:
        data = request.get_json()
        status = data.get('status')

        if status not in [0, 1]:
            return jsonify({'error': '状态值必须为0或1'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 更新类型状态
        cursor.execute("""
            UPDATE classify
            SET status = %s
            WHERE id = %s
        """, (status, classify_id))

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': '类型不存在'}), 404

        return jsonify({'message': '状态更新成功'}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# ==================== 菜单管理API ====================

@app.route('/api/menus', methods=['GET'])
def get_menus():
    """获取菜单树结构"""
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # 获取所有菜单项，按sort_order排序
        cursor.execute("""
            SELECT id, name, parent_id, route, sort_order
            FROM menu
            ORDER BY sort_order ASC
        """)
        all_menus = cursor.fetchall()

        # 构建树形结构
        menu_tree = []
        menu_map = {}

        # 先创建所有菜单项的映射
        for menu in all_menus:
            menu_map[menu['id']] = {
                'id': menu['id'],
                'name': menu['name'],
                'route': menu['route'],
                'parent_id': menu['parent_id'],
                'sort_order': menu['sort_order'],
                'children': []
            }

        # 构建父子关系
        for menu in all_menus:
            if menu['parent_id'] is None:
                # 一级菜单
                menu_tree.append(menu_map[menu['id']])
            else:
                # 二级菜单，添加到父菜单的children中
                if menu['parent_id'] in menu_map:
                    menu_map[menu['parent_id']]['children'].append(menu_map[menu['id']])

        return jsonify({'menus': menu_tree}), 200

    except Exception as e:
        print(f"获取菜单失败: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
