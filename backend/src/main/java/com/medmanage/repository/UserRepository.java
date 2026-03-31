package com.medmanage.repository;

import com.medmanage.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {
    User findByPhone(String phone);
    boolean existsByPhone(String phone);
    boolean existsByIdCard(String idCard);
    boolean existsByTxNumber(String txNumber);
    Page<User> findAllByIdIn(List<String> ids, Pageable pageable);
}
