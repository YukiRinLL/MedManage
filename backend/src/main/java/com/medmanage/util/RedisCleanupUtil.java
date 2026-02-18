package com.medmanage.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class RedisCleanupUtil {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    public void clearAllTokens() {
        Set<String> adminTokens = redisTemplate.keys("admin:*:token");
        Set<String> userTokens = redisTemplate.keys("user:*:token");
        
        if (adminTokens != null && !adminTokens.isEmpty()) {
            redisTemplate.delete(adminTokens);
            System.out.println("已清理管理员token: " + adminTokens.size() + " 个");
        }
        
        if (userTokens != null && !userTokens.isEmpty()) {
            redisTemplate.delete(userTokens);
            System.out.println("已清理用户token: " + userTokens.size() + " 个");
        }
    }
}