-- 医院患者管理系统 - 数据库表结构创建脚本
-- 版本：4.0
-- 日期：2026-03-10
-- 说明：使用UUID作为主键

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS yukirinllmedmanage 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE yukirinllmedmanage;

-- 1. 创建users表（用户表）
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY COMMENT '主键ID（UUID）',
    phone VARCHAR(20) NOT NULL UNIQUE COMMENT '手机号',
    password VARCHAR(255) NOT NULL COMMENT '密码(MD5加密)',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    gender INT DEFAULT 0 COMMENT '性别(0:女,1:男)',
    age INT COMMENT '年龄',
    id_card VARCHAR(18) COMMENT '身份证号',
    emergency_contact VARCHAR(50) COMMENT '紧急联系人',
    emergency_phone VARCHAR(20) COMMENT '紧急联系电话',
    address VARCHAR(200) COMMENT '地址',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_phone (phone),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 创建admins表（管理员表）
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(36) PRIMARY KEY COMMENT '主键ID（UUID）',
    phone VARCHAR(20) NOT NULL UNIQUE COMMENT '手机号',
    password VARCHAR(255) NOT NULL COMMENT '密码(MD5加密)',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    gender INT DEFAULT 0 COMMENT '性别(0:女,1:男)',
    age INT COMMENT '年龄',
    department VARCHAR(100) COMMENT '部门',
    position VARCHAR(100) COMMENT '职位',
    role INT NOT NULL DEFAULT 1 COMMENT '角色(1:管理员,2:超级管理员)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_phone (phone),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- 3. 创建health_records表（健康档案表）
CREATE TABLE IF NOT EXISTS health_records (
    id VARCHAR(36) PRIMARY KEY COMMENT '主键ID（UUID）',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    past_medical_history TEXT COMMENT '既往病史',
    allergic_history TEXT COMMENT '过敏史',
    family_medical_history TEXT COMMENT '家族病史',
    blood_type VARCHAR(10) COMMENT '血型',
    other_info TEXT COMMENT '其他信息',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    CONSTRAINT fk_health_records_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='健康档案表';

-- 4. 创建vital_signs表（生命体征表）
CREATE TABLE IF NOT EXISTS vital_signs (
    id VARCHAR(36) PRIMARY KEY COMMENT '主键ID（UUID）',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    temperature DECIMAL(4,1) COMMENT '体温(℃)',
    systolic_pressure INT COMMENT '收缩压(mmHg)',
    diastolic_pressure INT COMMENT '舒张压(mmHg)',
    blood_sugar INT COMMENT '血糖(mmol/L)',
    heart_rate INT COMMENT '心率(次/分)',
    notes TEXT COMMENT '备注',
    record_time DATETIME NOT NULL COMMENT '记录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id),
    INDEX idx_record_time (record_time),
    CONSTRAINT fk_vital_signs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='生命体征表';

-- 5. 创建medication_records表（用药记录表）
CREATE TABLE IF NOT EXISTS medication_records (
    id VARCHAR(36) PRIMARY KEY COMMENT '主键ID（UUID）',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    medication_name VARCHAR(200) NOT NULL COMMENT '药品名称',
    dosage VARCHAR(100) COMMENT '剂量',
    frequency VARCHAR(100) COMMENT '频次',
    taken BOOLEAN DEFAULT FALSE COMMENT '是否已服用',
    notes TEXT COMMENT '备注',
    medication_time DATETIME NOT NULL COMMENT '用药时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id),
    INDEX idx_medication_time (medication_time),
    CONSTRAINT fk_medication_records_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用药记录表';

-- 6. 创建notifications表（通知表）
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY COMMENT '主键ID（UUID）',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    type VARCHAR(20) NOT NULL COMMENT '通知类型(1:就诊提醒,2:用药提醒,3:检查通知,4:随访提醒,5:复诊提醒)',
    title VARCHAR(200) NOT NULL COMMENT '通知标题',
    content TEXT COMMENT '通知内容',
    is_read BOOLEAN DEFAULT FALSE COMMENT '是否已读',
    notify_time DATETIME COMMENT '通知时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';

-- 7. 创建device_tokens表（设备令牌表）
CREATE TABLE IF NOT EXISTS device_tokens (
    id VARCHAR(36) PRIMARY KEY COMMENT '主键ID（UUID）',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    token VARCHAR(500) NOT NULL COMMENT '设备令牌',
    platform VARCHAR(20) COMMENT '平台(android/ios)',
    device_id VARCHAR(100) COMMENT '设备ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_token (token(100)),
    CONSTRAINT fk_device_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设备令牌表';

-- 8. 创建activities表（活动表）
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(36) PRIMARY KEY COMMENT '主键ID（UUID）',
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
    created_by VARCHAR(36) COMMENT '创建人ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_status (status),
    INDEX idx_start_time (start_time),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动表';

-- 9. 创建activity_participants表（活动参与表）
CREATE TABLE IF NOT EXISTS activity_participants (
    id VARCHAR(36) PRIMARY KEY COMMENT '主键ID（UUID）',
    activity_id VARCHAR(36) NOT NULL COMMENT '活动ID',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    participate_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '参与时间',
    status INT DEFAULT 1 COMMENT '状态(0:已取消,1:已报名)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_activity_id (activity_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    CONSTRAINT fk_activity_participants_activity FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    CONSTRAINT fk_activity_participants_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动参与表';

-- 10. 创建news表（新闻资讯表）
CREATE TABLE IF NOT EXISTS news (
    id VARCHAR(36) NOT NULL PRIMARY KEY COMMENT '主键ID（UUID）',
    title VARCHAR(500) NOT NULL COMMENT '文章标题',
    url VARCHAR(1000) NOT NULL COMMENT '文章链接',
    content LONGTEXT COMMENT '文章内容（HTML）',
    cover_image LONGTEXT COMMENT '封面图片URL',
    source VARCHAR(200) DEFAULT NULL COMMENT '文章来源',
    status TINYINT DEFAULT 1 COMMENT '状态：0-下架，1-发布',
    is_top TINYINT DEFAULT 0 COMMENT '是否置顶：0-否，1-是',
    view_count INT DEFAULT 0 COMMENT '浏览次数',
    created_by VARCHAR(36) DEFAULT NULL COMMENT '创建人ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    KEY idx_status_top (status, is_top),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='新闻资讯表';

-- 11. 创建user_tags表（患者标签关联表）
CREATE TABLE IF NOT EXISTS user_tags (
    id VARCHAR(36) PRIMARY KEY COMMENT '主键ID（UUID）',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    tag_name VARCHAR(100) NOT NULL COMMENT '标签名称',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id),
    INDEX idx_tag_name (tag_name),
    UNIQUE KEY unique_user_tag (user_id, tag_name),
    CONSTRAINT fk_user_tags_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='患者标签关联表';

-- 表结构创建完成
SELECT '数据库表结构创建完成！' AS message;
SELECT '数据库名：yukirinllmedmanage' AS info;
SELECT '共创建11个表：users, admins, health_records, vital_signs, medication_records, notifications, device_tokens, activities, activity_participants, news, user_tags' AS info;