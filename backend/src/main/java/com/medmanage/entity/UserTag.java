package com.medmanage.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_tags", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "tag_name"}))
public class UserTag {
    
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private String id;
    
    @Column(name = "user_id", nullable = false, columnDefinition = "VARCHAR(36)")
    private String userId;
    
    @Column(name = "tag_name", nullable = false, length = 100)
    private String tagName;
    
    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}