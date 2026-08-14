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

    private Double weight;

    @Column(name = "morning_systolic_pressure")
    private Integer morningSystolicPressure;

    @Column(name = "morning_diastolic_pressure")
    private Integer morningDiastolicPressure;

    @Column(name = "evening_systolic_pressure")
    private Integer eveningSystolicPressure;

    @Column(name = "evening_diastolic_pressure")
    private Integer eveningDiastolicPressure;

    @Column(name = "blood_sugar")
    private Double bloodSugar;

    private Integer heartRate;

    @Column(name = "water_intake")
    private Integer waterIntake;

    @Column(name = "diet_record", columnDefinition = "TEXT")
    private String dietRecord;

    @Column(name = "notes", columnDefinition = "TEXT")
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
