package com.medmanage.repository;

import com.medmanage.entity.DialysisScheduleRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DialysisScheduleRatingRepository extends JpaRepository<DialysisScheduleRating, Long> {
    
    List<DialysisScheduleRating> findByScheduleId(Long scheduleId);
    
    List<DialysisScheduleRating> findByUserId(String userId);
    
    List<DialysisScheduleRating> findByScheduleIdAndUserId(Long scheduleId, String userId);
}
