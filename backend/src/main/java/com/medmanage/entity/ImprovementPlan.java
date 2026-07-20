package com.medmanage.entity;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "improvement_plans")
public class ImprovementPlan {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(name = "user_id", columnDefinition = "VARCHAR(36)")
    private String userId;

    @Column(name = "plan_name", length = 100)
    private String planName;

    @Column(name = "health_score")
    private Integer healthScore;

    @Column(name = "abnormal_indicators", length = 500)
    private String abnormalIndicators;

    @Column(name = "diet_plan", columnDefinition = "TEXT")
    private String dietPlan;

    @Column(name = "water_control_plan", columnDefinition = "TEXT")
    private String waterControlPlan;

    @Column(name = "lifestyle_suggestions", columnDefinition = "TEXT")
    private String lifestyleSuggestions;

    @Column(name = "medication_adjustments", columnDefinition = "TEXT")
    private String medicationAdjustments;

    @Column(name = "follow_up_notes", columnDefinition = "TEXT")
    private String followUpNotes;

    @Column(name = "risk_level", length = 20)
    private String riskLevel;

    @Column(name = "status", length = 20)
    private String status = "active";

    @Column(name = "start_date")
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Column(name = "end_date")
    @Temporal(TemporalType.DATE)
    private Date endDate;

    @Column(name = "created_at", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}