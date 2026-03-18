package com.medmanage.repository;

import com.medmanage.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, String> {
    Tag findByName(String name);
}