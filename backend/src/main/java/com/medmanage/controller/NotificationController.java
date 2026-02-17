package com.medmanage.controller;

import com.medmanage.entity.Notification;
import com.medmanage.service.NotificationService;
import com.medmanage.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notification")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping("/list")
    public Map<String, Object> getNotificationList(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Boolean read) {
        Map<String, Object> result = new HashMap<>();
        try {
            Map<String, Object> data = notificationService.listNotifications(page, size, name, type, read);
            result.put("code", 200);
            result.put("message", "获取成功");
            result.put("data", data);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PostMapping("/create")
    public Map<String, Object> createNotification(@RequestHeader("Authorization") String token, @RequestBody Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            String phone = (String) params.get("phone");
            Integer type = (Integer) params.get("type");
            String title = (String) params.get("title");
            String content = (String) params.get("content");
            String notifyTime = (String) params.get("notifyTime");
            
            notificationService.createNotification(phone, type, title, content, notifyTime);
            result.put("code", 200);
            result.put("message", "创建成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteNotification(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            notificationService.deleteNotification(id);
            result.put("code", 200);
            result.put("message", "删除成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/unread")
    public Map<String, Object> getUnreadNotifications(@RequestHeader("Authorization") String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            List<Notification> notifications = notificationService.findUnreadByUserId(userId);
            result.put("code", 200);
            result.put("data", notifications);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PutMapping("/mark-read/{id}")
    public Map<String, Object> markAsRead(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            notificationService.markAsRead(id);
            result.put("code", 200);
            result.put("message", "标记成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PutMapping("/mark-all-read")
    public Map<String, Object> markAllAsRead(@RequestHeader("Authorization") String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            notificationService.markAllAsRead(userId);
            result.put("code", 200);
            result.put("message", "标记成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
