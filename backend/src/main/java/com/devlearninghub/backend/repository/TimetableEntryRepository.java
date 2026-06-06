package com.devlearninghub.backend.repository;

import com.devlearninghub.backend.entity.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface TimetableEntryRepository extends JpaRepository<TimetableEntry, Long> {
    List<TimetableEntry> findByUserId(Long userId);
    List<TimetableEntry> findByDayOfWeek(DayOfWeek dayOfWeek);
}
