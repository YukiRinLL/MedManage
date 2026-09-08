package com.medmanage.service;

import com.medmanage.entity.ImprovementPlan;
import com.medmanage.repository.ImprovementPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

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

    public Map<String, Object> listForAdmin(String userId, String status, int page, int size) {
        List<ImprovementPlan> plans = improvementPlanRepository.findAll();
        plans.sort((left, right) -> {
            if (left.getCreatedAt() == null) return 1;
            if (right.getCreatedAt() == null) return -1;
            return right.getCreatedAt().compareTo(left.getCreatedAt());
        });
        plans.removeIf(plan -> userId != null && !userId.trim().isEmpty() && !userId.equals(plan.getUserId()));
        plans.removeIf(plan -> status != null && !status.trim().isEmpty() && !status.equals(plan.getStatus()));
        int safePage = Math.max(page, 1);
        int safeSize = Math.max(size, 1);
        int from = Math.min((safePage - 1) * safeSize, plans.size());
        int to = Math.min(from + safeSize, plans.size());
        Map<String, Object> result = new HashMap<>();
        result.put("list", plans.subList(from, to));
        result.put("total", plans.size());
        return result;
    }

    public ImprovementPlan complete(String id) {
        ImprovementPlan plan = improvementPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("方案不存在"));
        plan.setStatus("completed");
        plan.setEndDate(new Date());
        return improvementPlanRepository.save(plan);
    }
}
