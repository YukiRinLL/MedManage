package com.medmanage.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dialysis_schedule_rating")
public class DialysisScheduleRating {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "schedule_id")
    private Long scheduleId;
    
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "user_name")
    private String userName;
    
    @Column(name = "overall_rating")
    private Integer overallRating;
    
    @Column(name = "nurse_rating")
    private Integer nurseRating;
    
    @Column(name = "env_rating")
    private Integer envRating;
    
    @Column(name = "equip_rating")
    private Integer equipRating;
    
    @Column(name = "comment")
    private String comment;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public DialysisScheduleRating() {
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getOverallRating() {
        return overallRating;
    }

    public void setOverallRating(Integer overallRating) {
        this.overallRating = overallRating;
    }

    public Integer getNurseRating() {
        return nurseRating;
    }

    public void setNurseRating(Integer nurseRating) {
        this.nurseRating = nurseRating;
    }

    public Integer getEnvRating() {
        return envRating;
    }

    public void setEnvRating(Integer envRating) {
        this.envRating = envRating;
    }

    public Integer getEquipRating() {
        return equipRating;
    }

    public void setEquipRating(Integer equipRating) {
        this.equipRating = equipRating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
