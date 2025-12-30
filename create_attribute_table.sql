-- 创建属性表
SET NAMES utf8mb4;
USE zhixinstudentsaas;

CREATE TABLE IF NOT EXISTS `attribute` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '属性ID',
  `name` VARCHAR(100) NOT NULL COMMENT '属性名称',
  `classify` TINYINT NOT NULL DEFAULT 0 COMMENT '分类：0=属性，1=规格',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0=启用，1=禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品属性表';

-- 插入一些示例数据
INSERT INTO `attribute` (`name`, `classify`, `status`) VALUES
('颜色', 0, 0),
('尺寸', 1, 0),
('材质', 0, 0);
