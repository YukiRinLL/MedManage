package com.medmanage.controller;

import com.medmanage.entity.ImprovementPlan;
import com.medmanage.service.ImprovementPlanService;
import com.medmanage.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/improvement-plan")
public class ImprovementPlanController {

    @Autowired
    private ImprovementPlanService improvementPlanService;

    @GetMapping("/current/{userId}")
    public ResponseEntity<Map<String, Object>> getCurrent(@PathVariable String userId) {
        ImprovementPlan plan = improvementPlanService.getCurrentPlan(userId);
        return ResponseUtil.success(plan);
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<Map<String, Object>> getList(@PathVariable String userId) {
        List<ImprovementPlan> list = improvementPlanService.getAllByUser(userId);
        return ResponseUtil.success(list);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<Map<String, Object>> getDetail(@PathVariable String id) {
        ImprovementPlan plan = improvementPlanService.getById(id);
        if (plan == null) {
            return ResponseUtil.notFound("方案不存在");
        }
        return ResponseUtil.success(plan);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody ImprovementPlan plan) {
        ImprovementPlan created = improvementPlanService.create(plan);
        return ResponseUtil.success(created);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id, @RequestBody ImprovementPlan plan) {
        ImprovementPlan updated = improvementPlanService.update(id, plan);
        return ResponseUtil.success(updated);
    }

    @PutMapping("/complete/{id}")
    public ResponseEntity<Map<String, Object>> complete(@PathVariable String id) {
        ImprovementPlan completed = improvementPlanService.complete(id);
        return ResponseUtil.success(completed);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        improvementPlanService.delete(id);
        return ResponseUtil.success("删除成功");
    }
}