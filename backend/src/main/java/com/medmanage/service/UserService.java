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
    
    @Autowired
    private UserTagService userTagService;
    
    public User register(User user) {
        if (userRepository.existsByPhone(user.getPhone())) {
            throw new RuntimeException("手机号已注册");
        }
        if (user.getIdCard() != null && !user.getIdCard().isEmpty() && userRepository.existsByIdCard(user.getIdCard())) {
            throw new RuntimeException("身份证号已注册");
        }
        user.setPassword(DigestUtils.md5DigestAsHex(user.getPassword().getBytes()));
        return userRepository.save(user);
    }
    
    public User login(String phone, String password) {
        User user = userRepository.findByPhone(phone);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
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
    
    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }
    
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public java.util.Map<String, Object> listUsers(int page, int size, String tagName) {
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        // 确保page不小于1
        int safePage = Math.max(1, page);
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(safePage - 1, size, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        
        org.springframework.data.domain.Page<User> userPage;
        if (tagName != null && !tagName.isEmpty()) {
            // 先获取有该标签的用户ID列表
            java.util.List<String> userIds = userTagService.getUsersByTagName(tagName);
            if (userIds.isEmpty()) {
                result.put("list", java.util.Collections.emptyList());
                result.put("total", 0);
                return result;
            }
            // 根据用户ID列表查询用户
            userPage = userRepository.findAllByIdIn(userIds, pageable);
        } else {
            // 查询所有用户
            userPage = userRepository.findAll(pageable);
        }
        
        result.put("list", userPage.getContent());
        result.put("total", userPage.getTotalElements());
        return result;
    }
    
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }
}
