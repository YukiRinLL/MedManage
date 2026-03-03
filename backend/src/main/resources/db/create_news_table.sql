-- 创建新闻表
CREATE TABLE IF NOT EXISTS `news` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `title` VARCHAR(500) NOT NULL COMMENT '文章标题',
    `url` VARCHAR(1000) NOT NULL COMMENT '文章链接',
    `content` LONGTEXT COMMENT '文章内容（HTML）',
    `cover_image` LONGTEXT COMMENT '封面图片URL',
    `source` VARCHAR(200) DEFAULT NULL COMMENT '文章来源',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0-下架，1-发布',
    `sort_order` INT DEFAULT 0 COMMENT '排序，数字越大越靠前',
    `view_count` INT DEFAULT 0 COMMENT '浏览次数',
    `created_by` BIGINT DEFAULT NULL COMMENT '创建人ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_status_sort` (`status`, `sort_order`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='新闻资讯表';
