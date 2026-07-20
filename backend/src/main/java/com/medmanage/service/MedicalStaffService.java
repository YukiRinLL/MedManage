package com.medmanage.service;

import com.medmanage.entity.MedicalStaff;
import com.medmanage.entity.PatientStaffRelation;
import com.medmanage.repository.MedicalStaffRepository;
import com.medmanage.repository.PatientStaffRelationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class MedicalStaffService {

    @Autowired
    private MedicalStaffRepository medicalStaffRepository;

    @Autowired
    private PatientStaffRelationRepository patientStaffRelationRepository;

    public List<MedicalStaff> getAllActive() {
        return medicalStaffRepository.findByIsActiveTrueOrderByName();
    }

    public List<MedicalStaff> getByType(String staffType) {
        return medicalStaffRepository.findByStaffTypeAndIsActiveTrueOrderByName(staffType);
    }

    public MedicalStaff getById(String id) {
        return medicalStaffRepository.findById(id).orElse(null);
    }

    public MedicalStaff create(MedicalStaff staff) {
        return medicalStaffRepository.save(staff);
    }

    public MedicalStaff update(String id, MedicalStaff staff) {
        MedicalStaff existing = medicalStaffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("医护人员不存在"));
        existing.setName(staff.getName());
        existing.setPosition(staff.getPosition());
        existing.setDepartment(staff.getDepartment());
        existing.setPhone(staff.getPhone());
        existing.setEmail(staff.getEmail());
        existing.setStaffType(staff.getStaffType());
        existing.setIsActive(staff.getIsActive());
        return medicalStaffRepository.save(existing);
    }

    public void delete(String id) {
        medicalStaffRepository.deleteById(id);
    }

    public List<MedicalStaff> getPatientStaff(String patientId) {
        List<PatientStaffRelation> relations = patientStaffRelationRepository.findByPatientIdAndIsActiveTrue(patientId);
        List<MedicalStaff> staffList = new ArrayList<>();
        for (PatientStaffRelation relation : relations) {
            medicalStaffRepository.findById(relation.getStaffId()).ifPresent(staffList::add);
        }
        return staffList;
    }

    public MedicalStaff getPatientNurse(String patientId) {
        List<PatientStaffRelation> relations = patientStaffRelationRepository.findByPatientIdAndRelationTypeAndIsActiveTrue(patientId, "nurse");
        if (!relations.isEmpty()) {
            return medicalStaffRepository.findById(relations.get(0).getStaffId()).orElse(null);
        }
        return null;
    }

    public MedicalStaff getPatientDoctor(String patientId) {
        List<PatientStaffRelation> relations = patientStaffRelationRepository.findByPatientIdAndRelationTypeAndIsActiveTrue(patientId, "doctor");
        if (!relations.isEmpty()) {
            return medicalStaffRepository.findById(relations.get(0).getStaffId()).orElse(null);
        }
        return null;
    }

    public PatientStaffRelation assignStaff(String patientId, String staffId, String relationType) {
        PatientStaffRelation relation = new PatientStaffRelation();
        relation.setPatientId(patientId);
        relation.setStaffId(staffId);
        relation.setRelationType(relationType);
        relation.setStartDate(new Date());
        relation.setIsActive(true);
        return patientStaffRelationRepository.save(relation);
    }

    public void unassignStaff(String relationId) {
        PatientStaffRelation relation = patientStaffRelationRepository.findById(relationId)
                .orElseThrow(() -> new RuntimeException("关系不存在"));
        relation.setIsActive(false);
        relation.setEndDate(new Date());
        patientStaffRelationRepository.save(relation);
    }
}