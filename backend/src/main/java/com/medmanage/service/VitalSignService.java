package com.medmanage.service;

import com.medmanage.entity.VitalSign;
import com.medmanage.repository.VitalSignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class VitalSignService {
    @Autowired
    private VitalSignRepository vitalSignRepository;
    
    @Transactional
    public VitalSign save(VitalSign vitalSign) {
        return vitalSignRepository.save(vitalSign);
    }
    
    public List<VitalSign> findByUserId(String userId) {
        return vitalSignRepository.findByUserIdOrderByRecordTimeDesc(userId);
    }

    public Map<String, Object> listForAdmin(String userId, int page, int size) {
        List<VitalSign> records = vitalSignRepository.findAllByOrderByRecordTimeDesc();
        if (userId != null && !userId.trim().isEmpty()) {
            records.removeIf(record -> !userId.equals(record.getUserId()));
        }
        int safePage = Math.max(page, 1);
        int safeSize = Math.max(size, 1);
        int from = Math.min((safePage - 1) * safeSize, records.size());
        int to = Math.min(from + safeSize, records.size());
        Map<String, Object> result = new HashMap<>();
        result.put("list", records.subList(from, to));
        result.put("total", records.size());
        return result;
    }

    @Transactional
    public VitalSign update(String id, VitalSign input) {
        VitalSign existing = vitalSignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("生命体征记录不存在"));
        existing.setUserId(input.getUserId());
        existing.setTemperature(input.getTemperature());
        existing.setWeight(input.getWeight());
        existing.setMorningSystolicPressure(input.getMorningSystolicPressure());
        existing.setMorningDiastolicPressure(input.getMorningDiastolicPressure());
        existing.setEveningSystolicPressure(input.getEveningSystolicPressure());
        existing.setEveningDiastolicPressure(input.getEveningDiastolicPressure());
        existing.setBloodSugar(input.getBloodSugar());
        existing.setHeartRate(input.getHeartRate());
        existing.setWaterIntake(input.getWaterIntake());
        existing.setDietRecord(input.getDietRecord());
        existing.setNotes(input.getNotes());
        existing.setRecordTime(input.getRecordTime());
        return vitalSignRepository.save(existing);
    }

    @Transactional
    public void delete(String id) {
        vitalSignRepository.deleteById(id);
    }
}
