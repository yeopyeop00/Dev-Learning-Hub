package com.devlearninghub.backend.repository;

import com.devlearninghub.backend.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByUserId(Long userId);
    List<ActivityLog> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<ActivityLog> findByUserIdAndSourceOrderByDateDesc(Long userId, String source);
}
