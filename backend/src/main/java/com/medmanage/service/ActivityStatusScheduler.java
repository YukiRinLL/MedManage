package com.medmanage.service;

import com.medmanage.entity.Activity;
import com.medmanage.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

@Service
public class ActivityStatusScheduler {

    @Autowired
    private ActivityRepository activityRepository;

    private TaskScheduler taskScheduler;
    private Map<Long, ScheduledFuture<?>> startTaskMap;
    private Map<Long, ScheduledFuture<?>> endTaskMap;

    public ActivityStatusScheduler() {
        this.taskScheduler = new ConcurrentTaskScheduler();
        this.startTaskMap = new HashMap<>();
        this.endTaskMap = new HashMap<>();
    }

    /**
     * 系统启动时初始化，为所有活动创建定时任务
     */
    @PostConstruct
    public void init() {
        LocalDateTime now = LocalDateTime.now();
        List<Activity> activities = activityRepository.findAll();
        
        for (Activity activity : activities) {
            LocalDateTime startTime = activity.getStartTime();
            LocalDateTime endTime = activity.getEndTime();
            
            // 只对开始或结束时间在未来的活动创建任务
            if (now.isBefore(startTime) || now.isBefore(endTime)) {
                handleActivityChange(activity);
            }
        }
    }

    /**
     * 处理活动创建或更新
     */
    public void handleActivityChange(Activity activity) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime = activity.getStartTime();
        LocalDateTime endTime = activity.getEndTime();

        // 取消旧任务
        cancelTasks(activity.getId());

        // 创建新任务
        if (now.isBefore(startTime)) {
            // 创建开始任务
            ScheduledFuture<?> startTask = taskScheduler.schedule(
                    () -> updateActivityToInProgress(activity.getId()),
                    Date.from(startTime.atZone(ZoneId.systemDefault()).toInstant())
            );
            startTaskMap.put(activity.getId(), startTask);
        }

        if (now.isBefore(endTime)) {
            // 创建结束任务
            ScheduledFuture<?> endTask = taskScheduler.schedule(
                    () -> updateActivityToEnded(activity.getId()),
                    Date.from(endTime.atZone(ZoneId.systemDefault()).toInstant())
            );
            endTaskMap.put(activity.getId(), endTask);
        }
    }

    /**
     * 取消活动的定时任务
     */
    public void cancelTasks(Long activityId) {
        if (startTaskMap.containsKey(activityId)) {
            startTaskMap.get(activityId).cancel(false);
            startTaskMap.remove(activityId);
        }
        if (endTaskMap.containsKey(activityId)) {
            endTaskMap.get(activityId).cancel(false);
            endTaskMap.remove(activityId);
        }
    }

    /**
     * 即时更新活动状态
     */
    public void updateActivityStatus(Activity activity) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime = activity.getStartTime();
        LocalDateTime endTime = activity.getEndTime();
        Integer currentStatus = activity.getStatus();

        Integer newStatus = null;
        if (now.isBefore(startTime)) {
            newStatus = 2; // 未开始
        } else if (now.isAfter(startTime) && now.isBefore(endTime)) {
            newStatus = 1; // 进行中
        } else if (now.isAfter(endTime)) {
            newStatus = 0; // 已结束
        }

        if (newStatus != null && !newStatus.equals(currentStatus)) {
            activity.setStatus(newStatus);
            activityRepository.save(activity);
        }
    }

    /**
     * 更新活动为进行中状态
     */
    private void updateActivityToInProgress(Long activityId) {
        Activity activity = activityRepository.findById(activityId).orElse(null);
        if (activity != null && activity.getStatus() != 1) {
            activity.setStatus(1);
            activityRepository.save(activity);
            startTaskMap.remove(activityId);
        }
    }

    /**
     * 更新活动为已结束状态
     */
    private void updateActivityToEnded(Long activityId) {
        Activity activity = activityRepository.findById(activityId).orElse(null);
        if (activity != null && activity.getStatus() != 0) {
            activity.setStatus(0);
            activityRepository.save(activity);
            endTaskMap.remove(activityId);
        }
    }
}
