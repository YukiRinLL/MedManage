package com.medmanage.repository;

import com.medmanage.entity.DialysisSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DialysisScheduleRepository extends JpaRepository<DialysisSchedule, Long> {
    
    List<DialysisSchedule> findByTxTxjId(String txTxjId);
    
    List<DialysisSchedule> findByNumber(String number);
    
    List<DialysisSchedule> findByWeek(Integer week);
    
    List<DialysisSchedule> findByTxPdrq(String txPdrq);
    
    Optional<DialysisSchedule> findByTxTxjIdAndTxPdrqType(String txTxjId, Integer txPdrqType);
    
    void deleteByTxTxjId(String txTxjId);
}