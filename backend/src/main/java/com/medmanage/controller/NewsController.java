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
    public ResponseEntity<Map<String, Object>> updateNews(@PathVariable Long id, @RequestBody News news) {
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
    public ResponseEntity<Map<String, Object>> deleteNews(@PathVariable Long id) {
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
    public ResponseEntity<Map<String, Object>> toggleNewsTop(@PathVariable Long id, @RequestParam Boolean isTop) {
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

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getNewsById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            News news = newsService.getNewsById(id).orElse(null);
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
            logger.error("获取新闻失败", e);
            response.put("code", 500);
            response.put("message", "获取失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<Map<String, Object>> getNewsDetail(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            News news = newsService.getNewsDetail(id);
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

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<News> newsPage = newsService.getAllNews(pageable);
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", newsPage);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取新闻列表失败", e);
            response.put("code", 500);
            response.put("message", "获取失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/published")
    public ResponseEntity<Map<String, Object>> getPublishedNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<News> newsPage = newsService.getPublishedNews(pageable);
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", newsPage);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取已发布新闻列表失败", e);
            response.put("code", 500);
            response.put("message", "获取失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/published/list")
    public ResponseEntity<Map<String, Object>> getPublishedNewsList() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<News> newsList = newsService.getPublishedNewsList();
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", newsList);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取已发布新闻列表失败", e);
            response.put("code", 500);
            response.put("message", "获取失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchNews(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<News> newsPage = newsService.searchNews(keyword, pageable);
            response.put("code", 200);
            response.put("message", "搜索成功");
            response.put("data", newsPage);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("搜索新闻失败", e);
            response.put("code", 500);
            response.put("message", "搜索失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/fetch-title")
    public ResponseEntity<Map<String, Object>> fetchTitle(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String url = request.get("url");
            if (url == null || url.trim().isEmpty()) {
                response.put("code", 400);
                response.put("message", "URL不能为空");
                return ResponseEntity.ok(response);
            }
            String title = newsService.fetchTitleFromUrl(url);
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", title);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取标题失败", e);
            response.put("code", 500);
            response.put("message", "获取失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/fetch-content")
    public ResponseEntity<Map<String, Object>> fetchContent(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String url = request.get("url");
            if (url == null || url.trim().isEmpty()) {
                response.put("code", 400);
                response.put("message", "URL不能为空");
                return ResponseEntity.ok(response);
            }
            String content = newsService.fetchContentFromUrl(url);
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", content);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取内容失败", e);
            response.put("code", 500);
            response.put("message", "获取失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/fetch-cover")
    public ResponseEntity<Map<String, Object>> fetchCover(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String url = request.get("url");
            if (url == null || url.trim().isEmpty()) {
                response.put("code", 400);
                response.put("message", "URL不能为空");
                return ResponseEntity.ok(response);
            }
            String coverImage = newsService.fetchCoverImageFromUrl(url);
            response.put("code", 200);
            response.put("message", "获取成功");
            response.put("data", coverImage);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("获取封面图失败", e);
            response.put("code", 500);
            response.put("message", "获取失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
