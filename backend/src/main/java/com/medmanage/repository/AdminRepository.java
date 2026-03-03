package com.medmanage.repository;

import com.medmanage.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    
    Admin findByPhone(String phone);
    
    boolean existsByPhone(String phone);
    
    List<Admin> findByRole(Integer role);
    
    List<Admin> findAllByOrderByCreatedAtDesc();
}
