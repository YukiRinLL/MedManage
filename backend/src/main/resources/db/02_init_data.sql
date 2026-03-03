-- 医院患者管理系统 - 数据库初始化数据脚本
-- 版本：2.0
-- 日期：2026-03-03
-- 说明：初始化必要的基础数据

USE yukirinllmedmanage;

-- 初始化超级管理员账户
-- 手机号：18888888888
-- 密码：admin123
-- MD5值：0192023a7bbd73250516f069df18b500
INSERT INTO admins (id, phone, password, name, gender, age, role, department, position, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000001', '18888888888', '0192023a7bbd73250516f069df18b500', '超级管理员', 1, 30, 2, 'IT运维部', '系统管理员', NOW(), NOW());

-- 数据初始化完成
SELECT '数据初始化完成！' AS message;
SELECT '====================' AS info;
SELECT '超级管理员登录信息' AS info;
SELECT '手机号：18888888888' AS info;
SELECT '密码：admin123' AS info;
SELECT '登录地址：http://localhost:8080/api/admin/login' AS info;
SELECT '====================' AS info;
