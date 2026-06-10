package com.devlearninghub.backend.dto;

import com.devlearninghub.backend.entity.GithubStat;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class GithubStatResponse {
    private Long id;
    private Long userId;
    private int weeklyCommits;
    private int activeRepos;
    private int streak;
    private String weeklyData;
    private String recentActivities;
    private String monthlyData;
    private String yearlyStat;
    private LocalDateTime updatedAt;

    public GithubStatResponse(GithubStat stat) {
        this.id = stat.getId();
        this.userId = stat.getUser().getId();
        this.weeklyCommits = stat.getWeeklyCommits();
        this.activeRepos = stat.getActiveRepos();
        this.streak = stat.getStreak();
        this.weeklyData = stat.getWeeklyData();
        this.recentActivities = stat.getRecentActivities();
        this.monthlyData = stat.getMonthlyData();
        this.yearlyStat = stat.getYearlyStat();
        this.updatedAt = stat.getUpdatedAt();
    }
}
