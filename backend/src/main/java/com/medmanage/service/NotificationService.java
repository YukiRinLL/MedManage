package com.medmanage.service;

import com.medmanage.entity.Notification;
import com.medmanage.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    
    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }
    
    public List<Notification> findByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> findUnreadByUserId(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }
    
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }
    
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        for (Notification notification : notifications) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }
}
