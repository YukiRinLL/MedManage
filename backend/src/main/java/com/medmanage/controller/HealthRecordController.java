package com.medmanage.controller;

import com.medmanage.entity.HealthRecord;
import com.medmanage.service.HealthRecordService;
import com.medmanage.util.JwtUtil;
import com.medmanage.util.RedisUtil;
import com.medmanage.util.ResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health-record")
public class HealthRecordController {
    @Autowired
    private HealthRecordService healthRecordService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RedisUtil redisUtil;
    
    @GetMapping("/list")
    public Map<String, Object> getHealthRecordList(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String bloodType,
            @RequestParam(required = false) String userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            Map<String, Object> data = healthRecordService.listHealthRecords(page, size, name, bloodType, userId);
            result.put("code", 200);
            result.put("message", "获取成功");
            result.put("data", data);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/info")
    public Map<String, Object> getHealthRecord(@RequestHeader("Authorization") String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            HealthRecord healthRecord = healthRecordService.findByUserId(userId);
            result.put("code", 200);
            result.put("data", healthRecord);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PostMapping("/save")
    public Map<String, Object> saveHealthRecord(@RequestHeader("Authorization") String token, @RequestBody HealthRecord healthRecord) {
        Map<String, Object> result = new HashMap<>();
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            healthRecord.setUserId(userId);
            HealthRecord savedRecord = healthRecordService.saveOrUpdate(healthRecord);
            result.put("code", 200);
            result.put("message", "保存成功");
            result.put("data", savedRecord);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PutMapping("/update")
    public Map<String, Object> updateHealthRecord(@RequestHeader("Authorization") String token, @RequestBody HealthRecord healthRecord) {
        Map<String, Object> result = new HashMap<>();
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            healthRecord.setUserId(userId);
            HealthRecord updatedRecord = healthRecordService.saveOrUpdate(healthRecord);
            result.put("code", 200);
            result.put("message", "更新成功");
            result.put("data", updatedRecord);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(
            @RequestHeader("Authorization") String token, @PathVariable String id) {
        if (!isAdmin(token)) return ResponseUtil.forbidden("无管理员权限");
        HealthRecord record = healthRecordService.findById(id);
        return record == null ? ResponseUtil.notFound("健康档案不存在") : ResponseUtil.success(record);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createForAdmin(
            @RequestHeader("Authorization") String token, @RequestBody HealthRecord record) {
        if (!isAdmin(token)) return ResponseUtil.forbidden("无管理员权限");
        return ResponseUtil.success(healthRecordService.saveForAdmin(record));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> updateForAdmin(
            @RequestHeader("Authorization") String token,
            @PathVariable String id,
            @RequestBody HealthRecord record) {
        if (!isAdmin(token)) return ResponseUtil.forbidden("无管理员权限");
        return ResponseUtil.success(healthRecordService.updateForAdmin(id, record));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteForAdmin(
            @RequestHeader("Authorization") String token, @PathVariable String id) {
        if (!isAdmin(token)) return ResponseUtil.forbidden("无管理员权限");
        healthRecordService.deleteById(id);
        return ResponseUtil.success("删除成功");
    }

    private boolean isAdmin(String token) {
        try {
            String adminId = jwtUtil.getUserIdFromToken(token);
            Object stored = redisUtil.get("admin:" + adminId + ":token");
            return stored != null && token.replace("Bearer ", "").equals(stored.toString());
        } catch (Exception e) {
            return false;
        }
    }
}
