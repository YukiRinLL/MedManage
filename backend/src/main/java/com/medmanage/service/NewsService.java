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
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.Base64;
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

    public News toggleNewsTop(Long id, Boolean isTop) {
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

    public void deleteNews(Long id) {
        try {
            newsRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("删除新闻失败，可能是权限问题: {}", e.getMessage());
        }
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
        return newsRepository.findByStatusOrderByIsTopDescPublishTimeDesc(1, pageable);
    }

    public List<News> getPublishedNewsList() {
        return newsRepository.findByStatusOrderByIsTopDescPublishTimeDesc(1);
    }

    public Page<News> searchNews(String keyword, Pageable pageable) {
        return newsRepository.findByTitleContainingAndStatusOrderByIsTopDescPublishTimeDesc(keyword, 1, pageable);
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

            Element contentElement = doc.selectFirst("#js_content");
            if (contentElement == null) {
                contentElement = doc.selectFirst("article");
            }
            if (contentElement == null) {
                contentElement = doc.selectFirst(".content, .post-content, .entry-content, main");
            }
            if (contentElement == null) {
                contentElement = doc.body();
            }

            // 移除脚本和样式
            contentElement.select("script, style, .rich_media_tool, .rich_media_extra").remove();

            // 处理图片，转换为base64
            Elements images = contentElement.select("img");
            for (Element img : images) {
                String imgUrl = img.attr("data-src");
                if (imgUrl.isEmpty()) {
                    imgUrl = img.attr("src");
                }
                if (!imgUrl.isEmpty()) {
                    String base64Image = downloadImageToBase64(imgUrl);
                    if (base64Image != null) {
                        img.attr("src", base64Image);
                        img.removeAttr("data-src");
                    }
                }
            }

            // 处理段落格式，确保文本有适当的段落结构
            processParagraphs(contentElement);

            String html = contentElement.html();
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

    private void processParagraphs(Element element) {
        // 将连续的文本节点和inline元素包装成段落
        Elements sections = element.select("section, div");
        for (Element section : sections) {
            // 如果section包含文本但没有段落标签，添加段落
            if (section.select("p, h1, h2, h3, h4, h5, h6").isEmpty()) {
                String text = section.text().trim();
                if (!text.isEmpty()) {
                    section.html("<p>" + section.html().replaceAll("<br\\s*/?>", "</p><p>") + "</p>");
                }
            }
        }

        // 确保所有文本都在段落中
        for (Node node : element.childNodes()) {
            if (node instanceof TextNode) {
                TextNode textNode = (TextNode) node;
                String text = textNode.text().trim();
                if (!text.isEmpty()) {
                    Element p = new Element("p");
                    p.text(text);
                    node.replaceWith(p);
                }
            }
        }
    }

    private String downloadImageToBase64(String imageUrl) {
        try {
            URL url = new URL(imageUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                String contentType = connection.getContentType();
                try (InputStream inputStream = connection.getInputStream();
                     ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        outputStream.write(buffer, 0, bytesRead);
                    }

                    byte[] imageBytes = outputStream.toByteArray();
                    String base64 = Base64.getEncoder().encodeToString(imageBytes);
                    return "data:" + contentType + ";base64," + base64;
                }
            }
        } catch (Exception e) {
            logger.error("下载图片失败: {} - {}", imageUrl, e.getMessage());
        }
        return null;
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
