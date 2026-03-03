package com.medmanage.service;

import com.medmanage.entity.HealthRecord;
import com.medmanage.repository.HealthRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

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
    
    public HealthRecord findByUserId(String userId) {
        return healthRecordRepository.findByUserId(userId);
    }
    
    public Map<String, Object> listHealthRecords(int page, int size, String name, String bloodType) {
        Map<String, Object> result = new HashMap<>();
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<HealthRecord> recordPage = healthRecordRepository.findAll(pageable);
        result.put("list", recordPage.getContent());
        result.put("total", recordPage.getTotalElements());
        return result;
    }
}
