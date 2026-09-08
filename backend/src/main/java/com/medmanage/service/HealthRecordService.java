package com.medmanage.service;

import com.medmanage.entity.HealthRecord;
import com.medmanage.repository.HealthRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class HealthRecordService {
    @Autowired
    private HealthRecordRepository healthRecordRepository;
    
    @Transactional
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
    
    public Map<String, Object> listHealthRecords(int page, int size, String name, String bloodType, String userId) {
        Map<String, Object> result = new HashMap<>();
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<HealthRecord> recordPage;
        if (userId != null && !userId.trim().isEmpty()) {
            HealthRecord record = healthRecordRepository.findByUserId(userId);
            java.util.List<HealthRecord> records = record == null ? java.util.Collections.emptyList() : java.util.Collections.singletonList(record);
            result.put("list", records);
            result.put("total", records.size());
            return result;
        }
        recordPage = healthRecordRepository.findAll(pageable);
        result.put("list", recordPage.getContent());
        result.put("total", recordPage.getTotalElements());
        return result;
    }

    @Transactional
    public HealthRecord saveForAdmin(HealthRecord record) {
        HealthRecord existing = healthRecordRepository.findByUserId(record.getUserId());
        if (existing == null) return healthRecordRepository.save(record);
        record.setId(existing.getId());
        return copyFields(record, existing);
    }

    @Transactional
    public HealthRecord updateForAdmin(String id, HealthRecord record) {
        HealthRecord existing = healthRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("健康档案不存在"));
        return copyFields(record, existing);
    }

    private HealthRecord copyFields(HealthRecord source, HealthRecord target) {
        target.setUserId(source.getUserId());
        target.setPastMedicalHistory(source.getPastMedicalHistory());
        target.setAllergicHistory(source.getAllergicHistory());
        target.setFamilyMedicalHistory(source.getFamilyMedicalHistory());
        target.setBloodType(source.getBloodType());
        target.setOtherInfo(source.getOtherInfo());
        target.setAge(source.getAge());
        target.setDialysisYears(source.getDialysisYears());
        target.setBasicDiseases(source.getBasicDiseases());
        target.setComplications(source.getComplications());
        target.setDialysisPlan(source.getDialysisPlan());
        target.setRegistrationInfo(source.getRegistrationInfo());
        target.setEmergencyContactName(source.getEmergencyContactName());
        target.setEmergencyContactPhone(source.getEmergencyContactPhone());
        return healthRecordRepository.save(target);
    }

    public HealthRecord findById(String id) {
        return healthRecordRepository.findById(id).orElse(null);
    }

    @Transactional
    public void deleteById(String id) {
        healthRecordRepository.deleteById(id);
    }
}
