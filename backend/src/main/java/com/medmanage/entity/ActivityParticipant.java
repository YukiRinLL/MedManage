package com.medmanage.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_participants")
public class ActivityParticipant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "activity_id", nullable = false)
    private Long activityId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "participate_time")
    private LocalDateTime participateTime;
    
    @Column(name = "status")
    private Integer status = 1;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getParticipateTime() {
        return participateTime;
    }

    public void setParticipateTime(LocalDateTime participateTime) {
        this.participateTime = participateTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
