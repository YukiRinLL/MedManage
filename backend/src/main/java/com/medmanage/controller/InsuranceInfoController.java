package com.medmanage.controller;

import com.medmanage.entity.InsuranceInfo;
import com.medmanage.service.InsuranceInfoService;
import com.medmanage.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/insurance")
public class InsuranceInfoController {
    
    @Autowired
    private InsuranceInfoService insuranceInfoService;
    
    @PostMapping("/create")
    public Object create(@RequestBody InsuranceInfo insuranceInfo) {
        try {
            InsuranceInfo savedInsuranceInfo = insuranceInfoService.save(insuranceInfo);
            return ResponseUtil.success(savedInsuranceInfo);
        } catch (Exception e) {
            return ResponseUtil.error(400, "创建参保信息失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/get/{id}")
    public Object getById(@PathVariable String id) {
        try {
            return ResponseUtil.success(insuranceInfoService.findById(id));
        } catch (Exception e) {
            return ResponseUtil.error(400, "获取参保信息失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/by-patient/{patientId}")
    public Object getByPatientId(@PathVariable String patientId) {
        try {
            List<InsuranceInfo> insuranceInfos = insuranceInfoService.findByPatientId(patientId);
            return ResponseUtil.success(insuranceInfos);
        } catch (Exception e) {
            return ResponseUtil.error(400, "获取参保信息失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/by-dialysis/{dialysisNumber}")
    public Object getByDialysisNumber(@PathVariable String dialysisNumber) {
        try {
            List<InsuranceInfo> insuranceInfos = insuranceInfoService.findByDialysisNumber(dialysisNumber);
            return ResponseUtil.success(insuranceInfos);
        } catch (Exception e) {
            return ResponseUtil.error(400, "获取参保信息失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/list")
    public Object list() {
        try {
            List<InsuranceInfo> insuranceInfos = insuranceInfoService.findAll();
            return ResponseUtil.success(insuranceInfos);
        } catch (Exception e) {
            return ResponseUtil.error(400, "获取参保信息列表失败: " + e.getMessage());
        }
    }
    
    @PutMapping("/update")
    public Object update(@RequestBody InsuranceInfo insuranceInfo) {
        try {
            InsuranceInfo updatedInsuranceInfo = insuranceInfoService.save(insuranceInfo);
            return ResponseUtil.success(updatedInsuranceInfo);
        } catch (Exception e) {
            return ResponseUtil.error(400, "更新参保信息失败: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public Object delete(@PathVariable String id) {
        try {
            insuranceInfoService.deleteById(id);
            return ResponseUtil.success(null);
        } catch (Exception e) {
            return ResponseUtil.error(400, "删除参保信息失败: " + e.getMessage());
        }
    }
}