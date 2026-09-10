package com.medmanage.repository;

import com.medmanage.entity.MedicationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRecordRepository extends JpaRepository<MedicationRecord, String> {
    List<MedicationRecord> findByUserIdOrderByMedicationTimeDesc(String userId);

    Page<MedicationRecord> findByUserId(String userId, Pageable pageable);
}
