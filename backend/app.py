from flask import Flask, jsonify, request, session
from flask_cors import CORS
import pymysql
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key')  # 用于会话加密
CORS(app, origins='http://123.56.84.70', supports_credentials=True)  # 配置跨域访问，支持凭证，只允许特定源

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
