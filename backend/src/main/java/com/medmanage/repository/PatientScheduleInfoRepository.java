package com.medmanage.repository;

import com.medmanage.entity.PatientScheduleInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientScheduleInfoRepository extends JpaRepository<PatientScheduleInfo, Long> {
    
    Optional<PatientScheduleInfo> findByTxNumber(String txNumber);
    Optional<PatientScheduleInfo> findByTxZyid(String txZyid);
    List<PatientScheduleInfo> findByTxState(Integer txState);
    List<PatientScheduleInfo> findByTxNameContaining(String txName);
    void deleteByTxNumber(String txNumber);
}