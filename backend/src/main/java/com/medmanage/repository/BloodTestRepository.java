package com.medmanage.repository;

import com.medmanage.entity.BloodTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface BloodTestRepository extends JpaRepository<BloodTest, String> {
    List<BloodTest> findByUserIdOrderByTestDateDesc(String userId);
    
    BloodTest findFirstByUserIdOrderByTestDateDesc(String userId);
    
    @Query("SELECT b FROM BloodTest b WHERE b.userId = :userId AND b.testDate BETWEEN :startDate AND :endDate ORDER BY b.testDate ASC")
    List<BloodTest> findByUserIdAndDateRange(@Param("userId") String userId, @Param("startDate") Date startDate, @Param("endDate") Date endDate);
    
    @Query("SELECT b FROM BloodTest b WHERE b.userId = :userId AND YEAR(b.testDate) = :year ORDER BY b.testDate ASC")
    List<BloodTest> findByUserIdAndYear(@Param("userId") String userId, @Param("year") int year);
    
    @Query("SELECT b FROM BloodTest b WHERE b.userId = :userId AND YEAR(b.testDate) = :year AND QUARTER(b.testDate) = :quarter ORDER BY b.testDate ASC")
    List<BloodTest> findByUserIdAndYearQuarter(@Param("userId") String userId, @Param("year") int year, @Param("quarter") int quarter);
}