package com.medmanage.entity;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;
    
    @Column(name = "phone", unique = true, nullable = false, length = 20)
    private String phone;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "name", nullable = false, length = 50)
    private String name;
    
    @Column(name = "gender")
    private Integer gender; // 性别(0:女,1:男)
    
    @Column(name = "age")
    private Integer age;
    
    @Column(name = "id_card", length = 18)
    private String idCard;
    
    @Column(name = "emergency_contact", length = 50)
    private String emergencyContact;
    
    @Column(name = "emergency_phone", length = 20)
    private String emergencyPhone;
    
    @Column(name = "address", length = 200)
    private String address;
    
    @Column(name = "tx_number", unique = true, length = 50) // 透析号
    private String txNumber;
    
    @Column(name = "nation", length = 20) // 民族
    private String nation;
    
    @Column(name = "birth_date") // 出生日期
    @JsonDeserialize(using = BirthDateDeserializer.class)
    private LocalDateTime birthDate;
    
    @Column(name = "postal_code", length = 10) // 邮政编码
    private String postalCode;
    
    @Column(name = "email", length = 100) // 邮箱
    private String email;
    
    @Column(name = "insurance_type", length = 50) // 保险类型
    private String insuranceType;
    
    @Column(name = "medical_cert_type", length = 50) // 就医凭证类型
    private String medicalCertType;
    
    @Column(name = "electronic_medical_id", length = 50) // 电子医保号
    private String electronicMedicalId;
    
    @Column(name = "diagnosis", length = 500) // 诊断信息
    private String diagnosis;
    
    @Column(name = "hospitalization_status") // 住院状态 (1=住院)
    private Integer hospitalizationStatus;
    
    @Column(name = "admission_date") // 入院日期
    @JsonDeserialize(using = BirthDateDeserializer.class)
    private LocalDateTime admissionDate;
    
    @Column(name = "discharge_date") // 出院日期
    @JsonDeserialize(using = BirthDateDeserializer.class)
    private LocalDateTime dischargeDate;
    
    @Column(name = "patient_type") // 患者类型 (0=普通患者)
    private Integer patientType;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getGender() {
        return gender;
    }

    public void setGender(Integer gender) {
        this.gender = gender;
    }

    // 不使用数据库中的age字段，而是通过生日动态计算年龄
    public Integer getAge() {
        if (birthDate == null) {
            return null;
        }
        java.time.LocalDate birth = birthDate.toLocalDate();
        java.time.LocalDate now = java.time.LocalDate.now();
        return java.time.Period.between(birth, now).getYears();
    }

    // 不设置年龄，年龄通过生日动态计算
    public void setAge(Integer age) {
        // 忽略设置年龄的操作，年龄通过生日动态计算
    }

    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getEmergencyPhone() {
        return emergencyPhone;
    }

    public void setEmergencyPhone(String emergencyPhone) {
        this.emergencyPhone = emergencyPhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    // 新添加字段的getter和setter方法
    public String getTxNumber() {
        return txNumber;
    }

    public void setTxNumber(String txNumber) {
        this.txNumber = txNumber;
    }

    public String getNation() {
        return nation;
    }

    public void setNation(String nation) {
        this.nation = nation;
    }

    public LocalDateTime getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDateTime birthDate) {
        this.birthDate = birthDate;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getInsuranceType() {
        return insuranceType;
    }

    public void setInsuranceType(String insuranceType) {
        this.insuranceType = insuranceType;
    }

    public String getMedicalCertType() {
        return medicalCertType;
    }

    public void setMedicalCertType(String medicalCertType) {
        this.medicalCertType = medicalCertType;
    }

    public String getElectronicMedicalId() {
        return electronicMedicalId;
    }

    public void setElectronicMedicalId(String electronicMedicalId) {
        this.electronicMedicalId = electronicMedicalId;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public Integer getHospitalizationStatus() {
        return hospitalizationStatus;
    }

    public void setHospitalizationStatus(Integer hospitalizationStatus) {
        this.hospitalizationStatus = hospitalizationStatus;
    }

    public LocalDateTime getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDateTime admissionDate) {
        this.admissionDate = admissionDate;
    }

    public LocalDateTime getDischargeDate() {
        return dischargeDate;
    }

    public void setDischargeDate(LocalDateTime dischargeDate) {
        this.dischargeDate = dischargeDate;
    }

    public Integer getPatientType() {
        return patientType;
    }

    public void setPatientType(Integer patientType) {
        this.patientType = patientType;
    }

    // 自定义出生日期反序列化器
    public static class BirthDateDeserializer extends com.fasterxml.jackson.databind.JsonDeserializer<LocalDateTime> {
        @Override
        public LocalDateTime deserialize(com.fasterxml.jackson.core.JsonParser p, com.fasterxml.jackson.databind.DeserializationContext ctxt) throws java.io.IOException {
            String value = p.getValueAsString();
            try {
                // 尝试解析为ISO_DATE_TIME格式（如：2023-12-01T12:00:00）
                return LocalDateTime.parse(value, DateTimeFormatter.ISO_DATE_TIME);
            } catch (DateTimeParseException e) {
                try {
                    // 如果失败，尝试解析为日期格式（如：2023-12-01）
                    return LocalDateTime.parse(value + "T00:00:00", DateTimeFormatter.ISO_DATE_TIME);
                } catch (DateTimeParseException ex) {
                    throw new java.io.IOException("Failed to parse date: " + value, ex);
                }
            }
        }
    }
}
