package com.medmanage.service;

import com.medmanage.entity.VitalSign;
import com.medmanage.repository.VitalSignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VitalSignService {
    @Autowired
    private VitalSignRepository vitalSignRepository;
    
    public VitalSign save(VitalSign vitalSign) {
        return vitalSignRepository.save(vitalSign);
    }
    
    public List<VitalSign> findByUserId(Long userId) {
        return vitalSignRepository.findByUserIdOrderByRecordTimeDesc(userId);
    }
}
