package com.medmanage.service;

import com.medmanage.entity.Diagnosis;
import com.medmanage.repository.DiagnosisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DiagnosisService {
    
    @Autowired
    private DiagnosisRepository diagnosisRepository;
    
    public List<Diagnosis> getDiagnosesByUserId(String userId) {
        return diagnosisRepository.findByUserId(userId);
    }
    
    public Diagnosis getDiagnosisById(UUID id) {
        return diagnosisRepository.findById(id).orElse(null);
    }
    
    @Transactional
    public Diagnosis saveDiagnosis(Diagnosis diagnosis) {
        return diagnosisRepository.save(diagnosis);
    }
    
    @Transactional
    public void deleteDiagnosis(UUID id) {
        diagnosisRepository.deleteById(id);
    }
    
    @Transactional
    public void deleteDiagnosesByUserId(String userId) {
        List<Diagnosis> diagnoses = diagnosisRepository.findByUserId(userId);
        diagnosisRepository.deleteAll(diagnoses);
    }
}
