package com.medmanage.repository;

import com.medmanage.entity.VitalSign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VitalSignRepository extends JpaRepository<VitalSign, String> {
    List<VitalSign> findByUserIdOrderByRecordTimeDesc(String userId);
}
