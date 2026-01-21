-- 创建角色表
CREATE TABLE IF NOT EXISTS `role` (
    `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
    `name` VARCHAR(50) NOT NULL COMMENT '角色名称',
    `comment` VARCHAR(200) DEFAULT NULL COMMENT '角色描述',
    `status` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '状态：0-启用，1-禁用',
    `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 创建角色权限关联表
CREATE TABLE IF NOT EXISTS `role_permissions` (
    `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `role_id` INT(11) NOT NULL COMMENT '角色ID',
    `permissions_id` INT(11) NOT NULL COMMENT '权限ID',
    `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_role_permission` (`role_id`, `permissions_id`),
    KEY `idx_role_id` (`role_id`),
    KEY `idx_permissions_id` (`permissions_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';
