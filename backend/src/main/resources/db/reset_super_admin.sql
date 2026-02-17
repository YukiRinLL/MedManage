-- 查询并重置超级管理员密码
-- 数据库名：yukirinllmedmanage
-- 日期：2026-02-17

USE yukirinllmedmanage;

-- 查询当前所有管理员
SELECT '当前管理员列表：' AS info;
SELECT id, phone, password, name, role, department, position FROM admins;

-- 删除所有管理员（如果存在）
DELETE FROM admins WHERE phone = '18888888888';

-- 重新插入超级管理员
-- 密码：admin
-- 使用Spring DigestUtils.md5DigestAsHex()加密后的MD5值
INSERT INTO admins (phone, password, name, gender, age, role, department, position, created_at, updated_at)
VALUES ('18888888888', '21232f297a57a5a743894a0e4a801fc', '超级管理员', 1, 30, 2, 'IT运维部', '系统管理员', NOW(), NOW());

-- 验证插入结果
SELECT '====================' AS info;
SELECT '超级管理员已重置！' AS message;
SELECT id, phone, password, name, role, department, position FROM admins WHERE phone = '18888888888';

-- 显示登录信息
SELECT '====================' AS info;
SELECT '登录信息' AS info;
SELECT '手机号：18888888888' AS info;
SELECT '密码：admin' AS info;
SELECT '登录地址：http://localhost:8080/api/admin/login' AS info;
SELECT '====================' AS info;
