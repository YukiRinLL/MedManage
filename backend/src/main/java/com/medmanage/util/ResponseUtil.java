package com.medmanage.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

public class ResponseUtil {
    
    public static ResponseEntity<Map<String, Object>> success() {
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "操作成功");
        return ResponseEntity.ok(result);
    }
    
    public static ResponseEntity<Map<String, Object>> success(Object data) {
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "操作成功");
        result.put("data", data);
        return ResponseEntity.ok(result);
    }
    
    public static ResponseEntity<Map<String, Object>> success(String message, Object data) {
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", message);
        result.put("data", data);
        return ResponseEntity.ok(result);
    }
    
    public static ResponseEntity<Map<String, Object>> error(int code, String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("code", code);
        result.put("message", message);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
    
    public static ResponseEntity<Map<String, Object>> badRequest(String message) {
        return error(400, message);
    }
    
    public static ResponseEntity<Map<String, Object>> unauthorized(String message) {
        return error(401, message);
    }
    
    public static ResponseEntity<Map<String, Object>> forbidden(String message) {
        return error(403, message);
    }
    
    public static ResponseEntity<Map<String, Object>> notFound(String message) {
        return error(404, message);
    }
    
    public static ResponseEntity<Map<String, Object>> internalServerError(String message) {
        return error(500, message);
    }
}
