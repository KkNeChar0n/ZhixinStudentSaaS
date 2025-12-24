from flask import Flask, jsonify, request, session
from flask_cors import CORS
import pymysql
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key')  # 用于会话加密
CORS(app, supports_credentials=True)  # 配置跨域访问，支持凭证

# 数据库连接配置
db_config = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', 'password'),
    'database': os.environ.get('DB_NAME', 'ZhixinStudentSaas'),
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
        cursor.execute("SELECT username, password, status FROM useraccount ORDER BY username")
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
@app.route('/api/accounts/<username>/status', methods=['PUT'])
def update_account_status(username):
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
        cursor.execute("UPDATE useraccount SET status = %s WHERE username = %s", (status, username))
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
                sx.sex, 
                g.grade, 
                s.phone, 
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
                s.id, s.name, sx.sex, g.grade, s.phone
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
                sx.sex,
                sub.subject,
                c.phone
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
        sex = data.get('sex')
        phone = data.get('phone')
        grade = data.get('grade')
        
        if not student_name or not sex or not phone or not grade:
            return jsonify({'error': '所有字段不能为空'}), 400
            
        connection = get_db_connection()
        cursor = connection.cursor()
        
        # 获取性别ID和年级ID
        cursor.execute("SELECT id FROM sex WHERE sex = %s", (sex,))
        sex_result = cursor.fetchone()
        if not sex_result:
            return jsonify({'error': '性别不存在'}), 400
        sex_id = sex_result[0]
        
        cursor.execute("SELECT id FROM grade WHERE grade = %s", (grade,))
        grade_result = cursor.fetchone()
        if not grade_result:
            return jsonify({'error': '年级不存在'}), 400
        grade_id = grade_result[0]
        
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
        sex = data.get('sex')
        phone = data.get('phone')
        subject = data.get('subject')

        if not coach_name or not sex or not phone or not subject:
            return jsonify({'error': '所有字段不能为空'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 获取性别ID
        cursor.execute("SELECT id FROM sex WHERE sex = %s", (sex,))
        sex_result = cursor.fetchone()
        if not sex_result:
            return jsonify({'error': '性别不存在'}), 400
        sex_id = sex_result[0]

        # 获取学科ID
        cursor.execute("SELECT id FROM subject WHERE subject = %s", (subject,))
        subject_result = cursor.fetchone()
        if not subject_result:
            return jsonify({'error': '学科不存在'}), 400
        subject_id = subject_result[0]

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
        sex = data.get('sex')
        phone = data.get('phone')
        subject = data.get('subject')
        student_ids = data.get('student_ids', [])  # 学生ID列表，非必填

        # 验证必填字段
        if not coach_name or not sex or not phone or not subject:
            return jsonify({'error': '姓名、性别、电话和学科不能为空'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 获取性别ID
        cursor.execute("SELECT id FROM sex WHERE sex = %s", (sex,))
        sex_result = cursor.fetchone()
        if not sex_result:
            return jsonify({'error': '性别不存在'}), 400
        sex_id = sex_result[0]

        # 获取学科ID
        cursor.execute("SELECT id FROM subject WHERE subject = %s", (subject,))
        subject_result = cursor.fetchone()
        if not subject_result:
            return jsonify({'error': '学科不存在'}), 400
        subject_id = subject_result[0]

        # 插入教练信息
        cursor.execute("""
            INSERT INTO coach (name, sex_id, subject_id, phone, status)
            VALUES (%s, %s, %s, %s, '启用')
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
        sex = data.get('sex')
        phone = data.get('phone')
        grade = data.get('grade')
        coach_ids = data.get('coach_ids', [])  # 教练ID列表，非必填

        # 验证必填字段
        if not student_name or not sex or not phone or not grade:
            return jsonify({'error': '姓名、性别、电话和年级不能为空'}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        # 获取性别ID
        cursor.execute("SELECT id FROM sex WHERE sex = %s", (sex,))
        sex_result = cursor.fetchone()
        if not sex_result:
            return jsonify({'error': '性别不存在'}), 400
        sex_id = sex_result[0]

        # 获取年级ID
        cursor.execute("SELECT id FROM grade WHERE grade = %s", (grade,))
        grade_result = cursor.fetchone()
        if not grade_result:
            return jsonify({'error': '年级不存在'}), 400
        grade_id = grade_result[0]

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
