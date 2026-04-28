package com.medmanage.controller;

import com.medmanage.entity.PatientScheduleInfo;
import com.medmanage.service.PatientScheduleInfoService;
import com.medmanage.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patient-schedule")
public class PatientScheduleInfoController {
    
    @Autowired
    private PatientScheduleInfoService patientScheduleInfoService;
    
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getAllPatientInfos() {
        try {
            List<PatientScheduleInfo> patientInfos = patientScheduleInfoService.getAllPatientInfos();
            return ResponseUtil.success(patientInfos);
        } catch (Exception e) {
            return ResponseUtil.badRequest("获取患者信息失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/number/{txNumber}")
    public ResponseEntity<Map<String, Object>> getPatientInfoByNumber(@PathVariable String txNumber) {
        try {
            PatientScheduleInfo patientInfo = patientScheduleInfoService.getPatientInfoByNumber(txNumber);
            if (patientInfo == null) {
                return ResponseUtil.badRequest("患者信息不存在");
            }
            return ResponseUtil.success(patientInfo);
        } catch (Exception e) {
            return ResponseUtil.badRequest("获取患者信息失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/zyid/{txZyid}")
    public ResponseEntity<Map<String, Object>> getPatientInfoByZyid(@PathVariable String txZyid) {
        try {
            PatientScheduleInfo patientInfo = patientScheduleInfoService.getPatientInfoByZyid(txZyid);
            if (patientInfo == null) {
                return ResponseUtil.badRequest("患者信息不存在");
            }
            return ResponseUtil.success(patientInfo);
        } catch (Exception e) {
            return ResponseUtil.badRequest("获取患者信息失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActivePatients() {
        try {
            List<PatientScheduleInfo> patientInfos = patientScheduleInfoService.getActivePatients();
            return ResponseUtil.success(patientInfos);
        } catch (Exception e) {
            return ResponseUtil.badRequest("获取活跃患者失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchPatients(@RequestParam String name) {
        try {
            List<PatientScheduleInfo> patientInfos = patientScheduleInfoService.searchPatientsByName(name);
            return ResponseUtil.success(patientInfos);
        } catch (Exception e) {
            return ResponseUtil.badRequest("搜索患者失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importPatientInfoData(@RequestBody List<Map<String, Object>> dataList) {
        try {
            patientScheduleInfoService.savePatientInfoData(dataList);
            return ResponseUtil.success("患者信息导入成功");
        } catch (Exception e) {
            return ResponseUtil.badRequest("导入患者信息失败: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/number/{txNumber}")
    public ResponseEntity<Map<String, Object>> deleteByPatientNumber(@PathVariable String txNumber) {
        try {
            patientScheduleInfoService.deleteByPatientNumber(txNumber);
            return ResponseUtil.success("删除患者信息成功");
        } catch (Exception e) {
            return ResponseUtil.badRequest("删除患者信息失败: " + e.getMessage());
        }
    }
}