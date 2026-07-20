package com.medmanage.repository;

import com.medmanage.entity.HealthEducation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthEducationRepository extends JpaRepository<HealthEducation, String> {
    List<HealthEducation> findByIsPublishedTrueOrderByPriorityDescCreatedAtDesc();
    
    List<HealthEducation> findByIsPublishedTrueAndCategoryOrderByPriorityDescCreatedAtDesc(String category);
    
    Page<HealthEducation> findByIsPublishedTrueOrderByPriorityDescCreatedAtDesc(Pageable pageable);
    
    Page<HealthEducation> findByCategoryOrderByPriorityDescCreatedAtDesc(String category, Pageable pageable);
    
    @Query("SELECT DISTINCT h.category FROM HealthEducation h WHERE h.isPublished = true")
    List<String> findDistinctCategories();
    
    @Query("SELECT h FROM HealthEducation h WHERE h.isPublished = true AND h.targetIndicators LIKE %:indicator% ORDER BY h.priority DESC, h.createdAt DESC")
    List<HealthEducation> findByTargetIndicator(@Param("indicator") String indicator);
}