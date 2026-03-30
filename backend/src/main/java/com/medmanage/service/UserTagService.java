package com.medmanage.service;

import com.medmanage.entity.UserTag;
import com.medmanage.repository.UserTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserTagService {
    
    @Autowired
    private UserTagRepository userTagRepository;
    
    @Transactional
    public void addTagToUser(String userId, String tagName) {
        // 检查关联是否已存在
        List<UserTag> existing = userTagRepository.findByUserId(userId);
        for (UserTag ut : existing) {
            if (ut.getTagName().equals(tagName)) {
                return; // 已存在，不需要重复添加
            }
        }
        
        UserTag userTag = new UserTag();
        userTag.setUserId(userId);
        userTag.setTagName(tagName);
        userTag.setCreatedAt(java.time.LocalDateTime.now());
        userTagRepository.save(userTag);
    }
    
    @Transactional
    public void removeTagFromUser(String userId, String tagName) {
        userTagRepository.deleteByUserIdAndTagName(userId, tagName);
    }
    
    @Transactional
    public void setUserTags(String userId, List<String> tagNames) {
        // 先删除所有现有关联
        userTagRepository.deleteByUserId(userId);
        
        // 添加新关联
        for (String tagName : tagNames) {
            if (tagName != null && !tagName.trim().isEmpty()) {
                addTagToUser(userId, tagName.trim());
            }
        }
    }
    
    public List<String> getUserTagNames(String userId) {
        return userTagRepository.findTagNamesByUserId(userId);
    }
    
    public List<String> getUsersByTagName(String tagName) {
        return userTagRepository.findUserIdsByTagName(tagName);
    }
}