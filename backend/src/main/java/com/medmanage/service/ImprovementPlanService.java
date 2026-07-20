package com.medmanage.service;

import com.medmanage.entity.ImprovementPlan;
import com.medmanage.repository.ImprovementPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ImprovementPlanService {

    @Autowired
    private ImprovementPlanRepository improvementPlanRepository;

    public ImprovementPlan getCurrentPlan(String userId) {
        return improvementPlanRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(userId, "active");
    }

    public List<ImprovementPlan> getAllByUser(String userId) {
        return improvementPlanRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<ImprovementPlan> getActivePlans(String userId) {
        return improvementPlanRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, "active");
    }

    public ImprovementPlan getById(String id) {
        return improvementPlanRepository.findById(id).orElse(null);
    }

    public ImprovementPlan create(ImprovementPlan plan) {
        plan.setStartDate(new Date());
        plan.setStatus("active");
        return improvementPlanRepository.save(plan);
    }

    public ImprovementPlan update(String id, ImprovementPlan plan) {
        ImprovementPlan existing = improvementPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("方案不存在"));
        existing.setPlanName(plan.getPlanName());
        existing.setHealthScore(plan.getHealthScore());
        existing.setAbnormalIndicators(plan.getAbnormalIndicators());
        existing.setDietPlan(plan.getDietPlan());
        existing.setWaterControlPlan(plan.getWaterControlPlan());
        existing.setLifestyleSuggestions(plan.getLifestyleSuggestions());
        existing.setMedicationAdjustments(plan.getMedicationAdjustments());
        existing.setFollowUpNotes(plan.getFollowUpNotes());
        existing.setRiskLevel(plan.getRiskLevel());
        existing.setEndDate(plan.getEndDate());
        return improvementPlanRepository.save(existing);
    }

    public void delete(String id) {
        improvementPlanRepository.deleteById(id);
    }

    public ImprovementPlan complete(String id) {
        ImprovementPlan plan = improvementPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("方案不存在"));
        plan.setStatus("completed");
        plan.setEndDate(new Date());
        return improvementPlanRepository.save(plan);
    }
}