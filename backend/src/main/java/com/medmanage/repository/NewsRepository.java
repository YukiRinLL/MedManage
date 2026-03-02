package com.medmanage.repository;

import com.medmanage.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    Page<News> findByStatusOrderBySortOrderDescCreatedAtDesc(Integer status, Pageable pageable);

    List<News> findByStatusOrderBySortOrderDescCreatedAtDesc(Integer status);

    Page<News> findByTitleContainingAndStatusOrderBySortOrderDescCreatedAtDesc(String title, Integer status, Pageable pageable);

    @Modifying
    @Query("UPDATE News n SET n.viewCount = n.viewCount + 1 WHERE n.id = :id")
    void incrementViewCount(@Param("id") Long id);
}
