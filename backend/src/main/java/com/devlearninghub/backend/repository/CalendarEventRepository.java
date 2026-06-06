package com.devlearninghub.backend.repository;

import com.devlearninghub.backend.entity.CalendarEvent;
import com.devlearninghub.backend.entity.EventType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByUserId(Long userId);
    List<CalendarEvent> findByDateAfter(LocalDate date);
    List<CalendarEvent> findByType(EventType type);
}
