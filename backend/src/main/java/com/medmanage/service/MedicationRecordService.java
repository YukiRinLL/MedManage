package com.medmanage.service;

import com.medmanage.entity.MedicationRecord;
import com.medmanage.repository.MedicationRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MedicationRecordService {
    @Autowired
    private MedicationRecordRepository medicationRecordRepository;
    
    @Transactional
    public MedicationRecord save(MedicationRecord medicationRecord) {
        return medicationRecordRepository.save(medicationRecord);
    }
    
    public List<MedicationRecord> findByUserId(String userId) {
        return medicationRecordRepository.findByUserIdOrderByMedicationTimeDesc(userId);
    }
    
    public Map<String, Object> listMedicationRecords(int page, int size, String name, String medicationName, Boolean taken) {
        Map<String, Object> result = new HashMap<>();
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "medicationTime"));
        Page<MedicationRecord> recordPage = medicationRecordRepository.findAll(pageable);
        result.put("list", recordPage.getContent());
        result.put("total", recordPage.getTotalElements());
        return result;
    }
    
    @Transactional
    public void updateTakenStatus(String id, Boolean taken) {
        MedicationRecord record = medicationRecordRepository.findById(id).orElse(null);
        if (record != null) {
            record.setTaken(taken);
            medicationRecordRepository.save(record);
        }
    }
}
