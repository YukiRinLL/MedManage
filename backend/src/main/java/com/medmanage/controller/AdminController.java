package com.medmanage.controller;

import com.medmanage.entity.User;
import com.medmanage.service.UserService;
import com.medmanage.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // 管理员登录
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> request) {
        try {
            String phone = request.get("phone");
            String password = request.get("password");

            if (phone == null || password == null) {
                return ResponseEntity.badRequest().body("手机号和密码不能为空");
            }

            // 登录验证
            User user = userService.login(phone, password);

            // 检查是否为管理员
            if (!user.getIsAdmin()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("无管理员权限");
            }

            // 生成token
            String token = jwtUtil.generateToken(user.getId());

            // 返回登录信息
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            response.put("isAdmin", true);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("登录失败: " + e.getMessage());
        }
    }

    // 获取系统概览
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@RequestHeader("Authorization") String token) {
        try {
            // 验证管理员权限
            if (!validateAdminToken(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("无管理员权限");
            }

            // 构建系统概览数据
            Map<String, Object> dashboard = new HashMap<>();
            
            // 用户统计
            List<User> allUsers = userService.getAllUsers();
            List<User> allAdmins = userService.getAllAdmins();
            
            dashboard.put("totalUsers", allUsers.size());
            dashboard.put("totalAdmins", allAdmins.size());
            dashboard.put("totalRecords", allUsers.size()); // 暂时用用户数代替

            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("获取仪表盘数据失败: " + e.getMessage());
        }
    }

    // 获取所有用户
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String token) {
        try {
            // 验证管理员权限
            if (!validateAdminToken(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("无管理员权限");
            }

            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("获取用户列表失败: " + e.getMessage());
        }
    }

    // 创建管理员账户
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestHeader("Authorization") String token, @RequestBody User user) {
        try {
            // 验证管理员权限
            if (!validateAdminToken(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("无管理员权限");
            }

            User admin = userService.createAdmin(user);
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("创建管理员失败: " + e.getMessage());
        }
    }

    // 更新用户角色
    @PutMapping("/update-role/{userId}")
    public ResponseEntity<?> updateUserRole(@RequestHeader("Authorization") String token, 
                                           @PathVariable Long userId, 
                                           @RequestBody Map<String, Boolean> request) {
        try {
            // 验证管理员权限
            if (!validateAdminToken(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("无管理员权限");
            }

            Boolean isAdmin = request.get("isAdmin");
            if (isAdmin == null) {
                return ResponseEntity.badRequest().body("请指定用户角色");
            }

            User updatedUser = userService.updateUserRole(userId, isAdmin);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("更新用户角色失败: " + e.getMessage());
        }
    }

    // 验证管理员token
    private boolean validateAdminToken(String token) {
        try {
            // 移除Bearer前缀
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Long userId = jwtUtil.getUserIdFromToken(token);
            return userService.isAdmin(userId);
        } catch (Exception e) {
            return false;
        }
    }
}
