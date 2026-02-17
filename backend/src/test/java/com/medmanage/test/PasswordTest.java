package com.medmanage.test;

import org.springframework.util.DigestUtils;

public class PasswordTest {
    public static void main(String[] args) {
        String password = "admin";
        String md5Hash = DigestUtils.md5DigestAsHex(password.getBytes());

        System.out.println("原始密码: " + password);
        System.out.println("MD5加密后: " + md5Hash);
        System.out.println("预期MD5值: 21232f297a57a5a743894a0e4a801fc");
        System.out.println("是否匹配: " + md5Hash.equals("21232f297a57a5a743894a0e4a801fc"));
    }
}
