package com.medmanage.controller;

import com.medmanage.entity.User;
import com.medmanage.service.UserService;
import com.medmanage.service.UserTagService;
import com.medmanage.util.JwtUtil;
import com.medmanage.util.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        try {
            User registeredUser = userService.register(user);
            result.put("code", 200);
            result.put("message", "注册成功");
            result.put("data", registeredUser);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            String phone = params.get("phone");
            String password = params.get("password");
            User user = userService.login(phone, password);
            String token = jwtUtil.generateToken(user.getId());
            redisUtil.set("user:" + user.getId() + ":token", token, 86400);
            result.put("code", 200);
            result.put("message", "登录成功");
            result.put("token", token);
            result.put("user", user);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PostMapping("/logout")
    public Map<String, Object> logout(@RequestHeader("Authorization") String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            redisUtil.delete("user:" + userId + ":token");
            result.put("code", 200);
            result.put("message", "登出成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/info")
    public Map<String, Object> getUserInfo(@RequestHeader("Authorization") String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            User user = userService.findById(userId);
            List<String> tagNames = userTagService.getUserTagNames(userId);
            result.put("code", 200);
            result.put("data", user);
            result.put("tags", tagNames);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PutMapping("/update")
    public Map<String, Object> updateUser(@RequestHeader("Authorization") String token, @RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            user.setId(userId);
            User updatedUser = userService.update(user);
            result.put("code", 200);
            result.put("message", "更新成功");
            result.put("data", updatedUser);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/list")
    public Map<String, Object> listUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String tagName) {
        Map<String, Object> result = new HashMap<>();
        try {
            Map<String, Object> data = userService.listUsers(page, size, tagName);
            result.put("code", 200);
            result.put("message", "获取成功");
            result.put("data", data);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/{id}")
    public Map<String, Object> getUserById(@PathVariable String id) {
        Map<String, Object> result = new HashMap<>();
        try {
            User user = userService.findById(id);
            List<String> tagNames = userTagService.getUserTagNames(id);
            result.put("code", 200);
            result.put("data", user);
            result.put("tags", tagNames);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteUser(@PathVariable String id) {
        Map<String, Object> result = new HashMap<>();
        try {
            userService.deleteUser(id);
            result.put("code", 200);
            result.put("message", "删除成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    // 标签相关接口
    @PostMapping("/{id}/tags")
    public Map<String, Object> setUserTags(@PathVariable String id, @RequestBody Map<String, List<String>> request) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<String> tagNames = request.get("tagNames");
            userTagService.setUserTags(id, tagNames);
            result.put("code", 200);
            result.put("message", "标签设置成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/{id}/tags")
    public Map<String, Object> getUserTags(@PathVariable String id) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<String> tagNames = userTagService.getUserTagNames(id);
            result.put("code", 200);
            result.put("data", tagNames);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
