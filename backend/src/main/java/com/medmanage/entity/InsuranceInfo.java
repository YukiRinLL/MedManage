package com.medmanage.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "insurance_info")
public class InsuranceInfo {
    
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;
    
    @Column(name = "patient_id", nullable = false, length = 50)
    private String patientId;
    
    @Column(name = "dialysis_number", length = 50)
    private String dialysisNumber;
    
    @Column(name = "insured_area_code", length = 6)
    private String insuredAreaCode;
    
    @Column(name = "insured_area_name", length = 100)
    private String insuredAreaName;
    
    @Column(name = "insured_date")
    private LocalDateTime insuredDate;
    
    @Column(name = "psn_type_code", length = 10)
    private String psnTypeCode;
    
    @Column(name = "psn_type_text", length = 100)
    private String psnTypeText;
    
    @Column(name = "civil_servant_flag")
    private Integer civilServantFlag;
    
    @Column(name = "unit_name", length = 200)
    private String unitName;
    
    @Column(name = "insurance_status")
    private Integer insuranceStatus;
    
    @Column(name = "insurance_type_code", length = 10)
    private String insuranceTypeCode;
    
    @Column(name = "personal_account_balance")
    private Double personalAccountBalance;
    
    @Column(name = "suspend_date")
    private LocalDateTime suspendDate;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getDialysisNumber() {
        return dialysisNumber;
    }

    public void setDialysisNumber(String dialysisNumber) {
        this.dialysisNumber = dialysisNumber;
    }

    public String getInsuredAreaCode() {
        return insuredAreaCode;
    }

    public void setInsuredAreaCode(String insuredAreaCode) {
        this.insuredAreaCode = insuredAreaCode;
    }

    public String getInsuredAreaName() {
        return insuredAreaName;
    }

    public void setInsuredAreaName(String insuredAreaName) {
        this.insuredAreaName = insuredAreaName;
    }

    public LocalDateTime getInsuredDate() {
        return insuredDate;
    }

    public void setInsuredDate(LocalDateTime insuredDate) {
        this.insuredDate = insuredDate;
    }

    public String getPsnTypeCode() {
        return psnTypeCode;
    }

    public void setPsnTypeCode(String psnTypeCode) {
        this.psnTypeCode = psnTypeCode;
    }

    public String getPsnTypeText() {
        return psnTypeText;
    }

    public void setPsnTypeText(String psnTypeText) {
        this.psnTypeText = psnTypeText;
    }

    public Integer getCivilServantFlag() {
        return civilServantFlag;
    }

    public void setCivilServantFlag(Integer civilServantFlag) {
        this.civilServantFlag = civilServantFlag;
    }

    public String getUnitName() {
        return unitName;
    }

    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }

    public Integer getInsuranceStatus() {
        return insuranceStatus;
    }

    public void setInsuranceStatus(Integer insuranceStatus) {
        this.insuranceStatus = insuranceStatus;
    }

    public String getInsuranceTypeCode() {
        return insuranceTypeCode;
    }

    public void setInsuranceTypeCode(String insuranceTypeCode) {
        this.insuranceTypeCode = insuranceTypeCode;
    }

    public Double getPersonalAccountBalance() {
        return personalAccountBalance;
    }

    public void setPersonalAccountBalance(Double personalAccountBalance) {
        this.personalAccountBalance = personalAccountBalance;
    }

    public LocalDateTime getSuspendDate() {
        return suspendDate;
    }

    public void setSuspendDate(LocalDateTime suspendDate) {
        this.suspendDate = suspendDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}