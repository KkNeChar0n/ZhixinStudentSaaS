# 修复登录错误 - status 字段不存在

## 错误信息
```
(1054, "Unknown column 'status' in 'field list'")
```

## 原因
正式环境（阿里云服务器）的数据库中 `useraccount` 表还没有 `status` 字段，但代码已经更新到使用这个字段。

## 立即修��方案（在服务器上执行）

### 方法1: 使用迁移脚本（推荐）

SSH登录阿里云服务器，执行：

```bash
# 1. 进入项目目录
cd /home/charonspace

# 2. 确保代码是最新的
git stash
git pull origin main

# 3. 执行数据库迁移脚本
mysql -u root -p"qweasd123Q!" < add_account_status.sql

# 4. 验证字段已添加
mysql -u root -p"qweasd123Q!" ZhixinStudentSaas -e "DESC useraccount"

# 5. 重启后端服务
sudo systemctl restart charonspace-backend

# 6. 测试登录
curl -X POST http://localhost:5001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"charon","password":"123456"}'
```

### 方法2: 手动添加字段

如果迁移脚本文件不存在，手动执行SQL：

```bash
mysql -u root -p"qweasd123Q!" ZhixinStudentSaas << 'EOF'
-- 添加 status 字段
ALTER TABLE `useraccount`
ADD COLUMN `status` TINYINT NOT NULL DEFAULT 0
COMMENT '0:启用 1:禁用'
AFTER `password`;

-- 插入测试账号
INSERT INTO `useraccount` (`username`, `password`, `status`)
VALUES ('eduzhixin', '123456', 0)
ON DUPLICATE KEY UPDATE username=username;

-- 查看结果
SELECT * FROM useraccount;
EOF

# 重启后端服务
sudo systemctl restart charonspace-backend
```

## 自动化修复（下次部署自动执行）

我已经更新了 GitHub Actions 配置，添加了自动数据库迁移功能。

下次推送代码时，部署脚本会自动：
1. 检查数据库是否存在
2. 如果数据库已存在，自动执行迁移脚本
3. 添加缺失的 `status` 字段

## 推送修复到GitHub

等网络连接恢复后，提交并推送所有修改：

```bash
cd "d:\claude space\ZhixinStudentSaaS"

# 查看待提交的文件
git status

# 提交所有修改
git add .
git commit -m "feat: 添加账号状态字段数据库迁移脚本和自动迁移功能"

# 推送（需要网络通畅）
git push origin main
```

## 验证修复

在服务器上执行：

```bash
# 1. 检查 useraccount 表结构
mysql -u root -p"qweasd123Q!" ZhixinStudentSaas -e "DESC useraccount"

# 应该看到:
# +----------+--------------+------+-----+---------+-------+
# | Field    | Type         | Null | Key | Default | Extra |
# +----------+--------------+------+-----+---------+-------+
# | username | varchar(255) | NO   | PRI | NULL    |       |
# | password | varchar(255) | NO   |     | NULL    |       |
# | status   | tinyint      | NO   |     | 0       |       |
# +----------+--------------+------+-----+---------+-------+

# 2. 查看账号数据
mysql -u root -p"qweasd123Q!" ZhixinStudentSaas -e "SELECT * FROM useraccount"

# 3. 测试登录API
curl -X POST http://localhost:5001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"charon","password":"123456"}' \
  | python3 -m json.tool

# 应该返回:
# {
#     "message": "登录成功",
#     "username": "charon"
# }

# 4. 测试账号管理API
curl http://localhost:5001/api/accounts | python3 -m json.tool
```

## 待推送的文件

本地有以下修改待推送：

1. **add_account_status.sql** - 数据库迁移脚本
2. **.github/workflows/deploy.yml** - 添加自动迁移功能
3. **FIX_LOGIN_ERROR.md** - 本文档
4. 之前的修复（自动暂存本地修改）

所有这些修改会在下次成功推送后生效。

## 网络问题

当前Git无法连接GitHub（443端口超时）。解决方法参考 FIX_SERVER_UPDATE.md。

## 总结

**立即��动**：在服务器上手动添加 `status` 字段（使用方法1或方法2）

**长期方案**：等网络恢复后推送修改，以后部署会自动处理数据库迁移

**验证**：执行验证步骤确保登录功能正常
