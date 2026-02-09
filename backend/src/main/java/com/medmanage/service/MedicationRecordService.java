package com.medmanage.service;

import com.medmanage.entity.MedicationRecord;
import com.medmanage.repository.MedicationRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicationRecordService {
    @Autowired
    private MedicationRecordRepository medicationRecordRepository;
    
    public MedicationRecord save(MedicationRecord medicationRecord) {
        return medicationRecordRepository.save(medicationRecord);
    }
    
    public List<MedicationRecord> findByUserId(Long userId) {
        return medicationRecordRepository.findByUserIdOrderByMedicationTimeDesc(userId);
    }
    
    public void updateTakenStatus(Long id, Boolean taken) {
        MedicationRecord record = medicationRecordRepository.findById(id).orElse(null);
        if (record != null) {
            record.setTaken(taken);
            medicationRecordRepository.save(record);
        }
    }
}
