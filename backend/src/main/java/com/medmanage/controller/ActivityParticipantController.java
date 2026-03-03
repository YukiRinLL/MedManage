package com.medmanage.controller;

import com.medmanage.entity.Activity;
import com.medmanage.entity.ActivityParticipant;
import com.medmanage.entity.User;
import com.medmanage.service.ActivityParticipantService;
import com.medmanage.service.ActivityService;
import com.medmanage.service.UserService;
import com.medmanage.util.JwtUtil;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/activity-participant")
public class ActivityParticipantController {
    @Autowired
    private ActivityParticipantService activityParticipantService;
    
    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;
    
    @PostMapping("/join")
    public Map<String, Object> joinActivity(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            String activityId = params.get("activityId");
            
            // 检查活动是否存在
            Activity activity = activityService.findById(activityId);
            if (activity == null) {
                result.put("code", 404);
                result.put("message", "活动不存在");
                return result;
            }
            
            // 检查活动是否已满员
            if (activity.getMaxParticipants() != null && activity.getCurrentParticipants() != null) {
                if (activity.getCurrentParticipants() >= activity.getMaxParticipants()) {
                    result.put("code", 400);
                    result.put("message", "活动已满员，无法报名");
                    return result;
                }
            }
            
            if (activityParticipantService.isJoined(activityId, userId)) {
                result.put("code", 400);
                result.put("message", "您已经参加过此活动");
                return result;
            }
            
            ActivityParticipant existing = activityParticipantService.findByActivityIdAndUserId(activityId, userId);
            if (existing != null) {
                existing.setStatus(1);
                existing.setParticipateTime(LocalDateTime.now());
                activityParticipantService.save(existing);
            } else {
                ActivityParticipant participant = new ActivityParticipant();
                participant.setActivityId(activityId);
                participant.setUserId(userId);
                participant.setStatus(1);
                activityParticipantService.save(participant);
            }
            
            activityService.incrementParticipants(activityId);
            
            result.put("code", 200);
            result.put("message", "报名成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PostMapping("/cancel")
    public Map<String, Object> cancelActivity(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            String activityId = params.get("activityId");
            
            activityParticipantService.cancelParticipation(activityId, userId);
            activityService.decrementParticipants(activityId);
            
            result.put("code", 200);
            result.put("message", "取消报名成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/list/{activityId}")
    public Map<String, Object> getParticipants(@PathVariable String activityId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<ActivityParticipant> participants = activityParticipantService.findByActivityId(activityId);
            result.put("code", 200);
            result.put("data", participants);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/my-activities")
    public Map<String, Object> getMyActivities(@RequestHeader("Authorization") String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            List<ActivityParticipant> participants = activityParticipantService.findByUserId(userId);
            result.put("code", 200);
            result.put("data", participants);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/export/{activityId}")
    public ResponseEntity<byte[]> exportParticipants(@PathVariable String activityId) {
        try {
            Activity activity = activityService.findById(activityId);
            if (activity == null) {
                return ResponseEntity.notFound().build();
            }

            List<ActivityParticipant> participants = activityParticipantService.findByActivityId(activityId);

            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("参与者列表");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "用户ID", "用户姓名", "手机号", "性别", "年龄", "身份证号", "紧急联系人", "紧急联系人电话", "地址", "参与时间", "状态"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            int rowNum = 1;
            for (ActivityParticipant participant : participants) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(participant.getId());
                row.createCell(1).setCellValue(participant.getUserId());

                User user = userService.findById(participant.getUserId());
                if (user != null) {
                    row.createCell(2).setCellValue(user.getName());
                    row.createCell(3).setCellValue(user.getPhone());
                    row.createCell(4).setCellValue(user.getGender() != null ? (user.getGender() == 1 ? "男" : "女") : "");
                    row.createCell(5).setCellValue(user.getAge() != null ? user.getAge() : 0);
                    row.createCell(6).setCellValue(user.getIdCard() != null ? user.getIdCard() : "");
                    row.createCell(7).setCellValue(user.getEmergencyContact() != null ? user.getEmergencyContact() : "");
                    row.createCell(8).setCellValue(user.getEmergencyPhone() != null ? user.getEmergencyPhone() : "");
                    row.createCell(9).setCellValue(user.getAddress() != null ? user.getAddress() : "");
                } else {
                    row.createCell(2).setCellValue("");
                    row.createCell(3).setCellValue("");
                    row.createCell(4).setCellValue("");
                    row.createCell(5).setCellValue(0);
                    row.createCell(6).setCellValue("");
                    row.createCell(7).setCellValue("");
                    row.createCell(8).setCellValue("");
                    row.createCell(9).setCellValue("");
                }

                if (participant.getParticipateTime() != null) {
                    row.createCell(10).setCellValue(participant.getParticipateTime().format(formatter));
                } else {
                    row.createCell(10).setCellValue("");
                }
                row.createCell(11).setCellValue(participant.getStatus() == 1 ? "已报名" : "已取消");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();

            byte[] bytes = outputStream.toByteArray();
            outputStream.close();

            String fileName = URLEncoder.encode(activity.getTitle() + "参与者列表.xlsx", StandardCharsets.UTF_8.toString());

            HttpHeaders headers1 = new HttpHeaders();
            headers1.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers1.setContentDispositionFormData("attachment", fileName);
            headers1.setContentLength(bytes.length);

            return ResponseEntity.ok()
                    .headers(headers1)
                    .body(bytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
