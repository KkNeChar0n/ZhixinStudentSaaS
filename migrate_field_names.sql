-- 字段名称迁移脚本
-- 将 sex 表的 sex 字段修改为 name
-- 将 grade 表的 grade 字段修改为 name

USE zhixinstudentsaas;

-- 修改 sex 表字段名：sex -> name
ALTER TABLE sex CHANGE COLUMN sex name VARCHAR(10) NOT NULL COMMENT '性别名称';

-- 修改 grade 表字段名：grade -> name
ALTER TABLE grade CHANGE COLUMN grade name VARCHAR(50) NOT NULL COMMENT '年级名称';

-- 验证修改结果
SELECT '=== sex 表结构 ===' AS info;
DESCRIBE sex;

SELECT '=== grade 表结构 ===' AS info;
DESCRIBE grade;

SELECT '=== 迁移完成 ===' AS status;
