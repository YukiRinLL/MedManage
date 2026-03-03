package com.medmanage.repository;

import com.medmanage.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, String> {
    List<Activity> findByStatusOrderByStartTimeDesc(Integer status);
    List<Activity> findByCreatedByOrderByCreatedAtDesc(String createdBy);
}
