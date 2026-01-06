-- 数据库更新脚本：添加属性值管理功能
-- 执行日期：2026-01-06
-- 说明：为属性管理添加属性值表

USE zhixinstudentsaas;

-- 创建属性值表
CREATE TABLE IF NOT EXISTS `attribute_value` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '属性值ID',
    `name` VARCHAR(100) NOT NULL COMMENT '属性值名称',
    `attributeid` INT NOT NULL COMMENT '关联的属性ID',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`attributeid`) REFERENCES `attribute`(`id`) ON DELETE CASCADE,
    INDEX `idx_attributeid` (`attributeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='属性值表';

-- 执行结果提示
SELECT '属性值表创建成功！' AS status;
