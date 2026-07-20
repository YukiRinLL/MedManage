package com.medmanage.repository;

import com.medmanage.entity.ImprovementPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImprovementPlanRepository extends JpaRepository<ImprovementPlan, String> {
    List<ImprovementPlan> findByUserIdOrderByCreatedAtDesc(String userId);
    
    ImprovementPlan findFirstByUserIdAndStatusOrderByCreatedAtDesc(String userId, String status);
    
    List<ImprovementPlan> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, String status);
}