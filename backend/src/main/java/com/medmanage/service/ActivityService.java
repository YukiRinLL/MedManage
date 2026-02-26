package com.medmanage.service;

import com.medmanage.entity.Activity;
import com.medmanage.repository.ActivityRepository;
import com.medmanage.service.ActivityStatusScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ActivityService {
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private ActivityStatusScheduler activityStatusScheduler;
    
    public Activity save(Activity activity) {
        activity.setCreatedAt(LocalDateTime.now());
        activity.setUpdatedAt(LocalDateTime.now());
        Activity savedActivity = activityRepository.save(activity);
        activityStatusScheduler.handleActivityChange(savedActivity);
        return savedActivity;
    }
    
    public Activity update(Long id, Activity activity) {
        Activity existingActivity = activityRepository.findById(id).orElse(null);
        if (existingActivity == null) {
            throw new RuntimeException("活动不存在");
        }
        
        if (activity.getTitle() != null) {
            existingActivity.setTitle(activity.getTitle());
        }
        if (activity.getDescription() != null) {
            existingActivity.setDescription(activity.getDescription());
        }
        if (activity.getActivityType() != null) {
            existingActivity.setActivityType(activity.getActivityType());
        }
        if (activity.getLocation() != null) {
            existingActivity.setLocation(activity.getLocation());
        }
        if (activity.getStartTime() != null) {
            existingActivity.setStartTime(activity.getStartTime());
        }
        if (activity.getEndTime() != null) {
            existingActivity.setEndTime(activity.getEndTime());
        }
        if (activity.getMaxParticipants() != null) {
            existingActivity.setMaxParticipants(activity.getMaxParticipants());
        }
        if (activity.getStatus() != null) {
            existingActivity.setStatus(activity.getStatus());
        }
        if (activity.getCoverImage() != null) {
            existingActivity.setCoverImage(activity.getCoverImage());
        }
        
        existingActivity.setUpdatedAt(LocalDateTime.now());
        Activity updatedActivity = activityRepository.save(existingActivity);
        activityStatusScheduler.handleActivityChange(updatedActivity);
        return updatedActivity;
    }
    
    public Activity findById(Long id) {
        return activityRepository.findById(id).orElse(null);
    }
    
    public List<Activity> findAll() {
        return activityRepository.findAll();
    }
    
    public Map<String, Object> listActivities(int page, int size, Integer status, String title) {
        Map<String, Object> result = new HashMap<>();
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Activity> activityPage = activityRepository.findAll(pageable);
        result.put("list", activityPage.getContent());
        result.put("total", activityPage.getTotalElements());
        return result;
    }
    
    public List<Activity> findByStatus(Integer status) {
        return activityRepository.findByStatusOrderByStartTimeDesc(status);
    }
    
    public List<Activity> findByCreatedBy(Long createdBy) {
        return activityRepository.findByCreatedByOrderByCreatedAtDesc(createdBy);
    }
    
    public void deleteActivity(Long id) {
        activityRepository.deleteById(id);
    }
    
    public void incrementParticipants(Long activityId) {
        Activity activity = activityRepository.findById(activityId).orElse(null);
        if (activity != null) {
            activity.setCurrentParticipants(activity.getCurrentParticipants() + 1);
            activityRepository.save(activity);
        }
    }
    
    public void decrementParticipants(Long activityId) {
        Activity activity = activityRepository.findById(activityId).orElse(null);
        if (activity != null && activity.getCurrentParticipants() > 0) {
            activity.setCurrentParticipants(activity.getCurrentParticipants() - 1);
            activityRepository.save(activity);
        }
    }
}
