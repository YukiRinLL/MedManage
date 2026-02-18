-- 创建活动管理相关的数据库表
-- 数据库名：yukirinllmedmanage
-- 日期：2026-02-17

USE yukirinllmedmanage;

-- 8. 创建activities表（活动表）
CREATE TABLE IF NOT EXISTS activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    title VARCHAR(200) NOT NULL COMMENT '活动标题',
    description TEXT COMMENT '活动描述',
    activity_type VARCHAR(50) COMMENT '活动类型',
    location VARCHAR(200) COMMENT '活动地点',
    start_time DATETIME NOT NULL COMMENT '开始时间',
    end_time DATETIME NOT NULL COMMENT '结束时间',
    max_participants INT COMMENT '最大参与人数',
    current_participants INT DEFAULT 0 COMMENT '当前参与人数',
    status INT DEFAULT 1 COMMENT '状态(0:已结束,1:进行中,2:未开始)',
    cover_image VARCHAR(500) COMMENT '封面图片',
    created_by BIGINT COMMENT '创建人ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_status (status),
    INDEX idx_start_time (start_time),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动表';

-- 9. 创建activity_participants表（活动参与表）
CREATE TABLE IF NOT EXISTS activity_participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    activity_id BIGINT NOT NULL COMMENT '活动ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    participate_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '参与时间',
    status INT DEFAULT 1 COMMENT '状态(0:已取消,1:已报名)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_activity_id (activity_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    CONSTRAINT fk_activity_participants_activity FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    CONSTRAINT fk_activity_participants_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动参与表';

-- 表结构创建完成
SELECT '活动管理相关表创建完成！' AS message;
SELECT '共创建2个表：activities, activity_participants' AS info;
