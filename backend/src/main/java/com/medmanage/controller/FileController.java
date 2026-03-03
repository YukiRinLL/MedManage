package com.medmanage.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/file")
public class FileController {

    private static final String UPLOAD_DIR = "uploads";

    @PostMapping("/upload")
    public Map<String, Object> uploadFile(@RequestParam("file") MultipartFile file, 
                                         @RequestParam(value = "type", defaultValue = "common") String type, 
                                         HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();

        try {
            // 获取项目根目录的绝对路径
            String projectRoot = System.getProperty("user.dir");
            
            // 根据功能类型和文件类型创建子目录
            String fileType = getFileType(file.getOriginalFilename());
            Path uploadPath = Paths.get(projectRoot, UPLOAD_DIR, type, fileType);

            // 确保上传目录存在
            File uploadDir = uploadPath.toFile();
            if (!uploadDir.exists()) {
                boolean created = uploadDir.mkdirs();
                if (!created) {
                    result.put("code", 500);
                    result.put("message", "无法创建上传目录");
                    return result;
                }
            }

            // 生成唯一文件名
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;

            // 保存文件
            File dest = new File(uploadDir, filename);
            file.transferTo(dest);

            // 返回文件路径
            String fileUrl = "/" + UPLOAD_DIR + "/" + type + "/" + fileType + "/" + filename;
            result.put("code", 200);
            result.put("message", "上传成功");
            result.put("data", fileUrl);
        } catch (IOException e) {
            result.put("code", 500);
            result.put("message", "上传失败: " + e.getMessage());
        }

        return result;
    }
    
    private String getFileType(String filename) {
        if (filename == null) {
            return "other";
        }
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        
        // 图片类型
        String[] imageExtensions = {"jpg", "jpeg", "png", "gif", "webp", "bmp"};
        for (String ext : imageExtensions) {
            if (ext.equals(extension)) {
                return "images";
            }
        }
        
        // 文档类型
        String[] docExtensions = {"doc", "docx", "pdf", "txt", "xls", "xlsx", "ppt", "pptx"};
        for (String ext : docExtensions) {
            if (ext.equals(extension)) {
                return "docs";
            }
        }
        
        // 其他类型
        return "other";
    }
}
