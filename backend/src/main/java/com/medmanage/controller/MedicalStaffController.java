package com.medmanage.controller;

import com.medmanage.entity.MedicalStaff;
import com.medmanage.entity.PatientStaffRelation;
import com.medmanage.service.MedicalStaffService;
import com.medmanage.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/medical-staff")
public class MedicalStaffController {

    @Autowired
    private MedicalStaffService medicalStaffService;

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getList(@RequestParam(required = false) String staffType) {
        List<MedicalStaff> list;
        if (staffType != null && !staffType.isEmpty()) {
            list = medicalStaffService.getByType(staffType);
        } else {
            list = medicalStaffService.getAllActive();
        }
        return ResponseUtil.success(list);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<Map<String, Object>> getDetail(@PathVariable String id) {
        MedicalStaff staff = medicalStaffService.getById(id);
        if (staff == null) {
            return ResponseUtil.notFound("医护人员不存在");
        }
        return ResponseUtil.success(staff);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Map<String, Object>> getPatientStaff(@PathVariable String patientId) {
        List<MedicalStaff> list = medicalStaffService.getPatientStaff(patientId);
        return ResponseUtil.success(list);
    }

    @GetMapping("/patient/{patientId}/nurse")
    public ResponseEntity<Map<String, Object>> getPatientNurse(@PathVariable String patientId) {
        MedicalStaff nurse = medicalStaffService.getPatientNurse(patientId);
        return ResponseUtil.success(nurse);
    }

    @GetMapping("/patient/{patientId}/doctor")
    public ResponseEntity<Map<String, Object>> getPatientDoctor(@PathVariable String patientId) {
        MedicalStaff doctor = medicalStaffService.getPatientDoctor(patientId);
        return ResponseUtil.success(doctor);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody MedicalStaff staff) {
        MedicalStaff created = medicalStaffService.create(staff);
        return ResponseUtil.success(created);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id, @RequestBody MedicalStaff staff) {
        MedicalStaff updated = medicalStaffService.update(id, staff);
        return ResponseUtil.success(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        medicalStaffService.delete(id);
        return ResponseUtil.success("删除成功");
    }

    @PostMapping("/assign")
    public ResponseEntity<Map<String, Object>> assignStaff(
            @RequestParam String patientId,
            @RequestParam String staffId,
            @RequestParam String relationType) {
        PatientStaffRelation relation = medicalStaffService.assignStaff(patientId, staffId, relationType);
        return ResponseUtil.success(relation);
    }

    @PutMapping("/unassign/{relationId}")
    public ResponseEntity<Map<String, Object>> unassignStaff(@PathVariable String relationId) {
        medicalStaffService.unassignStaff(relationId);
        return ResponseUtil.success("解绑成功");
    }
}