-- 创建类型表
SET NAMES utf8mb4;
USE zhixinstudentsaas;

CREATE TABLE IF NOT EXISTS `classify` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '类型ID',
  `name` VARCHAR(100) NOT NULL COMMENT '类型名称',
  `level` TINYINT NOT NULL DEFAULT 0 COMMENT '级别：0=一级，1=二级',
  `parentid` INT DEFAULT NULL COMMENT '父级ID，NULL表示一级类型',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0=启用，1=禁用',
  INDEX `idx_parentid` (`parentid`),
  INDEX `idx_level` (`level`),
  INDEX `idx_status` (`status`),
  FOREIGN KEY (`parentid`) REFERENCES `classify`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品类型表';

-- 插入一些示例数据
INSERT INTO `classify` (`name`, `level`, `parentid`, `status`) VALUES
('电子产品', 0, NULL, 0),
('服装鞋包', 0, NULL, 0),
('图书音像', 0, NULL, 0),
('食品饮料', 0, NULL, 1);

-- 插入二级类型示例
INSERT INTO `classify` (`name`, `level`, `parentid`, `status`) VALUES
('手机通讯', 1, 1, 0),
('电脑办公', 1, 1, 0),
('男装', 1, 2, 0),
('女装', 1, 2, 0),
('文学小说', 1, 3, 0),
('教育考试', 1, 3, 0);
