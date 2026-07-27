package com.medmanage.service;

import com.medmanage.entity.Notification;
import com.medmanage.entity.User;
import com.medmanage.repository.NotificationRepository;
import com.medmanage.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }
    
    public List<Notification> findByUserId(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> findUnreadByUserId(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }
    
    public long countUnreadByUserId(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
    
    public Map<String, Object> listNotifications(int page, int size, String name, Integer type, Boolean read) {
        Map<String, Object> result = new HashMap<>();
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Notification> notificationPage = notificationRepository.findAll(pageable);
        result.put("list", notificationPage.getContent());
        result.put("total", notificationPage.getTotalElements());
        return result;
    }
    
    public Map<String, Object> listNotificationsByUserId(String userId, int page, int size) {
        Map<String, Object> result = new HashMap<>();
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Notification> notificationPage = notificationRepository.findByUserId(userId, pageable);
        result.put("list", notificationPage.getContent());
        result.put("total", notificationPage.getTotalElements());
        return result;
    }
    
    public List<Notification> findNotificationsByUserId(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public void createNotification(String phone, Integer type, String title, String content, String notifyTime) {
        Notification notification = new Notification();
        
        User user = userRepository.findByPhone(phone);
        if (user != null) {
            notification.setUserId(user.getId());
        }
        
        notification.setType(type.toString());
        notification.setTitle(title);
        notification.setContent(content);
        notification.setIsRead(false);
        notificationRepository.save(notification);
    }
    
    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }
    
    public void markAsRead(String id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }
    
    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        for (Notification notification : notifications) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }
}
