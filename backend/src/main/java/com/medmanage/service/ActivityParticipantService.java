package com.medmanage.service;

import com.medmanage.entity.ActivityParticipant;
import com.medmanage.repository.ActivityParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityParticipantService {
    @Autowired
    private ActivityParticipantRepository activityParticipantRepository;
    
    public ActivityParticipant save(ActivityParticipant participant) {
        participant.setParticipateTime(LocalDateTime.now());
        participant.setCreatedAt(LocalDateTime.now());
        return activityParticipantRepository.save(participant);
    }
    
    public ActivityParticipant findById(Long id) {
        return activityParticipantRepository.findById(id).orElse(null);
    }
    
    public List<ActivityParticipant> findByActivityId(Long activityId) {
        return activityParticipantRepository.findByActivityIdOrderByParticipateTimeDesc(activityId);
    }
    
    public List<ActivityParticipant> findByUserId(Long userId) {
        return activityParticipantRepository.findByUserIdOrderByParticipateTimeDesc(userId);
    }
    
    public ActivityParticipant findByActivityIdAndUserId(Long activityId, Long userId) {
        return activityParticipantRepository.findByActivityIdAndUserId(activityId, userId);
    }
    
    public boolean existsByActivityIdAndUserId(Long activityId, Long userId) {
        return activityParticipantRepository.existsByActivityIdAndUserId(activityId, userId);
    }
    
    public boolean isJoined(Long activityId, Long userId) {
        return activityParticipantRepository.existsByActivityIdAndUserIdAndStatus(activityId, userId, 1);
    }
    
    public void deleteParticipant(Long id) {
        activityParticipantRepository.deleteById(id);
    }
    
    public void cancelParticipation(Long activityId, Long userId) {
        ActivityParticipant participant = activityParticipantRepository.findByActivityIdAndUserId(activityId, userId);
        if (participant != null) {
            participant.setStatus(0);
            activityParticipantRepository.save(participant);
        }
    }
}
