-- 创建菜单表
SET NAMES utf8mb4;
USE zhixinstudentsaas;

CREATE TABLE IF NOT EXISTS `menu` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
    `name` VARCHAR(50) NOT NULL COMMENT '菜单名称',
    `parent_id` INT NULL DEFAULT NULL COMMENT '父级菜单ID，NULL表示一级菜单',
    `route` VARCHAR(50) NULL COMMENT '路由标识，用于前端页面切换',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序顺序',
    PRIMARY KEY (`id`),
    INDEX `idx_parent_id` (`parent_id`),
    CONSTRAINT `fk_menu_parent` FOREIGN KEY (`parent_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单表';

-- 插入一级菜单
INSERT INTO `menu` (`id`, `name`, `parent_id`, `route`, `sort_order`) VALUES
(1, '学生管理', NULL, NULL, 1),
(2, '教练管理', NULL, NULL, 2),
(3, '订单管理', NULL, NULL, 3),
(4, '系统设置', NULL, NULL, 4);

-- 插入二级菜单
INSERT INTO `menu` (`name`, `parent_id`, `route`, `sort_order`) VALUES
('学生管理', 1, 'students', 1),
('教练管理', 2, 'coaches', 1),
('订单管理', 3, 'orders', 1),
('账号管理', 4, 'accounts', 1);
