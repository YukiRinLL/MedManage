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
        
        try {
            Long userId = jwtUtil.getUserIdFromToken(token);
            // 验证Redis中的登录状态
            String redisToken = (String) redisUtil.get("user:" + userId + ":token");
            if (redisToken == null || !redisToken.equals(token)) {
                response.setCharacterEncoding("UTF-8");
                response.setContentType("application/json; charset=utf-8");
                PrintWriter out = response.getWriter();
                out.print("{\"code\": 401, \"message\": \"登录已过期，请重新登录\"}");
                out.flush();
                out.close();
                return false;
            }
            // 将用户ID存储到请求中，方便后续使用
            request.setAttribute("userId", userId);
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
