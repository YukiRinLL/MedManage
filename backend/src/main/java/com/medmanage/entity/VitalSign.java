package com.medmanage.entity;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "vital_signs")
public class VitalSign {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;
    
    @Column(name = "user_id", columnDefinition = "VARCHAR(36)")
    private String userId;
    
    private Double temperature;
    private Integer systolicPressure;
    private Integer diastolicPressure;
    private Integer bloodSugar;
    private Integer heartRate;
    private String notes;
    
    @Column(name = "record_time", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date recordTime;
    
    @Column(name = "created_at", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }
}
