package com.medmanage.controller;

import com.medmanage.entity.Feedback;
import com.medmanage.service.FeedbackService;
import com.medmanage.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/submit")
    public Map<String, Object> submitFeedback(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> result = new HashMap<>();
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            String userName = (String) request.get("userName");
            String userPhone = (String) request.get("userPhone");
            String type = (String) request.get("type");
            String content = (String) request.get("content");
            Integer satisfactionScore = (Integer) request.get("satisfactionScore");
            
            Feedback feedback = feedbackService.submitFeedback(userId, userName, userPhone, type, content, satisfactionScore);
            result.put("code", 200);
            result.put("message", "提交成功");
            result.put("data", feedback);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/list")
    public Map<String, Object> listFeedbacks(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> result = new HashMap<>();
        try {
            Page<Feedback> feedbackPage = feedbackService.listFeedbacks(page, size);
            Map<String, Object> data = new HashMap<>();
            data.put("content", feedbackPage.getContent());
            data.put("totalElements", feedbackPage.getTotalElements());
            data.put("totalPages", feedbackPage.getTotalPages());
            data.put("currentPage", page);
            result.put("code", 200);
            result.put("data", data);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/user/list")
    public Map<String, Object> getUserFeedbacks(@RequestHeader("Authorization") String token) {
        Map<String, Object> result = new HashMap<>();
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            List<Feedback> feedbacks = feedbackService.getFeedbackByUserId(userId);
            result.put("code", 200);
            result.put("data", feedbacks);
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/{id}")
    public Map<String, Object> getFeedbackById(@PathVariable String id) {
        Map<String, Object> result = new HashMap<>();
        try {
            Feedback feedback = feedbackService.getFeedbackById(id);
            if (feedback != null) {
                result.put("code", 200);
                result.put("data", feedback);
            } else {
                result.put("code", 404);
                result.put("message", "反馈不存在");
            }
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @PutMapping("/{id}/respond")
    public Map<String, Object> respondFeedback(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        Map<String, Object> result = new HashMap<>();
        try {
            String response = request.get("response");
            Feedback feedback = feedbackService.respondFeedback(id, response);
            if (feedback != null) {
                result.put("code", 200);
                result.put("message", "回复成功");
                result.put("data", feedback);
            } else {
                result.put("code", 404);
                result.put("message", "反馈不存在");
            }
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteFeedback(@PathVariable String id) {
        Map<String, Object> result = new HashMap<>();
        try {
            feedbackService.deleteFeedback(id);
            result.put("code", 200);
            result.put("message", "删除成功");
        } catch (Exception e) {
            result.put("code", 400);
            result.put("message", e.getMessage());
        }
        return result;
    }
}