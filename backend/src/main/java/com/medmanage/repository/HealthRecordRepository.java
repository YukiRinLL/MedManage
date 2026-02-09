package com.medmanage.repository;

import com.medmanage.entity.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {
    HealthRecord findByUserId(Long userId);
}
