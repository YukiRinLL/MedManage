package com.medmanage.controller;

import com.medmanage.entity.MedicationRecord;
import com.medmanage.service.MedicationRecordService;
import com.medmanage.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/medication")
public class MedicationRecordController {
    @Autowired
    private MedicationRecordService medicationRecordService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/save")
    public Map<String, Object> saveMedicationRecord(@RequestHeader("Authorization") String token, @RequestBody MedicationRecord medicationRecord) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            medicationRecord.setUserId(userId);
            MedicationRecord savedRecord = medicationRecordService.save(medicationRecord);
            result.put("code", 200);
            result.put("message", "保存成功");
            result.put("data", savedRecord);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/list")
    public Map<String, Object> getMedicationRecordList(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String medicationName,
            @RequestParam(required = false) Boolean taken) {
        Map<String, Object> result = new HashMap<>();
        try {
            Map<String, Object> data = medicationRecordService.listMedicationRecords(page, size, name, medicationName, taken);
            result.put("code", 200);
            result.put("message", "获取成功");
            result.put("data", data);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PutMapping("/update-taken/{id}")
    public Map<String, Object> updateTakenStatus(@RequestHeader("Authorization") String token, @PathVariable Long id, @RequestBody Map<String, Boolean> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            Boolean taken = params.get("taken");
            medicationRecordService.updateTakenStatus(id, taken);
            result.put("code", 200);
            result.put("message", "更新成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
