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
    'database': 'testconnect251219',
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
        cursor.execute("SELECT username FROM useraccount WHERE username = %s AND password = %s", (username, password))
        user = cursor.fetchone()
        
        if user:
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
        
        # 查询教练列表，包括关联的性别信息
        cursor.execute("""
            SELECT 
                c.id, 
                c.name AS coach_name, 
                sx.sex, 
                c.subject, 
                c.phone
            FROM 
                coach c
            JOIN 
                sex sx ON c.sex_id = sx.id
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
        
        # 更新教练信息
        cursor.execute("""
            UPDATE coach 
            SET name = %s, sex_id = %s, phone = %s, subject = %s 
            WHERE id = %s
        """, (coach_name, sex_id, phone, subject, id))
        
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
