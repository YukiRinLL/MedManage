package com.medmanage.service;

import com.medmanage.entity.Admin;
import com.medmanage.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    public Admin createAdmin(Admin admin) {
        if (adminRepository.existsByPhone(admin.getPhone())) {
            throw new RuntimeException("该手机号已注册");
        }
        
        admin.setPassword(DigestUtils.md5DigestAsHex(admin.getPassword().getBytes()));
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());
        
        return adminRepository.save(admin);
    }
    
    public Admin login(String phone, String password) {
        Admin admin = adminRepository.findByPhone(phone);
        if (admin == null) {
            throw new RuntimeException("管理员不存在");
        }
        
        String encryptedPassword = DigestUtils.md5DigestAsHex(password.getBytes());
        if (!admin.getPassword().equals(encryptedPassword)) {
            throw new RuntimeException("密码错误");
        }
        
        return admin;
    }
    
    public Admin getAdminById(String id) {
        return adminRepository.findById(id).orElse(null);
    }
    
    public List<Admin> getAllAdmins() {
        return adminRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<Admin> getAdminsByRole(Integer role) {
        return adminRepository.findByRole(role);
    }
    
    public Admin updateAdmin(String id, Admin admin) {
        Admin existingAdmin = adminRepository.findById(id).orElse(null);
        if (existingAdmin == null) {
            throw new RuntimeException("管理员不存在");
        }
        
        if (admin.getName() != null) {
            existingAdmin.setName(admin.getName());
        }
        if (admin.getGender() != null) {
            existingAdmin.setGender(admin.getGender());
        }
        if (admin.getAge() != null) {
            existingAdmin.setAge(admin.getAge());
        }
        if (admin.getDepartment() != null) {
            existingAdmin.setDepartment(admin.getDepartment());
        }
        if (admin.getPosition() != null) {
            existingAdmin.setPosition(admin.getPosition());
        }
        if (admin.getRole() != null) {
            existingAdmin.setRole(admin.getRole());
        }
        if (admin.getPassword() != null && !admin.getPassword().isEmpty()) {
            existingAdmin.setPassword(DigestUtils.md5DigestAsHex(admin.getPassword().getBytes()));
        }
        
        existingAdmin.setUpdatedAt(LocalDateTime.now());
        
        return adminRepository.save(existingAdmin);
    }
    
    public void deleteAdmin(String id) {
        adminRepository.deleteById(id);
    }
}
