-- 创建类型表
SET NAMES utf8mb4;
USE zhixinstudentsaas;

CREATE TABLE IF NOT EXISTS `classify` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '类型ID',
  `name` VARCHAR(100) NOT NULL COMMENT '类型名称',
  `level` TINYINT NOT NULL DEFAULT 0 COMMENT '级别：0=一级，1=二级',
  `parent_id` INT DEFAULT NULL COMMENT '父级ID，NULL表示一级类型',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0=启用，1=禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_parent_id` (`parent_id`),
  INDEX `idx_level` (`level`),
  INDEX `idx_status` (`status`),
  FOREIGN KEY (`parent_id`) REFERENCES `classify`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品类型表';

-- 插入一些示例数据
INSERT INTO `classify` (`name`, `level`, `parent_id`, `status`) VALUES
('电子产品', 0, NULL, 0),
('服装', 0, NULL, 0),
('食品', 0, NULL, 0);

-- 插入二级类型示例
INSERT INTO `classify` (`name`, `level`, `parent_id`, `status`) VALUES
('手机', 1, 1, 0),
('电脑', 1, 1, 0),
('男装', 1, 2, 0),
('女装', 1, 2, 0);
