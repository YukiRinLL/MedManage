package com.medmanage.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.*;
import com.medmanage.entity.DeviceToken;
import com.medmanage.entity.Notification;
import com.medmanage.repository.DeviceTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class PushNotificationService {

    @Autowired
    private DeviceTokenRepository deviceTokenRepository;

    @Autowired
    private NotificationService notificationService;

    // 初始化Firebase Admin SDK
    @PostConstruct
    public void initialize() {
        try {
            // 注意：需要将firebase-admin.json文件放在resources目录下
            // 或者使用环境变量配置
            ClassPathResource serviceAccount = new ClassPathResource("firebase-admin.json");
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                log.info("Firebase Admin SDK initialized successfully");
            }
        } catch (IOException e) {
            log.error("Error initializing Firebase Admin SDK: {}", e.getMessage());
            // 开发环境可以暂时忽略，生产环境必须配置
        }
    }

    // 注册设备token
    public void registerDeviceToken(String userId, String token, String deviceType) {
        try {
            // 检查是否已存在该token
            DeviceToken existingToken = deviceTokenRepository.findByToken(token);
            if (existingToken != null) {
                // 更新现有token
                existingToken.setUserId(userId);
                existingToken.setDeviceType(deviceType);
                deviceTokenRepository.save(existingToken);
            } else {
                // 创建新token记录
                DeviceToken newToken = new DeviceToken();
                newToken.setUserId(userId);
                newToken.setToken(token);
                newToken.setDeviceType(deviceType);
                deviceTokenRepository.save(newToken);
            }
            log.info("Device token registered successfully for user {}", userId);
        } catch (Exception e) {
            log.error("Error registering device token: {}", e.getMessage());
        }
    }

    // 发送推送通知给指定用户
    public void sendNotificationToUser(String userId, String title, String body, Map<String, String> data) {
        try {
            // 保存到数据库
            Notification notification = new Notification();
            notification.setUserId(userId);
            notification.setTitle(title);
            notification.setContent(body);
            notification.setType("push");
            notification.setIsRead(false);
            notificationService.save(notification);

            // 获取用户的所有设备token
            List<DeviceToken> deviceTokens = deviceTokenRepository.findByUserId(userId);
            if (deviceTokens.isEmpty()) {
                log.warn("No device tokens found for user {}", userId);
                return;
            }

            // 发送通知到每个设备
            for (DeviceToken deviceToken : deviceTokens) {
                if ("Android".equals(deviceToken.getDeviceType())) {
                    sendAndroidNotification(deviceToken.getToken(), title, body, data);
                } else if ("iOS".equals(deviceToken.getDeviceType())) {
                    sendIOSNotification(deviceToken.getToken(), title, body, data);
                }
            }
        } catch (Exception e) {
            log.error("Error sending notification: {}", e.getMessage());
        }
    }

    // 发送Android通知
    private void sendAndroidNotification(String token, String title, String body, Map<String, String> data) {
        try {
            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(com.google.firebase.messaging.Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .putAllData(data)
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Android notification sent successfully: {}", response);
        } catch (Exception e) {
            log.error("Error sending Android notification: {}", e.getMessage());
        }
    }

    // 发送iOS通知
    private void sendIOSNotification(String token, String title, String body, Map<String, String> data) {
        try {
            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(com.google.firebase.messaging.Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .putAllData(data)
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("iOS notification sent successfully: {}", response);
        } catch (Exception e) {
            log.error("Error sending iOS notification: {}", e.getMessage());
        }
    }
}
