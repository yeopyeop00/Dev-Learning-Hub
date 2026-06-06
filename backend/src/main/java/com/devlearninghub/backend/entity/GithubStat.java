package com.devlearninghub.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "github_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GithubStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private int weeklyCommits;
    private int activeRepos;
    private int streak;

    @Column(columnDefinition = "TEXT")
    private String weeklyData;

    @Column(columnDefinition = "TEXT")
    private String recentActivities;

    @Column(columnDefinition = "TEXT")
    private String monthlyData;

    @Column(columnDefinition = "TEXT")
    private String yearlyStat;

    private LocalDateTime updatedAt;
}
