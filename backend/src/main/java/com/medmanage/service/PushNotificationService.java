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
import java.util.ArrayList;
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
    public void registerDeviceToken(Long userId, String token, String deviceType) {
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
    public void sendNotificationToUser(Long userId, String title, String body, Map<String, String> data) {
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
            log.error("Error sending notification to user {}: {}", userId, e.getMessage());
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
            // 注意：iOS通知需要通过APNs发送
            // 这里简化处理，实际需要实现APNs发送逻辑
            // 可以使用第三方库如java-apns或直接调用APNs API
            log.info("iOS notification would be sent to token: {}", token);
            log.info("Title: {}, Body: {}, Data: {}", title, body, data);
        } catch (Exception e) {
            log.error("Error sending iOS notification: {}", e.getMessage());
        }
    }

    // 发送批量通知
    public void sendBatchNotifications(List<Long> userIds, String title, String body, Map<String, String> data) {
        for (Long userId : userIds) {
            sendNotificationToUser(userId, title, body, data);
        }
    }

    // 发送服药提醒
    public void sendMedicationReminder(Long userId, String medicationName, String dosage, String time) {
        String title = "服药提醒";
        String body = String.format("该服用%s了，剂量：%s", medicationName, dosage);
        Map<String, String> data = new java.util.HashMap<>();
        data.put("type", "medication_reminder");
        data.put("time", time);
        data.put("medicationName", medicationName);
        sendNotificationToUser(userId, title, body, data);
    }

    // 发送复诊提醒
    public void sendAppointmentReminder(Long userId, String doctorName, String department, String dateTime) {
        String title = "复诊提醒";
        String body = String.format("您预约了%s医生的%s，时间：%s", doctorName, department, dateTime);
        Map<String, String> data = new java.util.HashMap<>();
        data.put("type", "appointment_reminder");
        data.put("doctorName", doctorName);
        data.put("department", department);
        data.put("dateTime", dateTime);
        sendNotificationToUser(userId, title, body, data);
    }
}
