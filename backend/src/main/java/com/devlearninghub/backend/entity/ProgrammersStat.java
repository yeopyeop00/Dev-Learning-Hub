package com.devlearninghub.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "programmers_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProgrammersStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private int totalSolved;
    private int mainLevel;
    private int monthlySolved;

    @Column(columnDefinition = "TEXT")
    private String yearlyData;

    @Column(columnDefinition = "TEXT")
    private String levelDistribution;

    private LocalDateTime updatedAt;
}
