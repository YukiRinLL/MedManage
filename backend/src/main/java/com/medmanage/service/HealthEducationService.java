package com.medmanage.service;

import com.medmanage.entity.HealthEducation;
import com.medmanage.repository.HealthEducationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HealthEducationService {

    @Autowired
    private HealthEducationRepository healthEducationRepository;

    public List<HealthEducation> getAllPublished() {
        return healthEducationRepository.findByIsPublishedTrueOrderByPriorityDescCreatedAtDesc();
    }

    public Page<HealthEducation> getPublishedByPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return healthEducationRepository.findByIsPublishedTrueOrderByPriorityDescCreatedAtDesc(pageable);
    }

    public List<HealthEducation> getByCategory(String category) {
        return healthEducationRepository.findByIsPublishedTrueAndCategoryOrderByPriorityDescCreatedAtDesc(category);
    }

    public Page<HealthEducation> getByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return healthEducationRepository.findByCategoryOrderByPriorityDescCreatedAtDesc(category, pageable);
    }

    public List<String> getAllCategories() {
        return healthEducationRepository.findDistinctCategories();
    }

    public Optional<HealthEducation> getById(String id) {
        return healthEducationRepository.findById(id);
    }

    public HealthEducation create(HealthEducation healthEducation) {
        healthEducation.setIsPublished(false);
        return healthEducationRepository.save(healthEducation);
    }

    public HealthEducation update(String id, HealthEducation healthEducation) {
        HealthEducation existing = healthEducationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("健康宣教内容不存在"));
        
        existing.setTitle(healthEducation.getTitle());
        existing.setContent(healthEducation.getContent());
        existing.setCategory(healthEducation.getCategory());
        existing.setTags(healthEducation.getTags());
        existing.setCoverImage(healthEducation.getCoverImage());
        existing.setIsPublished(healthEducation.getIsPublished());
        existing.setPriority(healthEducation.getPriority());
        existing.setTargetIndicators(healthEducation.getTargetIndicators());
        
        return healthEducationRepository.save(existing);
    }

    public void delete(String id) {
        healthEducationRepository.deleteById(id);
    }

    public HealthEducation publish(String id) {
        HealthEducation healthEducation = healthEducationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("健康宣教内容不存在"));
        healthEducation.setIsPublished(true);
        return healthEducationRepository.save(healthEducation);
    }

    public HealthEducation unpublish(String id) {
        HealthEducation healthEducation = healthEducationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("健康宣教内容不存在"));
        healthEducation.setIsPublished(false);
        return healthEducationRepository.save(healthEducation);
    }

    public List<HealthEducation> getByTargetIndicator(String indicator) {
        return healthEducationRepository.findByTargetIndicator(indicator);
    }
}