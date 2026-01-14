-- 创建分账明细表
CREATE TABLE IF NOT EXISTS `separate_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uid` int(11) NOT NULL COMMENT '学生ID',
  `orders_id` int(11) NOT NULL COMMENT '订单ID',
  `childorders_id` int(11) NOT NULL COMMENT '子订单ID',
  `payment_id` int(11) NOT NULL COMMENT '收款ID',
  `goods_id` int(11) NOT NULL COMMENT '商品ID',
  `goods_name` varchar(200) DEFAULT NULL COMMENT '商品名称',
  `separate_amount` decimal(10,2) NOT NULL COMMENT '分账金额',
  `type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '类型：0-售卖，1-冲回',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_uid` (`uid`),
  KEY `idx_orders_id` (`orders_id`),
  KEY `idx_childorders_id` (`childorders_id`),
  KEY `idx_payment_id` (`payment_id`),
  KEY `idx_goods_id` (`goods_id`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分账明细表';
