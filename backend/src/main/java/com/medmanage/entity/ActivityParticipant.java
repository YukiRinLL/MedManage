package com.medmanage.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_participants")
public class ActivityParticipant {
    
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;
    
    @Column(name = "activity_id", nullable = false, columnDefinition = "VARCHAR(36)")
    private String activityId;
    
    @Column(name = "user_id", nullable = false, columnDefinition = "VARCHAR(36)")
    private String userId;
    
    @Column(name = "participate_time")
    private LocalDateTime participateTime;
    
    @Column(name = "status")
    private Integer status = 1;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getActivityId() {
        return activityId;
    }

    public void setActivityId(String activityId) {
        this.activityId = activityId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
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
