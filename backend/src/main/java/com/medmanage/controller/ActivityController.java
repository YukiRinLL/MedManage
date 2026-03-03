package com.medmanage.controller;

import com.medmanage.entity.Activity;
import com.medmanage.service.ActivityService;
import com.medmanage.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/activity")
public class ActivityController {
    
    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/create")
    public Map<String, Object> createActivity(@RequestHeader(value = "Authorization", required = false) String token, @RequestBody Activity activity) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (token != null && !token.isEmpty()) {
                String adminId = jwtUtil.getUserIdFromToken(token);
                activity.setCreatedBy(adminId);
            } else {
                activity.setCreatedBy("1");
            }
            Activity createdActivity = activityService.save(activity);
            result.put("code", 200);
            result.put("message", "创建成功");
            result.put("data", createdActivity);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PutMapping("/update/{id}")
    public Map<String, Object> updateActivity(@RequestHeader("Authorization") String token, @PathVariable String id, @RequestBody Activity activity) {
        Map<String, Object> result = new HashMap<>();
        try {
            Activity updatedActivity = activityService.update(id, activity);
            result.put("code", 200);
            result.put("message", "更新成功");
            result.put("data", updatedActivity);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/list")
    public Map<String, Object> listActivities(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String title) {
        Map<String, Object> result = new HashMap<>();
        try {
            Map<String, Object> data = activityService.listActivities(page, size, status, title);
            result.put("code", 200);
            result.put("message", "获取成功");
            result.put("data", data);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/{id}")
    public Map<String, Object> getActivity(@PathVariable String id) {
        Map<String, Object> result = new HashMap<>();
        try {
            Activity activity = activityService.findById(id);
            result.put("code", 200);
            result.put("data", activity);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteActivity(@RequestHeader("Authorization") String token, @PathVariable String id) {
        Map<String, Object> result = new HashMap<>();
        try {
            activityService.deleteActivity(id);
            result.put("code", 200);
            result.put("message", "删除成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/active")
    public Map<String, Object> getActiveActivities() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Activity> activities = activityService.findByStatus(1);
            result.put("code", 200);
            result.put("data", activities);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
