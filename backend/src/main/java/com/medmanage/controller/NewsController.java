package com.medmanage.controller;

import com.medmanage.entity.News;
import com.medmanage.service.NewsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/news")
public class NewsController {

    private static final Logger logger = LoggerFactory.getLogger(NewsController.class);

    @Autowired
    private NewsService newsService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createNews(@RequestBody News news) {
        Map<String, Object> response = new HashMap<>();
        try {
            News createdNews = newsService.createNews(news);
            response.put("code", 200);
            response.put("message", "创建成功");
            response.put("data", createdNews);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("创建新闻失败", e);
            response.put("code", 500);
            response.put("message", "创建失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateNews(@PathVariable String id, @RequestBody News news) {
        Map<String, Object> response = new HashMap<>();
        try {
            News updatedNews = newsService.updateNews(id, news);
            if (updatedNews != null) {
                response.put("code", 200);
                response.put("message", "更新成功");
                response.put("data", updatedNews);
            } else {
                response.put("code", 404);
                response.put("message", "新闻不存在");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新新闻失败", e);
            response.put("code", 500);
            response.put("message", "更新失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNews(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        try {
            newsService.deleteNews(id);
            response.put("code", 200);
            response.put("message", "删除成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("删除新闻失败", e);
            response.put("code", 500);
            response.put("message", "删除失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @PutMapping("/{id}/top")
    public ResponseEntity<Map<String, Object>> toggleNewsTop(@PathVariable String id, @RequestParam Boolean isTop) {
        Map<String, Object> response = new HashMap<>();
        try {
            News news = newsService.toggleNewsTop(id, isTop);
            if (news != null) {
                response.put("code", 200);
                response.put("message", isTop ? "置顶成功" : "取消置顶成功");
                response.put("data", news);
            } else {
                response.put("code", 404);
                response.put("message", "新闻不存在");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("置顶操作失败", e);
            response.put("code", 500);
            response.put("message", "操作失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNewsList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Boolean isTop) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> data = newsService.getNewsList(page, size, title, status, isTop);
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取新闻列表失败", e);
            response.put("code", 500);
            response.put("message", "获取失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/top")
    public ResponseEntity<Map<String, Object>> getTopNews() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<News> topNews = newsService.getTopNews();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", topNews);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取置顶新闻失败", e);
            response.put("code", 500);
            response.put("message", "获取失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getNewsById(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        try {
            News news = newsService.getNewsById(id);
            if (news != null) {
                response.put("code", 200);
                response.put("message", "获取成功");
                response.put("data", news);
            } else {
                response.put("code", 404);
                response.put("message", "新闻不存在");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取新闻详情失败", e);
            response.put("code", 500);
            response.put("message", "获取失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
