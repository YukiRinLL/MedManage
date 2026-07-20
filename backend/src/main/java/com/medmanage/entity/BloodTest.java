package com.medmanage.entity;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "blood_tests")
public class BloodTest {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(name = "user_id", columnDefinition = "VARCHAR(36)")
    private String userId;

    @Column(name = "test_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date testDate;

    @Column(name = "test_type", length = 50)
    private String testType;

    @Column(name = "hemoglobin")
    private Double hemoglobin;

    @Column(name = "serum_creatinine")
    private Double serumCreatinine;

    @Column(name = "urea_nitrogen")
    private Double ureaNitrogen;

    @Column(name = "uric_acid")
    private Double uricAcid;

    @Column(name = "potassium")
    private Double potassium;

    @Column(name = "sodium")
    private Double sodium;

    @Column(name = "chloride")
    private Double chloride;

    @Column(name = "calcium")
    private Double calcium;

    @Column(name = "phosphorus")
    private Double phosphorus;

    @Column(name = "albumin")
    private Double albumin;

    @Column(name = "total_cholesterol")
    private Double totalCholesterol;

    @Column(name = "triglycerides")
    private Double triglycerides;

    @Column(name = "hdl_cholesterol")
    private Double hdlCholesterol;

    @Column(name = "ldl_cholesterol")
    private Double ldlCholesterol;

    @Column(name = "parathyroid_hormone")
    private Double parathyroidHormone;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "created_at", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }
}