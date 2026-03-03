package com.medmanage.repository;

import com.medmanage.entity.ActivityParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityParticipantRepository extends JpaRepository<ActivityParticipant, String> {
    List<ActivityParticipant> findByActivityIdOrderByParticipateTimeDesc(String activityId);
    List<ActivityParticipant> findByUserIdOrderByParticipateTimeDesc(String userId);
    ActivityParticipant findByActivityIdAndUserId(String activityId, String userId);
    boolean existsByActivityIdAndUserId(String activityId, String userId);
    boolean existsByActivityIdAndUserIdAndStatus(String activityId, String userId, Integer status);
}
