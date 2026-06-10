package com.devlearninghub.backend.dto;

import com.devlearninghub.backend.entity.ProgrammersStat;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ProgrammersStatResponse {
    private Long id;
    private Long userId;
    private int totalSolved;
    private int mainLevel;
    private int monthlySolved;
    private String yearlyData;
    private String levelDistribution;
    private LocalDateTime updatedAt;

    public ProgrammersStatResponse(ProgrammersStat stat) {
        this.id = stat.getId();
        this.userId = stat.getUser().getId();
        this.totalSolved = stat.getTotalSolved();
        this.mainLevel = stat.getMainLevel();
        this.monthlySolved = stat.getMonthlySolved();
        this.yearlyData = stat.getYearlyData();
        this.levelDistribution = stat.getLevelDistribution();
        this.updatedAt = stat.getUpdatedAt();
    }
}
