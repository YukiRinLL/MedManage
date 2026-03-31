package com.medmanage.entity;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "diagnosis")
public class Diagnosis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;
    
    @Column(name = "dise_code", length = 50)
    private String diseCode;
    
    @Column(name = "dise_name", length = 200, nullable = false)
    private String diseName;
    
    @Column(name = "sort", nullable = false)
    private Integer sort;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDiseCode() {
        return diseCode;
    }

    public void setDiseCode(String diseCode) {
        this.diseCode = diseCode;
    }

    public String getDiseName() {
        return diseName;
    }

    public void setDiseName(String diseName) {
        this.diseName = diseName;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }
}
