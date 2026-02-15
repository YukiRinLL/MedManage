package com.medmanage.service;

import com.medmanage.entity.User;
import com.medmanage.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User register(User user) {
        // 检查手机号是否已存在
        if (userRepository.existsByPhone(user.getPhone())) {
            throw new RuntimeException("手机号已注册");
        }
        // 密码加密
        user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
        return userRepository.save(user);
    }
    
    public User login(String phone, String password) {
        User user = userRepository.findByPhone(phone);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        // 验证密码
        if (!user.getPassword().equals(DigestUtils.md5DigestAsHex(password.getBytes()))) {
            throw new RuntimeException("密码错误");
        }
        return user;
    }
    
    public User findByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }
    
    public User update(User user) {
        return userRepository.save(user);
    }
    
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    // 检查用户是否为管理员
    public boolean isAdmin(Long userId) {
        User user = findById(userId);
        return user != null && user.getIsAdmin() != null && user.getIsAdmin();
    }
    
    // 获取所有管理员
    public java.util.List<User> getAllAdmins() {
        return userRepository.findByIsAdminTrue();
    }
    
    // 获取所有普通用户
    public java.util.List<User> getAllUsers() {
        return userRepository.findByIsAdminFalse();
    }
    
    // 创建管理员账户
    public User createAdmin(User user) {
        // 检查手机号是否已存在
        if (userRepository.existsByPhone(user.getPhone())) {
            throw new RuntimeException("手机号已注册");
        }
        // 设置为管理员
        user.setIsAdmin(true);
        // 密码加密
        user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
        return userRepository.save(user);
    }
    
    // 更新用户角色
    public User updateUserRole(Long userId, boolean isAdmin) {
        User user = findById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        user.setIsAdmin(isAdmin);
        return userRepository.save(user);
    }
}
