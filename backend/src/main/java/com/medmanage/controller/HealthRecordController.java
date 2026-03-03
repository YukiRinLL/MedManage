package com.medmanage.controller;

import com.medmanage.entity.HealthRecord;
import com.medmanage.service.HealthRecordService;
import com.medmanage.util.JwtUtil;
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
    
    @GetMapping("/list")
    public Map<String, Object> getHealthRecordList(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String bloodType) {
        Map<String, Object> result = new HashMap<>();
        try {
            Map<String, Object> data = healthRecordService.listHealthRecords(page, size, name, bloodType);
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
}
