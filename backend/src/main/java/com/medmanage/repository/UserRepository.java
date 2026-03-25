package com.medmanage.repository;

import com.medmanage.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {
    User findByPhone(String phone);
    boolean existsByPhone(String phone);
    Page<User> findAllByIdIn(List<String> ids, Pageable pageable);
}
