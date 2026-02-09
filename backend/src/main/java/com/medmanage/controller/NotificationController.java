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
    public Map<String, Object> getNotificationList(@RequestHeader("Authorization") String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            List<Notification> notifications = notificationService.findByUserId(userId);
            result.put("code", 200);
            result.put("data", notifications);
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
