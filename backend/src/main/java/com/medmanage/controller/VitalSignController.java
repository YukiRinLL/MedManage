package com.medmanage.controller;

import com.medmanage.entity.VitalSign;
import com.medmanage.service.VitalSignService;
import com.medmanage.util.JwtUtil;
import com.medmanage.util.RedisUtil;
import com.medmanage.util.ResponseUtil;
import org.springframework.http.ResponseEntity;
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

    @Autowired
    private RedisUtil redisUtil;
    
    @PostMapping("/add")
    public Map<String, Object> saveVitalSign(@RequestHeader("Authorization") String token, @RequestBody VitalSign vitalSign) {
        Map<String, Object> result = new HashMap<>();
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
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
            String userId = jwtUtil.getUserIdFromToken(token);
            List<VitalSign> vitalSigns = vitalSignService.findByUserId(userId);
            result.put("code", 200);
            result.put("data", vitalSigns);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/latest/{userId}")
    public Map<String, Object> getLatestVitalSign(@PathVariable String userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<VitalSign> vitalSigns = vitalSignService.findByUserId(userId);
            if (vitalSigns != null && !vitalSigns.isEmpty()) {
                result.put("code", 200);
                result.put("data", vitalSigns.get(0));
            } else {
                result.put("code", 200);
                result.put("data", null);
            }
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/admin/list")
    public ResponseEntity<Map<String, Object>> listForAdmin(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) String userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (!isAdmin(token)) return ResponseUtil.forbidden("无管理员权限");
        return ResponseUtil.success(vitalSignService.listForAdmin(userId, page, size));
    }

    @PostMapping("/admin")
    public ResponseEntity<Map<String, Object>> createForAdmin(
            @RequestHeader("Authorization") String token, @RequestBody VitalSign vitalSign) {
        if (!isAdmin(token)) return ResponseUtil.forbidden("无管理员权限");
        return ResponseUtil.success(vitalSignService.save(vitalSign));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<Map<String, Object>> updateForAdmin(
            @RequestHeader("Authorization") String token,
            @PathVariable String id,
            @RequestBody VitalSign vitalSign) {
        if (!isAdmin(token)) return ResponseUtil.forbidden("无管理员权限");
        return ResponseUtil.success(vitalSignService.update(id, vitalSign));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Map<String, Object>> deleteForAdmin(
            @RequestHeader("Authorization") String token, @PathVariable String id) {
        if (!isAdmin(token)) return ResponseUtil.forbidden("无管理员权限");
        vitalSignService.delete(id);
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
