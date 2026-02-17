package com.medmanage.controller;

import com.medmanage.entity.Admin;
import com.medmanage.service.AdminService;
import com.medmanage.util.JwtUtil;
import com.medmanage.util.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RedisUtil redisUtil;

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> request) {
        try {
            String phone = request.get("phone");
            String password = request.get("password");

            if (phone == null || password == null) {
                return ResponseEntity.badRequest().body("手机号和密码不能为空");
            }

            Admin admin = adminService.login(phone, password);

            String token = jwtUtil.generateToken(admin.getId());
            redisUtil.set("admin:" + admin.getId() + ":token", token, 86400);

            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "登录成功");
            response.put("token", token);
            response.put("data", admin);
            response.put("isAdmin", admin.getRole() == 1);
            response.put("isSuperAdmin", admin.getRole() == 2);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 401);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "登录失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@RequestHeader("Authorization") String token) {
        try {
            if (!validateAdminToken(token)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("code", 403);
                errorResponse.put("message", "无管理员权限");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            }

            Map<String, Object> dashboard = new HashMap<>();
            
            List<Admin> allAdmins = adminService.getAllAdmins();
            List<Admin> admins = adminService.getAdminsByRole(1);
            List<Admin> superAdmins = adminService.getAdminsByRole(2);
            
            dashboard.put("totalAdmins", allAdmins.size());
            dashboard.put("totalNormalAdmins", admins.size());
            dashboard.put("totalSuperAdmins", superAdmins.size());

            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", dashboard);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "获取仪表盘数据失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/admins")
    public ResponseEntity<?> getAllAdmins(@RequestHeader("Authorization") String token) {
        try {
            if (!validateAdminToken(token)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("code", 403);
                errorResponse.put("message", "无管理员权限");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            }

            List<Admin> admins = adminService.getAllAdmins();
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", admins);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "获取管理员列表失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestHeader("Authorization") String token, 
                                         @RequestBody Admin admin) {
        try {
            if (!validateSuperAdminToken(token)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("code", 403);
                errorResponse.put("message", "需要超级管理员权限");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            }

            Admin createdAdmin = adminService.createAdmin(admin);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "创建成功");
            response.put("data", createdAdmin);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 400);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "创建管理员失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/update-admin/{adminId}")
    public ResponseEntity<?> updateAdmin(@RequestHeader("Authorization") String token, 
                                         @PathVariable Long adminId, 
                                         @RequestBody Admin admin) {
        try {
            if (!validateSuperAdminToken(token)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("code", 403);
                errorResponse.put("message", "需要超级管理员权限");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            }

            Admin updatedAdmin = adminService.updateAdmin(adminId, admin);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "更新成功");
            response.put("data", updatedAdmin);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 400);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "更新管理员失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/admins/{adminId}")
    public ResponseEntity<?> deleteAdmin(@RequestHeader("Authorization") String token, 
                                        @PathVariable Long adminId) {
        try {
            if (!validateSuperAdminToken(token)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("code", 403);
                errorResponse.put("message", "需要超级管理员权限");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            }

            adminService.deleteAdmin(adminId);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "删除成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "删除管理员失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    private boolean validateAdminToken(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Long adminId = jwtUtil.getUserIdFromToken(token);
            Admin admin = adminService.getAdminById(adminId);
            return admin != null && admin.getRole() >= 1;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean validateSuperAdminToken(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Long adminId = jwtUtil.getUserIdFromToken(token);
            Admin admin = adminService.getAdminById(adminId);
            return admin != null && admin.getRole() == 2;
        } catch (Exception e) {
            return false;
        }
    }
}
