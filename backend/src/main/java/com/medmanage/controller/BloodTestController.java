package com.medmanage.controller;

import com.medmanage.entity.BloodTest;
import com.medmanage.service.BloodTestService;
import com.medmanage.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/blood-test")
public class BloodTestController {

    @Autowired
    private BloodTestService bloodTestService;

    @GetMapping("/latest/{userId}")
    public ResponseEntity<Map<String, Object>> getLatest(@PathVariable String userId) {
        BloodTest test = bloodTestService.getLatest(userId);
        return ResponseUtil.success(test);
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<Map<String, Object>> getList(@PathVariable String userId) {
        List<BloodTest> list = bloodTestService.getAllByUser(userId);
        return ResponseUtil.success(list);
    }

    @GetMapping("/year/{userId}")
    public ResponseEntity<Map<String, Object>> getByYear(@PathVariable String userId, @RequestParam int year) {
        List<BloodTest> list = bloodTestService.getByYear(userId, year);
        return ResponseUtil.success(list);
    }

    @GetMapping("/quarter/{userId}")
    public ResponseEntity<Map<String, Object>> getByQuarter(@PathVariable String userId, @RequestParam int year, @RequestParam int quarter) {
        List<BloodTest> list = bloodTestService.getByQuarter(userId, year, quarter);
        return ResponseUtil.success(list);
    }

    @GetMapping("/recent/{userId}")
    public ResponseEntity<Map<String, Object>> getRecent12Months(@PathVariable String userId) {
        List<BloodTest> list = bloodTestService.getRecent12Months(userId);
        return ResponseUtil.success(list);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<Map<String, Object>> getDetail(@PathVariable String id) {
        BloodTest test = bloodTestService.getById(id);
        if (test == null) {
            return ResponseUtil.notFound("记录不存在");
        }
        return ResponseUtil.success(test);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody BloodTest bloodTest) {
        BloodTest created = bloodTestService.create(bloodTest);
        return ResponseUtil.success(created);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id, @RequestBody BloodTest bloodTest) {
        BloodTest updated = bloodTestService.update(id, bloodTest);
        return ResponseUtil.success(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        bloodTestService.delete(id);
        return ResponseUtil.success("删除成功");
    }
}