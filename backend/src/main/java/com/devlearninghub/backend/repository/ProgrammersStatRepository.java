package com.devlearninghub.backend.repository;

import com.devlearninghub.backend.entity.ProgrammersStat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProgrammersStatRepository extends JpaRepository<ProgrammersStat, Long> {
    Optional<ProgrammersStat> findByUserId(Long userId);
}
