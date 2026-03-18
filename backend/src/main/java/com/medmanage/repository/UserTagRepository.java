package com.medmanage.repository;

import com.medmanage.entity.UserTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserTagRepository extends JpaRepository<UserTag, String> {
    List<UserTag> findByUserId(String userId);
    List<UserTag> findByTagName(String tagName);
    void deleteByUserId(String userId);
    void deleteByUserIdAndTagName(String userId, String tagName);
    
    @Query("SELECT ut.tagName FROM UserTag ut WHERE ut.userId = :userId")
    List<String> findTagNamesByUserId(@Param("userId") String userId);
    
    @Query("SELECT ut.userId FROM UserTag ut WHERE ut.tagName = :tagName")
    List<String> findUserIdsByTagName(@Param("tagName") String tagName);
}