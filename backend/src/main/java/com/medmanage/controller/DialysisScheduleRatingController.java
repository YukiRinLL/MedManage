package com.medmanage.controller;

import com.medmanage.entity.DialysisScheduleRating;
import com.medmanage.service.DialysisScheduleRatingService;
import com.medmanage.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dialysis-schedule-rating")
public class DialysisScheduleRatingController {
    
    @Autowired
    private DialysisScheduleRatingService ratingService;
    
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createRating(@RequestBody DialysisScheduleRating rating) {
        try {
            if (rating.getScheduleId() == null) {
                return ResponseUtil.badRequest("排班ID不能为空");
            }
            DialysisScheduleRating created = ratingService.createRating(rating);
            return ResponseUtil.success(created);
        } catch (Exception e) {
            return ResponseUtil.badRequest("提交评价失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<Map<String, Object>> getByScheduleId(@PathVariable Long scheduleId) {
        try {
            List<DialysisScheduleRating> ratings = ratingService.getByScheduleId(scheduleId);
            return ResponseUtil.success(ratings);
        } catch (Exception e) {
            return ResponseUtil.badRequest("获取评价失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getByUserId(@PathVariable String userId) {
        try {
            List<DialysisScheduleRating> ratings = ratingService.getByUserId(userId);
            return ResponseUtil.success(ratings);
        } catch (Exception e) {
            return ResponseUtil.badRequest("获取评价失败: " + e.getMessage());
        }
    }
    
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> hasRated(
            @RequestParam Long scheduleId,
            @RequestParam String userId) {
        try {
            boolean rated = ratingService.hasRated(scheduleId, userId);
            return ResponseUtil.success(rated);
        } catch (Exception e) {
            return ResponseUtil.badRequest("检查评价状态失败: " + e.getMessage());
        }
    }
}
