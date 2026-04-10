package com.medmanage.service;

import com.medmanage.entity.InsuranceInfo;
import com.medmanage.repository.InsuranceInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InsuranceInfoService {
    
    @Autowired
    private InsuranceInfoRepository insuranceInfoRepository;
    
    public InsuranceInfo save(InsuranceInfo insuranceInfo) {
        return insuranceInfoRepository.save(insuranceInfo);
    }
    
    public Optional<InsuranceInfo> findById(String id) {
        return insuranceInfoRepository.findById(id);
    }
    
    public List<InsuranceInfo> findByPatientId(String patientId) {
        return insuranceInfoRepository.findByPatientId(patientId);
    }
    
    public List<InsuranceInfo> findByDialysisNumber(String dialysisNumber) {
        return insuranceInfoRepository.findByDialysisNumber(dialysisNumber);
    }
    
    public List<InsuranceInfo> findAll() {
        return insuranceInfoRepository.findAll();
    }
    
    public void deleteById(String id) {
        insuranceInfoRepository.deleteById(id);
    }
}