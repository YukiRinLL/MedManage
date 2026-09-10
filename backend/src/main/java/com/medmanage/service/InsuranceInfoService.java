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
    
    public List<InsuranceInfo> findAll(String patientId, String dialysisNumber, String insuredAreaName, Integer insuranceStatus) {
        List<InsuranceInfo> records = insuranceInfoRepository.findAll();
        records.removeIf(record -> patientId != null && !patientId.trim().isEmpty()
                && !patientId.equals(record.getPatientId()));
        records.removeIf(record -> dialysisNumber != null && !dialysisNumber.trim().isEmpty()
                && !dialysisNumber.equals(record.getDialysisNumber()));
        records.removeIf(record -> insuredAreaName != null && !insuredAreaName.trim().isEmpty()
                && (record.getInsuredAreaName() == null || !record.getInsuredAreaName().contains(insuredAreaName.trim())));
        records.removeIf(record -> insuranceStatus != null && !insuranceStatus.equals(record.getInsuranceStatus()));
        return records;
    }
    
    public void deleteById(String id) {
        insuranceInfoRepository.deleteById(id);
    }
}
