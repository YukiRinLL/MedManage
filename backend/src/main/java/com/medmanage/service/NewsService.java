package com.medmanage.service;

import com.medmanage.entity.News;
import com.medmanage.repository.NewsRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
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
        return newsRepository.save(news);
    }

    @Transactional
    public News updateNews(Long id, News news) {
        Optional<News> existingNews = newsRepository.findById(id);
        if (existingNews.isPresent()) {
            News updatedNews = existingNews.get();
            updatedNews.setTitle(news.getTitle());
            updatedNews.setUrl(news.getUrl());
            updatedNews.setContent(news.getContent());
            updatedNews.setCoverImage(news.getCoverImage());
            updatedNews.setSource(news.getSource());
            updatedNews.setStatus(news.getStatus());
            updatedNews.setSortOrder(news.getSortOrder());
            return newsRepository.save(updatedNews);
        }
        return null;
    }

    @Transactional
    public void deleteNews(Long id) {
        newsRepository.deleteById(id);
    }

    public Optional<News> getNewsById(Long id) {
        return newsRepository.findById(id);
    }

    @Transactional
    public News getNewsDetail(Long id) {
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
        return newsRepository.findByStatusOrderBySortOrderDescCreatedAtDesc(1, pageable);
    }

    public List<News> getPublishedNewsList() {
        return newsRepository.findByStatusOrderBySortOrderDescCreatedAtDesc(1);
    }

    public Page<News> searchNews(String keyword, Pageable pageable) {
        return newsRepository.findByTitleContainingAndStatusOrderBySortOrderDescCreatedAtDesc(keyword, 1, pageable);
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

            if (title == null || title.trim().isEmpty()) {
                Element h1 = doc.selectFirst("h1");
                if (h1 != null) {
                    title = h1.text();
                }
            }

            if (title != null && title.contains("-")) {
                title = title.substring(0, title.lastIndexOf("-")).trim();
            }

            logger.info("获取到的标题: {}", title);
            return title != null ? title.trim() : null;

        } catch (IOException e) {
            logger.error("获取标题失败: {}", e.getMessage());
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

            StringBuilder content = new StringBuilder();

            Element richContent = doc.selectFirst("#js_content");
            if (richContent != null) {
                richContent.select("script, style, .rich_media_tool, .rich_media_extra").remove();

                for (Element img : richContent.select("img")) {
                    String dataSrc = img.attr("data-src");
                    if (!dataSrc.isEmpty()) {
                        img.attr("src", dataSrc);
                    }
                }

                content.append(richContent.html());
            } else {
                Element article = doc.selectFirst("article");
                if (article != null) {
                    content.append(article.html());
                } else {
                    Element mainContent = doc.selectFirst(".content, .post-content, .entry-content, main");
                    if (mainContent != null) {
                        content.append(mainContent.html());
                    } else {
                        content.append(doc.body().html());
                    }
                }
            }

            String html = content.toString();
            html = html.replaceAll("<script[^>]*>.*?</script>", "");
            html = html.replaceAll("<style[^>]*>.*?</style>", "");
            html = html.replaceAll("onclick=\"[^\"]*\"", "");
            html = html.replaceAll("onload=\"[^\"]*\"", "");

            logger.info("成功获取文章内容，长度: {}", html.length());
            return html;

        } catch (IOException e) {
            logger.error("获取内容失败: {}", e.getMessage());
            return null;
        }
    }

    public String fetchCoverImageFromUrl(String url) {
        try {
            logger.info("正在从URL获取封面图: {}", url);

            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .timeout(10000)
                    .get();

            Element ogImage = doc.selectFirst("meta[property=og:image]");
            if (ogImage != null) {
                String imageUrl = ogImage.attr("content");
                logger.info("获取到的封面图: {}", imageUrl);
                return imageUrl;
            }

            Element firstImage = doc.selectFirst("#js_content img");
            if (firstImage != null) {
                String imageUrl = firstImage.attr("data-src");
                if (imageUrl.isEmpty()) {
                    imageUrl = firstImage.attr("src");
                }
                logger.info("获取到的封面图: {}", imageUrl);
                return imageUrl;
            }

            return null;

        } catch (IOException e) {
            logger.error("获取封面图失败: {}", e.getMessage());
            return null;
        }
    }
}
