package com.medmanage.service;

import com.medmanage.entity.ActivityParticipant;
import com.medmanage.repository.ActivityParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityParticipantService {
    @Autowired
    private ActivityParticipantRepository activityParticipantRepository;
    
    @Transactional
    public ActivityParticipant save(ActivityParticipant participant) {
        participant.setParticipateTime(LocalDateTime.now());
        participant.setCreatedAt(LocalDateTime.now());
        return activityParticipantRepository.save(participant);
    }
    
    public ActivityParticipant findById(String id) {
        return activityParticipantRepository.findById(id).orElse(null);
    }
    
    public List<ActivityParticipant> findByActivityId(String activityId) {
        return activityParticipantRepository.findByActivityIdOrderByParticipateTimeDesc(activityId);
    }
    
    public List<ActivityParticipant> findByUserId(String userId) {
        return activityParticipantRepository.findByUserIdOrderByParticipateTimeDesc(userId);
    }
    
    public ActivityParticipant findByActivityIdAndUserId(String activityId, String userId) {
        return activityParticipantRepository.findByActivityIdAndUserId(activityId, userId);
    }
    
    public boolean existsByActivityIdAndUserId(String activityId, String userId) {
        return activityParticipantRepository.existsByActivityIdAndUserId(activityId, userId);
    }
    
    public boolean isJoined(String activityId, String userId) {
        return activityParticipantRepository.existsByActivityIdAndUserIdAndStatus(activityId, userId, 1);
    }
    
    @Transactional
    public void deleteParticipant(String id) {
        activityParticipantRepository.deleteById(id);
    }
    
    @Transactional
    public void cancelParticipation(String activityId, String userId) {
        ActivityParticipant participant = activityParticipantRepository.findByActivityIdAndUserId(activityId, userId);
        if (participant != null) {
            participant.setStatus(0);
            activityParticipantRepository.save(participant);
        }
    }
}
