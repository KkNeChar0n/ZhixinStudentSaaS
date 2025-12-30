-- 创建订单表
USE ZhixinStudentSaas;

CREATE TABLE IF NOT EXISTS `orders` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '订单ID',
    `student_id` INT NOT NULL COMMENT '学生ID',
    `amount_receivable` DECIMAL(10, 2) NOT NULL COMMENT '应收金额',
    `amount_received` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '实收金额',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `status` TINYINT NOT NULL DEFAULT 10 COMMENT '订单状态: 10=草稿, 20=审核中, 30=已通过, 40=已驳回, 99=已作废',
    PRIMARY KEY (`id`),
    INDEX `idx_student_id` (`student_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_create_time` (`create_time`),
    CONSTRAINT `fk_orders_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 插入测试数据
INSERT INTO `orders` (`student_id`, `amount_receivable`, `amount_received`, `status`) VALUES
(1, 1000.00, 0.00, 10),
(2, 1500.00, 1500.00, 30),
(3, 2000.00, 0.00, 20);
