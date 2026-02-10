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
        // 首先根据用户ID查询是否已有健康档案记录
        HealthRecord existingRecord = healthRecordRepository.findByUserId(healthRecord.getUserId());
        
        if (existingRecord != null) {
            // 如果有，更新该记录
            existingRecord.setPastMedicalHistory(healthRecord.getPastMedicalHistory());
            existingRecord.setAllergicHistory(healthRecord.getAllergicHistory());
            existingRecord.setFamilyMedicalHistory(healthRecord.getFamilyMedicalHistory());
            existingRecord.setBloodType(healthRecord.getBloodType());
            existingRecord.setOtherInfo(healthRecord.getOtherInfo());
            return healthRecordRepository.save(existingRecord);
        } else {
            // 如果没有，创建一个新记录
            return healthRecordRepository.save(healthRecord);
        }
    }
    
    public HealthRecord findByUserId(Long userId) {
        return healthRecordRepository.findByUserId(userId);
    }
}
