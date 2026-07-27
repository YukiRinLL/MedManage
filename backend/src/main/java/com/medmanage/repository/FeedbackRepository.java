package com.medmanage.repository;

import com.medmanage.entity.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, String> {
    
    Page<Feedback> findAll(Pageable pageable);
    
    Page<Feedback> findByUserId(String userId, Pageable pageable);
    
    Page<Feedback> findByStatus(String status, Pageable pageable);
    
    List<Feedback> findByUserIdOrderByCreatedAtDesc(String userId);
}