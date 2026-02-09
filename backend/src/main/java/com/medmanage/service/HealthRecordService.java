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
        return healthRecordRepository.save(healthRecord);
    }
    
    public HealthRecord findByUserId(Long userId) {
        return healthRecordRepository.findByUserId(userId);
    }
}
