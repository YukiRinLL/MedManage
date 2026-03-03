package com.medmanage.service;

import com.medmanage.entity.News;
import com.medmanage.repository.NewsRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class NewsService {

    private static final Logger logger = LoggerFactory.getLogger(NewsService.class);

    @Autowired
    private NewsRepository newsRepository;

    @Transactional
    public News createNews(News news) {
        if (news.getTitle() == null || news.getTitle().trim().isEmpty()) {
            String fetchedTitle = fetchTitleFromUrl(news.getUrl());
            news.setTitle(fetchedTitle != null ? fetchedTitle : "未获取到标题");
        }
        // 如果用户没有提供内容，且提供了URL，则从URL获取内容
        if ((news.getContent() == null || news.getContent().trim().isEmpty()) && news.getUrl() != null && !news.getUrl().trim().isEmpty()) {
            String fetchedContent = fetchContentFromUrl(news.getUrl());
            if (fetchedContent != null) {
                news.setContent(fetchedContent);
            }
        }
        // 如果没有设置发布时间，默认为当前时间
        if (news.getPublishTime() == null) {
            news.setPublishTime(LocalDateTime.now());
        }
        // 如果isTop为null，默认为false
        if (news.getIsTop() == null) {
            news.setIsTop(false);
        }
        return newsRepository.save(news);
    }

    public News updateNews(String id, News news) {
        Optional<News> existingNews = newsRepository.findById(id);
        if (existingNews.isPresent()) {
            News updatedNews = existingNews.get();
            updatedNews.setTitle(news.getTitle());
            updatedNews.setUrl(news.getUrl());
            updatedNews.setContent(news.getContent());
            updatedNews.setCoverImage(news.getCoverImage());
            updatedNews.setSource(news.getSource());
            updatedNews.setStatus(news.getStatus());
            updatedNews.setIsTop(news.getIsTop());
            updatedNews.setPublishTime(news.getPublishTime());
            try {
                return newsRepository.save(updatedNews);
            } catch (Exception e) {
                logger.error("更新新闻失败，可能是权限问题: {}", e.getMessage());
                return existingNews.get();
            }
        }
        return null;
    }

    public News toggleNewsTop(String id, Boolean isTop) {
        Optional<News> existingNews = newsRepository.findById(id);
        if (existingNews.isPresent()) {
            News news = existingNews.get();
            news.setIsTop(isTop);
            try {
                return newsRepository.save(news);
            } catch (Exception e) {
                logger.error("置顶操作失败，可能是权限问题: {}", e.getMessage());
                return existingNews.get();
            }
        }
        return null;
    }

    public void deleteNews(String id) {
        try {
            newsRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("删除新闻失败，可能是权限问题: {}", e.getMessage());
        }
    }

    public News getNewsById(String id) {
        return newsRepository.findById(id).orElse(null);
    }

    @Transactional
    public News getNewsDetail(String id) {
        Optional<News> news = newsRepository.findById(id);
        if (news.isPresent()) {
            newsRepository.incrementViewCount(id);
            return news.get();
        }
        return null;
    }

    public Page<News> getAllNews(Pageable pageable) {
        return newsRepository.findAll(pageable);
    }

    public Page<News> getPublishedNews(Pageable pageable) {
        return newsRepository.findByStatusOrderByIsTopDescPublishTimeDesc(1, pageable);
    }

    public List<News> getPublishedNewsList() {
        return newsRepository.findByStatusOrderByIsTopDescPublishTimeDesc(1);
    }

    public Page<News> searchNews(String keyword, Pageable pageable) {
        return newsRepository.findByTitleContainingAndStatusOrderByIsTopDescPublishTimeDesc(keyword, 1, pageable);
    }

    public Map<String, Object> getNewsList(int page, int size, String title, Integer status, Boolean isTop) {
        Map<String, Object> result = new HashMap<>();
        // 确保page不小于1
        int safePage = Math.max(1, page);
        Pageable pageable = PageRequest.of(safePage - 1, size, Sort.by(Sort.Direction.DESC, "isTop", "publishTime"));
        Page<News> newsPage = newsRepository.findAll(pageable);
        result.put("list", newsPage.getContent());
        result.put("total", newsPage.getTotalElements());
        return result;
    }

    public List<News> getTopNews() {
        return newsRepository.findByIsTopTrueAndStatusOrderByPublishTimeDesc(1);
    }

    public String fetchTitleFromUrl(String url) {
        try {
            logger.info("正在从URL获取标题: {}", url);

            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .timeout(10000)
                    .get();

            String title = doc.title();

            if (title == null || title.trim().isEmpty()) {
                Element ogTitle = doc.selectFirst("meta[property=og:title]");
                if (ogTitle != null) {
                    title = ogTitle.attr("content");
                }
            }

            return title;
        } catch (Exception e) {
            logger.error("从URL获取标题失败: {}", e.getMessage());
            return null;
        }
    }

    public String fetchContentFromUrl(String url) {
        try {
            logger.info("正在从URL获取内容: {}", url);

            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .timeout(10000)
                    .get();

            // 移除脚本和样式
            doc.select("script").remove();
            doc.select("style").remove();

            // 尝试找到主要内容区域
            Elements contentElements = doc.select("article, .article, .content, .main-content, #content");
            Element mainContent;

            if (!contentElements.isEmpty()) {
                mainContent = contentElements.first();
            } else {
                // 如果找不到特定的内容区域，使用body
                mainContent = doc.body();
            }

            // 提取文本内容
            String content = mainContent.text();

            // 限制内容长度
            if (content.length() > 1000) {
                content = content.substring(0, 1000) + "...";
            }

            return content;
        } catch (Exception e) {
            logger.error("从URL获取内容失败: {}", e.getMessage());
            return null;
        }
    }
}
