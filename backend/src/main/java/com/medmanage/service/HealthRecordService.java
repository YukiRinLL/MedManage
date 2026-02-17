package com.medmanage.service;

import com.medmanage.entity.HealthRecord;
import com.medmanage.repository.HealthRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HealthRecordService {
    @Autowired
    private HealthRecordRepository healthRecordRepository;
    
    public HealthRecord saveOrUpdate(HealthRecord healthRecord) {
        HealthRecord existingRecord = healthRecordRepository.findByUserId(healthRecord.getUserId());
        
        if (existingRecord != null) {
            existingRecord.setPastMedicalHistory(healthRecord.getPastMedicalHistory());
            existingRecord.setAllergicHistory(healthRecord.getAllergicHistory());
            existingRecord.setFamilyMedicalHistory(healthRecord.getFamilyMedicalHistory());
            existingRecord.setBloodType(healthRecord.getBloodType());
            existingRecord.setOtherInfo(healthRecord.getOtherInfo());
            return healthRecordRepository.save(existingRecord);
        } else {
            return healthRecordRepository.save(healthRecord);
        }
    }
    
    public HealthRecord findByUserId(Long userId) {
        return healthRecordRepository.findByUserId(userId);
    }
}
