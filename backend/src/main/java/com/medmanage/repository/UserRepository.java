package com.medmanage.repository;

import com.medmanage.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByPhone(String phone);
    boolean existsByPhone(String phone);
}
