-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS yukirinllmedmanage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE yukirinllmedmanage;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(50),
    gender TINYINT DEFAULT 0, -- 0:女, 1:男
    age INT,
    id_card VARCHAR(20),
    emergency_contact VARCHAR(50),
    emergency_phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建健康档案表
CREATE TABLE IF NOT EXISTS health_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    past_medical_history TEXT,
    allergic_history TEXT,
    family_medical_history TEXT,
    blood_type VARCHAR(10),
    other_info TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建生命体征表
CREATE TABLE IF NOT EXISTS vital_signs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    temperature DOUBLE,
    systolic_pressure INT,
    diastolic_pressure INT,
    blood_sugar DOUBLE,
    heart_rate INT,
    notes TEXT,
    record_time DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建用药记录表
CREATE TABLE IF NOT EXISTS medication_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    medication_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    taken BOOLEAN DEFAULT FALSE,
    notes TEXT,
    medication_time DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建通知表
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(10) NOT NULL, -- 1:就诊提醒, 2:用药提醒, 3:检查通知, 4:随访提醒, 5:复诊提醒
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    notify_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_health_records_user_id ON health_records(user_id);
CREATE INDEX idx_vital_signs_user_id ON vital_signs(user_id);
CREATE INDEX idx_vital_signs_record_time ON vital_signs(record_time);
CREATE INDEX idx_medication_records_user_id ON medication_records(user_id);
CREATE INDEX idx_medication_records_medication_time ON medication_records(medication_time);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
