package com.medmanage.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "medication_records")
public class MedicationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    private String medicationName;
    private String dosage;
    private String frequency;
    private Boolean taken;
    private String notes;
    
    @Column(name = "medication_time", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date medicationTime;
    
    @Column(name = "created_at", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }
}
