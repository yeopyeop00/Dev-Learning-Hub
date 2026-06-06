package com.devlearninghub.backend.repository;

import com.devlearninghub.backend.entity.GithubStat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GithubStatRepository extends JpaRepository<GithubStat, Long> {
    Optional<GithubStat> findByUserId(Long userId);
}
