package com.medmanage.repository;

import com.medmanage.entity.DeviceToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceTokenRepository extends JpaRepository<DeviceToken, Long> {
    
    // 根据用户ID查找设备令牌
    List<DeviceToken> findByUserId(Long userId);
    
    // 根据令牌查找设备
    DeviceToken findByToken(String token);
    
    // 删除用户的所有设备令牌
    void deleteByUserId(Long userId);
}
