package com.medmanage.controller;

import com.medmanage.entity.User;
import com.medmanage.service.UserService;
import com.medmanage.service.UserTagService;
import com.medmanage.util.JwtUtil;
import com.medmanage.util.RedisUtil;
import com.medmanage.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserTagService userTagService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private RedisUtil redisUtil;
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        try {
            User registeredUser = userService.register(user);
            String token = jwtUtil.generateToken(registeredUser.getId());
            redisUtil.set("user:" + registeredUser.getId() + ":token", token, 86400);
            Map<String, Object> data = new HashMap<>();
            data.put("data", registeredUser);
            data.put("token", token);
            return ResponseUtil.success("注册成功", data);
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        try {
            String phone = params.get("phone");
            String password = params.get("password");
            User user = userService.login(phone, password);
            String token = jwtUtil.generateToken(user.getId());
            redisUtil.set("user:" + user.getId() + ":token", token, 86400);
            Map<String, Object> data = new HashMap<>();
            data.put("token", token);
            data.put("user", user);
            return ResponseUtil.success("登录成功", data);
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            redisUtil.delete("user:" + userId + ":token");
            return ResponseUtil.success("登出成功", null);
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }
    
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            User user = userService.findById(userId);
            List<String> tagNames = userTagService.getUserTagNames(userId);
            Map<String, Object> data = new HashMap<>();
            data.put("data", user);
            data.put("tags", tagNames);
            return ResponseUtil.success(data);
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }
    
    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateUser(@RequestHeader(value = "Authorization", required = false) String token, @RequestBody User user) {
        try {
            if (token == null || token.isEmpty()) {
                return ResponseUtil.unauthorized("未登录");
            }
            String userId = jwtUtil.getUserIdFromToken(token);
            user.setId(userId);
            User updatedUser = userService.update(user);
            return ResponseUtil.success("更新成功", updatedUser);
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }
    
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> listUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) Integer gender,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) String tagName) {
        try {
            Map<String, Object> data = userService.listUsers(page, size, name, phone, gender, minAge, maxAge, tagName);
            return ResponseUtil.success("获取成功", data);
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable String id) {
        try {
            User user = userService.findById(id);
            List<String> tagNames = userTagService.getUserTagNames(id);
            Map<String, Object> data = new HashMap<>();
            data.put("data", user);
            data.put("tags", tagNames);
            return ResponseUtil.success(data);
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseUtil.success("删除成功", null);
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }
    
    // 标签相关接口
    @PostMapping("/{id}/tags")
    public ResponseEntity<Map<String, Object>> setUserTags(@PathVariable String id, @RequestBody Map<String, List<String>> request) {
        try {
            List<String> tagNames = request.get("tagNames");
            userTagService.setUserTags(id, tagNames);
            return ResponseUtil.success("标签设置成功", null);
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }
    
    @GetMapping("/{id}/tags")
    public ResponseEntity<Map<String, Object>> getUserTags(@PathVariable String id) {
        try {
            List<String> tagNames = userTagService.getUserTagNames(id);
            return ResponseUtil.success(tagNames);
        } catch (Exception e) {
            return ResponseUtil.badRequest(e.getMessage());
        }
    }
}
