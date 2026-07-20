package com.medmanage.service;

import com.medmanage.entity.BloodTest;
import com.medmanage.repository.BloodTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BloodTestService {

    @Autowired
    private BloodTestRepository bloodTestRepository;

    public BloodTest getLatest(String userId) {
        return bloodTestRepository.findFirstByUserIdOrderByTestDateDesc(userId);
    }

    public List<BloodTest> getAllByUser(String userId) {
        return bloodTestRepository.findByUserIdOrderByTestDateDesc(userId);
    }

    public List<BloodTest> getByYear(String userId, int year) {
        return bloodTestRepository.findByUserIdAndYear(userId, year);
    }

    public List<BloodTest> getByQuarter(String userId, int year, int quarter) {
        return bloodTestRepository.findByUserIdAndYearQuarter(userId, year, quarter);
    }

    public List<BloodTest> getByDateRange(String userId, Date startDate, Date endDate) {
        return bloodTestRepository.findByUserIdAndDateRange(userId, startDate, endDate);
    }

    public List<BloodTest> getRecent12Months(String userId) {
        Calendar cal = Calendar.getInstance();
        Date endDate = cal.getTime();
        cal.add(Calendar.MONTH, -12);
        Date startDate = cal.getTime();
        return bloodTestRepository.findByUserIdAndDateRange(userId, startDate, endDate);
    }

    public BloodTest getById(String id) {
        return bloodTestRepository.findById(id).orElse(null);
    }

    public BloodTest create(BloodTest bloodTest) {
        return bloodTestRepository.save(bloodTest);
    }

    public BloodTest update(String id, BloodTest bloodTest) {
        BloodTest existing = bloodTestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("检查记录不存在"));
        existing.setTestDate(bloodTest.getTestDate());
        existing.setTestType(bloodTest.getTestType());
        existing.setHemoglobin(bloodTest.getHemoglobin());
        existing.setSerumCreatinine(bloodTest.getSerumCreatinine());
        existing.setUreaNitrogen(bloodTest.getUreaNitrogen());
        existing.setUricAcid(bloodTest.getUricAcid());
        existing.setPotassium(bloodTest.getPotassium());
        existing.setSodium(bloodTest.getSodium());
        existing.setChloride(bloodTest.getChloride());
        existing.setCalcium(bloodTest.getCalcium());
        existing.setPhosphorus(bloodTest.getPhosphorus());
        existing.setAlbumin(bloodTest.getAlbumin());
        existing.setTotalCholesterol(bloodTest.getTotalCholesterol());
        existing.setTriglycerides(bloodTest.getTriglycerides());
        existing.setHdlCholesterol(bloodTest.getHdlCholesterol());
        existing.setLdlCholesterol(bloodTest.getLdlCholesterol());
        existing.setParathyroidHormone(bloodTest.getParathyroidHormone());
        existing.setNotes(bloodTest.getNotes());
        return bloodTestRepository.save(existing);
    }

    public void delete(String id) {
        bloodTestRepository.deleteById(id);
    }
}