#!/bin/bash
# Flask 后端启动脚本

# 设置数据库环境变量
export DB_HOST='localhost'
export DB_USER='root'
export DB_PASSWORD='qweasd123Q!'
export DB_NAME='zhixinstudentsaas'
export SECRET_KEY='your-secret-key-change-in-production'

# 启动 Flask 应用
cd /Users/charon/ZhixinStudentSaas/backend
python3 app.py
