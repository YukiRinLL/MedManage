package com.medmanage.interceptor;

import com.medmanage.util.JwtUtil;
import com.medmanage.util.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private RedisUtil redisUtil;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 跳过 OPTIONS 预检请求
        if ("OPTIONS".equals(request.getMethod())) {
            return true;
        }
        
        String token = request.getHeader("Authorization");
        if (token == null || token.isEmpty()) {
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json; charset=utf-8");
            PrintWriter out = response.getWriter();
            out.print("{\"code\": 401, \"message\": \"未授权，请登录\"}");
            out.flush();
            out.close();
            return false;
        }
        
        // 移除 Bearer 前缀
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            
            // 统一的token验证逻辑：
            // 1. 优先尝试管理员token验证（管理员可以访问所有接口）
            // 2. 如果管理员token验证失败，尝试用户token验证
            // 3. 如果两者都失败，返回认证失败
            
            String redisToken = (String) redisUtil.get("admin:" + userId + ":token");
            boolean isAdmin = redisToken != null && redisToken.equals(token);
            
            if (!isAdmin) {
                redisToken = (String) redisUtil.get("user:" + userId + ":token");
                if (redisToken == null || !redisToken.equals(token)) {
                    response.setCharacterEncoding("UTF-8");
                    response.setContentType("application/json; charset=utf-8");
                    PrintWriter out = response.getWriter();
                    out.print("{\"code\": 401, \"message\": \"登录已过期，请重新登录\"}");
                    out.flush();
                    out.close();
                    return false;
                }
            }
            
            // 将用户ID和管理员标识存储到请求中，方便后续使用
            request.setAttribute("userId", userId);
            request.setAttribute("isAdmin", isAdmin);
            return true;
        } catch (Exception e) {
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json; charset=utf-8");
            PrintWriter out = response.getWriter();
            out.print("{\"code\": 401, \"message\": \"无效的token\"}");
            out.flush();
            out.close();
            return false;
        }
    }
}
