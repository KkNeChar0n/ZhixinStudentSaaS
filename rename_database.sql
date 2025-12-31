-- 数据库重命名脚本
-- 用途：将 ZhixinStudentSaas 重命名为 zhixinstudentsaas（全小写）
-- 执行时间：2025-12-31
-- 注意：MySQL 不支持直接重命名数据库，需要通过创建新库+迁移数据的方式

-- 方法一：使用 mysqldump（推荐，在服务器命令行执行）
-- 1. 导出旧数据库
--    mysqldump -u root -p ZhixinStudentSaas > zhixinstudentsaas_backup.sql
-- 2. 创建新数据库
--    mysql -u root -p -e "CREATE DATABASE zhixinstudentsaas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
-- 3. 导入数据到新数据库
--    mysql -u root -p zhixinstudentsaas < zhixinstudentsaas_backup.sql
-- 4. 验证数据完整性后删除旧数据库
--    mysql -u root -p -e "DROP DATABASE ZhixinStudentSaas;"

-- 方法二：使用 SQL 脚本重命名（仅在表不多时使用）
-- 注意：如果数据库 zhixinstudentsaas 已存在，先删除它
DROP DATABASE IF EXISTS zhixinstudentsaas;

-- 创建新数据库
CREATE DATABASE zhixinstudentsaas
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 将所有表从旧数据库移动到新数据库
-- 注意：需要根据实际表名调整
USE ZhixinStudentSaas;

-- 获取所有表名并重命名到新数据库
-- 注意：这个操作会实际移动表（不是复制）
RENAME TABLE
    ZhixinStudentSaas.student TO zhixinstudentsaas.student,
    ZhixinStudentSaas.coach TO zhixinstudentsaas.coach,
    ZhixinStudentSaas.grade TO zhixinstudentsaas.grade,
    ZhixinStudentSaas.subject TO zhixinstudentsaas.subject,
    ZhixinStudentSaas.useraccount TO zhixinstudentsaas.useraccount,
    ZhixinStudentSaas.orders TO zhixinstudentsaas.orders,
    ZhixinStudentSaas.menu TO zhixinstudentsaas.menu,
    ZhixinStudentSaas.attribute TO zhixinstudentsaas.attribute;

-- 删除旧数据库（现在应该是空的）
DROP DATABASE ZhixinStudentSaas;

-- 验证新数据库
USE zhixinstudentsaas;
SHOW TABLES;

SELECT '=== 数据库重命名完成 ===' AS status;
SELECT '新数据库名称: zhixinstudentsaas' AS info;
