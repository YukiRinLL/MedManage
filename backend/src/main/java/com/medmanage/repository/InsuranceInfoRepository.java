package com.medmanage.repository;

import com.medmanage.entity.InsuranceInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsuranceInfoRepository extends JpaRepository<InsuranceInfo, String> {
    
    List<InsuranceInfo> findByPatientId(String patientId);
    
    List<InsuranceInfo> findByDialysisNumber(String dialysisNumber);
}