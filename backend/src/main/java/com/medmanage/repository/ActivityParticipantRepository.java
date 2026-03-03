package com.medmanage.repository;

import com.medmanage.entity.ActivityParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityParticipantRepository extends JpaRepository<ActivityParticipant, Long> {
    List<ActivityParticipant> findByActivityIdOrderByParticipateTimeDesc(Long activityId);
    List<ActivityParticipant> findByUserIdOrderByParticipateTimeDesc(Long userId);
    ActivityParticipant findByActivityIdAndUserId(Long activityId, Long userId);
    boolean existsByActivityIdAndUserId(Long activityId, Long userId);
    boolean existsByActivityIdAndUserIdAndStatus(Long activityId, Long userId, Integer status);
}
