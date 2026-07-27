package com.medmanage.service;

import com.medmanage.entity.Feedback;
import com.medmanage.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class FeedbackService {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    public Feedback submitFeedback(String userId, String userName, String userPhone, String type, String content, Integer satisfactionScore) {
        Feedback feedback = new Feedback();
        feedback.setId(UUID.randomUUID().toString());
        feedback.setUserId(userId);
        feedback.setUserName(userName);
        feedback.setUserPhone(userPhone);
        feedback.setType(type);
        feedback.setContent(content);
        feedback.setSatisfactionScore(satisfactionScore);
        feedback.setStatus("pending");
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setUpdatedAt(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }
    
    public Page<Feedback> listFeedbacks(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return feedbackRepository.findAll(pageable);
    }
    
    public List<Feedback> getFeedbackByUserId(String userId) {
        return feedbackRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public Feedback getFeedbackById(String id) {
        return feedbackRepository.findById(id).orElse(null);
    }
    
    public Feedback respondFeedback(String id, String response) {
        Feedback feedback = feedbackRepository.findById(id).orElse(null);
        if (feedback != null) {
            feedback.setResponse(response);
            feedback.setStatus("responded");
            feedback.setUpdatedAt(LocalDateTime.now());
            return feedbackRepository.save(feedback);
        }
        return null;
    }
    
    public void deleteFeedback(String id) {
        feedbackRepository.deleteById(id);
    }
}