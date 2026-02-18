package com.medmanage.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception e) {
        logger.error("发生异常:", e);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 400);
        result.put("message", e.getMessage());
        
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException e) {
        logger.error("运行时异常:", e);
        
        Map<String, Object> result = new HashMap<>();
        result.put("code", 400);
        result.put("message", e.getMessage());
        
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
