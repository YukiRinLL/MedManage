package com.medmanage.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class RedisUtil {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    public void set(String key, Object value, long expire) {
        try {
            redisTemplate.opsForValue().set(key, value, expire, TimeUnit.SECONDS);
        } catch (Exception e) {
            // 记录日志，不影响应用启动
            System.err.println("Redis set error: " + e.getMessage());
        }
    }
    
    public Object get(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            // 记录日志，不影响应用启动
            System.err.println("Redis get error: " + e.getMessage());
            return null;
        }
    }
    
    public void delete(String key) {
        try {
            redisTemplate.delete(key);
        } catch (Exception e) {
            // 记录日志，不影响应用启动
            System.err.println("Redis delete error: " + e.getMessage());
        }
    }
    
    public boolean exists(String key) {
        try {
            return redisTemplate.hasKey(key);
        } catch (Exception e) {
            // 记录日志，不影响应用启动
            System.err.println("Redis exists error: " + e.getMessage());
            return false;
        }
    }
    
    public RedisTemplate<String, Object> getRedisTemplate() {
        return redisTemplate;
    }
}
