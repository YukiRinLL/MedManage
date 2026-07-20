package com.medmanage.controller;

import com.medmanage.entity.HealthEducation;
import com.medmanage.service.HealthEducationService;
import com.medmanage.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/health-education")
public class HealthEducationController {

    @Autowired
    private HealthEducationService healthEducationService;

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category) {
        
        Page<HealthEducation> result;
        if (category != null && !category.isEmpty()) {
            result = healthEducationService.getByCategory(category, page, size);
        } else {
            result = healthEducationService.getPublishedByPage(page, size);
        }
        
        return ResponseUtil.success(Map.of(
                "list", result.getContent(),
                "total", result.getTotalElements()
        ));
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAll() {
        List<HealthEducation> list = healthEducationService.getAllPublished();
        return ResponseUtil.success(list);
    }

    @GetMapping("/categories")
    public ResponseEntity<Map<String, Object>> getCategories() {
        List<String> categories = healthEducationService.getAllCategories();
        return ResponseUtil.success(categories);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<Map<String, Object>> getDetail(@PathVariable String id) {
        return healthEducationService.getById(id)
                .map(ResponseUtil::success)
                .orElse(ResponseUtil.notFound("内容不存在"));
    }

    @GetMapping("/by-indicator")
    public ResponseEntity<Map<String, Object>> getByIndicator(@RequestParam String indicator) {
        List<HealthEducation> list = healthEducationService.getByTargetIndicator(indicator);
        return ResponseUtil.success(list);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody HealthEducation healthEducation) {
        HealthEducation created = healthEducationService.create(healthEducation);
        return ResponseUtil.success(created);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id, @RequestBody HealthEducation healthEducation) {
        HealthEducation updated = healthEducationService.update(id, healthEducation);
        return ResponseUtil.success(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        healthEducationService.delete(id);
        return ResponseUtil.success("删除成功");
    }

    @PutMapping("/publish/{id}")
    public ResponseEntity<Map<String, Object>> publish(@PathVariable String id) {
        HealthEducation published = healthEducationService.publish(id);
        return ResponseUtil.success(published);
    }

    @PutMapping("/unpublish/{id}")
    public ResponseEntity<Map<String, Object>> unpublish(@PathVariable String id) {
        HealthEducation unpublished = healthEducationService.unpublish(id);
        return ResponseUtil.success(unpublished);
    }
}