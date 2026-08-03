package com.medmanage.service;

import com.medmanage.entity.DialysisScheduleRating;
import com.medmanage.repository.DialysisScheduleRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DialysisScheduleRatingService {
    
    @Autowired
    private DialysisScheduleRatingRepository ratingRepository;
    
    public DialysisScheduleRating createRating(DialysisScheduleRating rating) {
        return ratingRepository.save(rating);
    }
    
    public List<DialysisScheduleRating> getByScheduleId(Long scheduleId) {
        return ratingRepository.findByScheduleId(scheduleId);
    }
    
    public List<DialysisScheduleRating> getByUserId(String userId) {
        return ratingRepository.findByUserId(userId);
    }
    
    public List<DialysisScheduleRating> getByScheduleIdAndUserId(Long scheduleId, String userId) {
        return ratingRepository.findByScheduleIdAndUserId(scheduleId, userId);
    }
    
    public boolean hasRated(Long scheduleId, String userId) {
        List<DialysisScheduleRating> ratings = ratingRepository.findByScheduleIdAndUserId(scheduleId, userId);
        return !ratings.isEmpty();
    }
}
