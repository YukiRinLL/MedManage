package com.medmanage.controller;

import com.medmanage.entity.Diagnosis;
import com.medmanage.service.DiagnosisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/diagnosis")
public class DiagnosisController {
    
    @Autowired
    private DiagnosisService diagnosisService;
    
    @GetMapping("/user/{userId}")
    public Map<String, Object> getDiagnosesByUserId(@PathVariable String userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Diagnosis> diagnoses = diagnosisService.getDiagnosesByUserId(userId);
            result.put("code", 200);
            result.put("message", "获取成功");
            result.put("data", diagnoses);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/{id}")
    public Map<String, Object> getDiagnosisById(@PathVariable UUID id) {
        Map<String, Object> result = new HashMap<>();
        try {
            Diagnosis diagnosis = diagnosisService.getDiagnosisById(id);
            result.put("code", 200);
            result.put("message", "获取成功");
            result.put("data", diagnosis);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PostMapping
    public Map<String, Object> createDiagnosis(@RequestBody Diagnosis diagnosis) {
        Map<String, Object> result = new HashMap<>();
        try {
            Diagnosis createdDiagnosis = diagnosisService.saveDiagnosis(diagnosis);
            result.put("code", 200);
            result.put("message", "创建成功");
            result.put("data", createdDiagnosis);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PutMapping("/{id}")
    public Map<String, Object> updateDiagnosis(@PathVariable UUID id, @RequestBody Diagnosis diagnosis) {
        Map<String, Object> result = new HashMap<>();
        try {
            diagnosis.setId(id);
            Diagnosis updatedDiagnosis = diagnosisService.saveDiagnosis(diagnosis);
            result.put("code", 200);
            result.put("message", "更新成功");
            result.put("data", updatedDiagnosis);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteDiagnosis(@PathVariable UUID id) {
        Map<String, Object> result = new HashMap<>();
        try {
            diagnosisService.deleteDiagnosis(id);
            result.put("code", 200);
            result.put("message", "删除成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @DeleteMapping("/user/{userId}")
    public Map<String, Object> deleteDiagnosesByUserId(@PathVariable String userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            diagnosisService.deleteDiagnosesByUserId(userId);
            result.put("code", 200);
            result.put("message", "删除成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
