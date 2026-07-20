package com.medmanage.repository;

import com.medmanage.entity.MedicalStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalStaffRepository extends JpaRepository<MedicalStaff, String> {
    List<MedicalStaff> findByIsActiveTrueOrderByName();
    
    List<MedicalStaff> findByStaffTypeAndIsActiveTrueOrderByName(String staffType);
}