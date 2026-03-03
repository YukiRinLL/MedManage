package com.medmanage.controller;

import com.medmanage.util.RedisCleanupUtil;
import com.medmanage.util.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.EntityManager;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/debug")
public class DebugController {
    
    @Autowired
    private RedisCleanupUtil redisCleanupUtil;
    
    @Autowired
    private RedisUtil redisUtil;
    
    @Autowired
    private EntityManager entityManager;
    
    @PostMapping("/clear-tokens")
    public Map<String, Object> clearTokens() {
        Map<String, Object> result = new HashMap<>();
        try {
            redisCleanupUtil.clearAllTokens();
            result.put("code", 200);
            result.put("message", "所有token已清理");
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "清理失败: " + e.getMessage());
        }
        return result;
    }
    
    @GetMapping("/ping")
    public Map<String, Object> ping() {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> components = new HashMap<>();
        
        try {
            // 检查Redis状态
            boolean redisStatus = false;
            try {
                // 使用RedisUtil的exists方法来检查Redis连接
                redisUtil.exists("ping_test");
                redisStatus = true;
            } catch (Exception e) {
                redisStatus = false;
            }
            components.put("redis", redisStatus ? "healthy" : "unhealthy");
            
            // 检查数据库状态
            boolean dbStatus = false;
            try {
                entityManager.createNativeQuery("SELECT 1").getSingleResult();
                dbStatus = true;
            } catch (Exception e) {
                dbStatus = false;
            }
            components.put("database", dbStatus ? "healthy" : "unhealthy");
            
            // 检查应用状态
            components.put("application", "healthy");
            
            // 计算整体状态
            boolean allHealthy = redisStatus && dbStatus;
            
            result.put("code", 200);
            result.put("message", "pong");
            result.put("status", allHealthy ? "healthy" : "unhealthy");
            result.put("components", components);
            result.put("timestamp", System.currentTimeMillis());
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "检查失败: " + e.getMessage());
            result.put("status", "unhealthy");
        }
        
        return result;
    }
}