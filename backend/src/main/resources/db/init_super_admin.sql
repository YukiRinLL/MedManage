-- 初始化超级管理员账户
-- 数据库名：yukirinllmedmanage
-- 日期：2026-02-17
-- 说明：插入超级管理员账户（密码使用DigestUtils.md5DigestAsHex()加密）

USE yukirinllmedmanage;

-- 插入超级管理员
-- 手机号：18888888888
-- 密码：admin123
-- MD5值：0192023a7bbd73250516f069df18b500
INSERT INTO admins (phone, password, name, gender, age, role, department, position, created_at, updated_at)
VALUES ('18888888888', '0192023a7bbd73250516f069df18b500', '超级管理员', 1, 30, 2, 'IT运维部', '系统管理员', NOW(), NOW());

-- 显示创建的超级管理员信息
SELECT '超级管理员创建成功！' AS message;
SELECT id, phone, name, role, 
    CASE 
        WHEN role = 1 THEN '管理员'
        WHEN role = 2 THEN '超级管理员'
        ELSE '未知'
    END AS role_name,
    department, position, created_at 
FROM admins 
WHERE phone = '18888888888';

-- 登录信息
SELECT '====================' AS info;
SELECT '登录信息' AS info;
SELECT '手机号：18888888888' AS info;
SELECT '密码：admin123' AS info;
SELECT '登录地址：http://localhost:8080/api/admin/login' AS info;
SELECT '====================' AS info;
