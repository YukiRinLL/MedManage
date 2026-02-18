package com.medmanage.controller;

import com.medmanage.util.RedisCleanupUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/debug")
public class DebugController {
    
    @Autowired
    private RedisCleanupUtil redisCleanupUtil;
    
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
}