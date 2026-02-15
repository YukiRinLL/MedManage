package com.medmanage.repository;

import com.medmanage.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByPhone(String phone);
    boolean existsByPhone(String phone);
    
    // 管理员相关查询
    java.util.List<User> findByIsAdminTrue();
    java.util.List<User> findByIsAdminFalse();
    boolean existsByIsAdminTrueAndPhone(String phone);
}
