package com.medmanage.controller;

import com.medmanage.entity.VitalSign;
import com.medmanage.service.VitalSignService;
import com.medmanage.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vital-sign")
public class VitalSignController {
    @Autowired
    private VitalSignService vitalSignService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/save")
    public Map<String, Object> saveVitalSign(@RequestHeader("Authorization") String token, @RequestBody VitalSign vitalSign) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            vitalSign.setUserId(userId);
            VitalSign savedSign = vitalSignService.save(vitalSign);
            result.put("code", 200);
            result.put("message", "保存成功");
            result.put("data", savedSign);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/list")
    public Map<String, Object> getVitalSignList(@RequestHeader("Authorization") String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            List<VitalSign> vitalSigns = vitalSignService.findByUserId(userId);
            result.put("code", 200);
            result.put("data", vitalSigns);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
