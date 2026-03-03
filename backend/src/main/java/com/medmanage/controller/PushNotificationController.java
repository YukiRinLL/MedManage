package com.medmanage.controller;

import com.medmanage.service.PushNotificationService;
import com.medmanage.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/push-notification")
public class PushNotificationController {

    @Autowired
    private PushNotificationService pushNotificationService;
    
    @Autowired
    private JwtUtil jwtUtil;

    // 注册设备token
    @PostMapping("/register")
    public ResponseEntity<?> registerDeviceToken(@RequestHeader("Authorization") String token,
                                                 @RequestBody Map<String, Object> request) {
        try {
            // 从token中解析用户ID
            Long userId = getUserIdFromToken(token);
            
            String deviceToken = (String) request.get("token");
            String deviceType = (String) request.getOrDefault("deviceType", "unknown");

            if (deviceToken == null) {
                return ResponseEntity.badRequest().body("Device token is required");
            }

            pushNotificationService.registerDeviceToken(userId, deviceToken, deviceType);
            return ResponseEntity.ok().body("Device token registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error registering device token: " + e.getMessage());
        }
    }

    // 测试发送推送通知
    @PostMapping("/test")
    public ResponseEntity<?> testNotification(@RequestHeader("Authorization") String token,
                                             @RequestBody Map<String, Object> request) {
        try {
            // 从token中解析用户ID
            Long userId = getUserIdFromToken(token);

            String title = (String) request.getOrDefault("title", "测试通知");
            String body = (String) request.getOrDefault("body", "这是一条测试推送通知");

            pushNotificationService.sendNotificationToUser(userId, title, body, new java.util.HashMap<>());
            return ResponseEntity.ok().body("Test notification sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending test notification: " + e.getMessage());
        }
    }

    // 发送服药提醒
    @PostMapping("/medication-reminder")
    public ResponseEntity<?> sendMedicationReminder(@RequestHeader("Authorization") String token,
                                                   @RequestBody Map<String, Object> request) {
        try {
            // 从token中解析用户ID
            Long userId = getUserIdFromToken(token);

            String medicationName = (String) request.get("medicationName");
            String dosage = (String) request.get("dosage");
            String time = (String) request.get("time");

            if (medicationName == null || dosage == null || time == null) {
                return ResponseEntity.badRequest().body("Missing required parameters");
            }

            pushNotificationService.sendMedicationReminder(userId, medicationName, dosage, time);
            return ResponseEntity.ok().body("Medication reminder sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending medication reminder: " + e.getMessage());
        }
    }

    // 发送复诊提醒
    @PostMapping("/appointment-reminder")
    public ResponseEntity<?> sendAppointmentReminder(@RequestHeader("Authorization") String token,
                                                    @RequestBody Map<String, Object> request) {
        try {
            // 从token中解析用户ID
            Long userId = getUserIdFromToken(token);

            String doctorName = (String) request.get("doctorName");
            String department = (String) request.get("department");
            String dateTime = (String) request.get("dateTime");

            if (doctorName == null || department == null || dateTime == null) {
                return ResponseEntity.badRequest().body("Missing required parameters");
            }

            pushNotificationService.sendAppointmentReminder(userId, doctorName, department, dateTime);
            return ResponseEntity.ok().body("Appointment reminder sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending appointment reminder: " + e.getMessage());
        }
    }

    // 从JWT token中解析用户ID
    private Long getUserIdFromToken(String token) {
        // 移除Bearer前缀
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        // 使用JwtUtil解析用户ID
        return jwtUtil.getUserIdFromToken(token);
    }
}
