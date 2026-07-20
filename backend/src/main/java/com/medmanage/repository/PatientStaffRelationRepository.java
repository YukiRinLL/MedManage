package com.medmanage.repository;

import com.medmanage.entity.PatientStaffRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientStaffRelationRepository extends JpaRepository<PatientStaffRelation, String> {
    List<PatientStaffRelation> findByPatientIdAndIsActiveTrue(String patientId);
    
    List<PatientStaffRelation> findByPatientIdAndRelationTypeAndIsActiveTrue(String patientId, String relationType);
    
    @Query("SELECT r FROM PatientStaffRelation r WHERE r.patientId = :patientId AND r.isActive = true")
    List<PatientStaffRelation> findActiveRelationsByPatientId(@Param("patientId") String patientId);
}