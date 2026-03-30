package com.medmanage.service;

import com.medmanage.entity.VitalSign;
import com.medmanage.repository.VitalSignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
}
