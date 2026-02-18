package com.medmanage.controller;

import com.medmanage.entity.ActivityParticipant;
import com.medmanage.service.ActivityParticipantService;
import com.medmanage.service.ActivityService;
import com.medmanage.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/activity-participant")
public class ActivityParticipantController {
    @Autowired
    private ActivityParticipantService activityParticipantService;
    
    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/join")
    public Map<String, Object> joinActivity(@RequestHeader("Authorization") String token, @RequestBody Map<String, Long> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            Long activityId = params.get("activityId");
            
            if (activityParticipantService.existsByActivityIdAndUserId(activityId, userId)) {
                result.put("code", 400);
                result.put("message", "您已经参加过此活动");
                return result;
            }
            
            ActivityParticipant participant = new ActivityParticipant();
            participant.setActivityId(activityId);
            participant.setUserId(userId);
            participant.setStatus(1);
            
            activityParticipantService.save(participant);
            activityService.incrementParticipants(activityId);
            
            result.put("code", 200);
            result.put("message", "报名成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PostMapping("/cancel")
    public Map<String, Object> cancelActivity(@RequestHeader("Authorization") String token, @RequestBody Map<String, Long> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            Long activityId = params.get("activityId");
            
            activityParticipantService.cancelParticipation(activityId, userId);
            activityService.decrementParticipants(activityId);
            
            result.put("code", 200);
            result.put("message", "取消报名成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/list/{activityId}")
    public Map<String, Object> getParticipants(@PathVariable Long activityId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<ActivityParticipant> participants = activityParticipantService.findByActivityId(activityId);
            result.put("code", 200);
            result.put("data", participants);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/my-activities")
    public Map<String, Object> getMyActivities(@RequestHeader("Authorization") String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            List<ActivityParticipant> participants = activityParticipantService.findByUserId(userId);
            result.put("code", 200);
            result.put("data", participants);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
