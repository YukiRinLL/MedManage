package com.medmanage.controller;

import com.medmanage.entity.DialysisSchedule;
import com.medmanage.service.DialysisScheduleService;
import com.medmanage.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dialysis-schedule")
public class DialysisScheduleController {
    
    @Autowired
    private DialysisScheduleService dialysisScheduleService;
    
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getAllSchedules() {
        try {
            List<DialysisSchedule> schedules = dialysisScheduleService.getAllSchedules();
            return ResponseUtil.success(schedules);
        } catch (Exception e) {
            return ResponseUtil.badRequest("获取排班数据失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/patient/{txTxjId}")
    public ResponseEntity<Map<String, Object>> getSchedulesByPatientId(@PathVariable String txTxjId) {
        try {
            List<DialysisSchedule> schedules = dialysisScheduleService.getSchedulesByPatientId(txTxjId);
            return ResponseUtil.success(schedules);
        } catch (Exception e) {
            return ResponseUtil.badRequest("获取患者排班数据失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/number/{number}")
    public ResponseEntity<Map<String, Object>> getSchedulesByPatientNumber(@PathVariable String number) {
        try {
            List<DialysisSchedule> schedules = dialysisScheduleService.getSchedulesByPatientNumber(number);
            return ResponseUtil.success(schedules);
        } catch (Exception e) {
            return ResponseUtil.badRequest("获取患者排班数据失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/week/{week}")
    public ResponseEntity<Map<String, Object>> getSchedulesByWeek(@PathVariable Integer week) {
        try {
            List<DialysisSchedule> schedules = dialysisScheduleService.getSchedulesByWeek(week);
            return ResponseUtil.success(schedules);
        } catch (Exception e) {
            return ResponseUtil.badRequest("获取周排班数据失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/date/{date}")
    public ResponseEntity<Map<String, Object>> getSchedulesByDate(@PathVariable String date) {
        try {
            List<DialysisSchedule> schedules = dialysisScheduleService.getSchedulesByDate(date);
            return ResponseUtil.success(schedules);
        } catch (Exception e) {
            return ResponseUtil.badRequest("获取日期排班数据失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importScheduleData(@RequestBody Map<String, Object> data) {
        try {
            dialysisScheduleService.saveScheduleData(data);
            return ResponseUtil.success("排班数据导入成功");
        } catch (Exception e) {
            return ResponseUtil.badRequest("导入排班数据失败: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/patient/{txTxjId}")
    public ResponseEntity<Map<String, Object>> deleteByPatientId(@PathVariable String txTxjId) {
        try {
            dialysisScheduleService.deleteByPatientId(txTxjId);
            return ResponseUtil.success("删除患者排班数据成功");
        } catch (Exception e) {
            return ResponseUtil.badRequest("删除患者排班数据失败: " + e.getMessage());
        }
    }
}