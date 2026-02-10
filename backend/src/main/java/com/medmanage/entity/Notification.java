package com.medmanage.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    private String type; // 1:就诊提醒, 2:用药提醒, 3:检查通知, 4:随访提醒, 5:复诊提醒
    private String title;
    private String content;
    @Column(name = "is_read")
    private Boolean isRead;
    
    @Column(name = "notify_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date notifyTime;
    
    @Column(name = "created_at", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        isRead = false;
    }
}
